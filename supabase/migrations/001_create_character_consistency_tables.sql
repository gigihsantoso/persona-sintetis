-- Migration: Create Character Consistency Tables
-- Version: 001
-- Date: 2026-06-23
-- Description: Creates tables for character consistency feature with pgvector support

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS vector;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- Table: characters
-- Stores character reference images and their CLIP embeddings
-- ============================================================================
CREATE TABLE characters (
    -- Primary Key
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- User Ownership (RLS enforced)
    user_id         UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Character Metadata
    name            VARCHAR(255) NOT NULL,
    description     TEXT,
    tags            TEXT[] DEFAULT '{}',
    
    -- Image Storage
    image_url       TEXT NOT NULL,
    image_path      TEXT NOT NULL,  -- Storage path: user_id/character_id.png
    image_size      INTEGER,        -- File size in bytes
    image_mime      VARCHAR(50),    -- MIME type: image/jpeg, image/png
    
    -- Character Embedding (CLIP ViT-B/32 = 512 dimensions)
    embedding       VECTOR(512) NOT NULL,
    
    -- Consistency Settings
    default_strength FLOAT DEFAULT 0.8 CHECK (default_strength BETWEEN 0.5 AND 1.0),
    
    -- Statistics
    generation_count INTEGER DEFAULT 0,
    
    -- Timestamps
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW(),
    
    -- Soft Delete (optional)
    deleted_at      TIMESTAMPTZ
);

-- Index for vector similarity search (IVFFlat for performance)
CREATE INDEX characters_embedding_idx 
    ON characters 
    USING ivfflat (embedding vector_cosine_ops)
    WITH (lists = 100);

-- Index for user filtering
CREATE INDEX characters_user_id_idx ON characters (user_id);

-- Index for text search
CREATE INDEX characters_name_idx ON characters USING gin (to_tsvector('simple', name));

-- Index for tags search
CREATE INDEX characters_tags_idx ON characters USING gin (tags);

-- ============================================================================
-- Table: generations
-- Stores generated images with character consistency metadata
-- ============================================================================
CREATE TABLE generations (
    -- Primary Key
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- User Ownership
    user_id             UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Character Reference (nullable for non-consistent generations)
    character_id        UUID REFERENCES characters(id) ON DELETE SET NULL,
    
    -- Generation Parameters
    prompt              TEXT NOT NULL,
    negative_prompt     TEXT,
    action              VARCHAR(100),     -- standing, sitting, running, etc.
    location            VARCHAR(255),     -- background/scene
    outfit              VARCHAR(100),     -- casual, formal, costume, etc.
    
    -- Consistency Settings Used
    consistency_strength FLOAT DEFAULT 0.8,
    
    -- Output
    image_url           TEXT NOT NULL,
    image_path          TEXT NOT NULL,
    image_size          INTEGER,
    image_mime          VARCHAR(50),
    width               INTEGER DEFAULT 1024,
    height              INTEGER DEFAULT 1024,
    
    -- Quality Metrics
    similarity_score    FLOAT,            -- Cosine similarity to reference (0-1)
    generation_time_ms  INTEGER,          -- Time taken in milliseconds
    
    -- Cloudflare AI Metadata
    model_used          VARCHAR(100) DEFAULT 'sdxl-turbo',
    ip_adapter_weight   FLOAT DEFAULT 0.8,
    controlnet_enabled  BOOLEAN DEFAULT false,
    
    -- Status
    status              VARCHAR(20) DEFAULT 'completed',  -- pending, processing, completed, failed
    error_message       TEXT,
    
    -- Timestamps
    created_at          TIMESTAMPTZ DEFAULT NOW()
);

-- Index for character lookup
CREATE INDEX generations_character_id_idx ON generations (character_id);

-- Index for user filtering
CREATE INDEX generations_user_id_idx ON generations (user_id);

-- Index for status filtering
CREATE INDEX generations_status_idx ON generations (status);

-- Composite index for common queries
CREATE INDEX generations_user_character_idx ON generations (user_id, character_id);

-- ============================================================================
-- Trigger: Update updated_at timestamp
-- ============================================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER characters_updated_at
    BEFORE UPDATE ON characters
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- Row Level Security (RLS) Policies
-- ============================================================================

-- Enable RLS
ALTER TABLE characters ENABLE ROW LEVEL SECURITY;
ALTER TABLE generations ENABLE ROW LEVEL SECURITY;

-- Characters: Users can only access their own
CREATE POLICY "Users can view own characters"
    ON characters FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own characters"
    ON characters FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own characters"
    ON characters FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own characters"
    ON characters FOR DELETE
    USING (auth.uid() = user_id);

-- Generations: Users can only access their own
CREATE POLICY "Users can view own generations"
    ON generations FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own generations"
    ON generations FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own generations"
    ON generations FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own generations"
    ON generations FOR DELETE
    USING (auth.uid() = user_id);

-- ============================================================================
-- Helper Functions
-- ============================================================================

-- Function to calculate cosine similarity between two embeddings
CREATE OR REPLACE FUNCTION calculate_similarity(embedding1 VECTOR(512), embedding2 VECTOR(512))
RETURNS FLOAT AS $$
BEGIN
    RETURN 1 - (embedding1 <=> embedding2);
END;
$$ LANGUAGE plpgsql;

-- Function to search similar characters
CREATE OR REPLACE FUNCTION search_similar_characters(
    target_embedding VECTOR(512),
    target_user_id UUID,
    result_limit INTEGER DEFAULT 10,
    similarity_threshold FLOAT DEFAULT 0.5
)
RETURNS TABLE (
    id UUID,
    name VARCHAR(255),
    image_url TEXT,
    similarity FLOAT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        c.id,
        c.name,
        c.image_url,
        1 - (c.embedding <=> target_embedding) AS similarity
    FROM characters c
    WHERE c.user_id = target_user_id
        AND c.deleted_at IS NULL
        AND 1 - (c.embedding <=> target_embedding) >= similarity_threshold
    ORDER BY c.embedding <=> target_embedding
    LIMIT result_limit;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- Comments for documentation
-- ============================================================================
COMMENT ON TABLE characters IS 'Stores character reference images and CLIP embeddings for consistency';
COMMENT ON TABLE generations IS 'Stores generated images with character consistency metadata';
COMMENT ON COLUMN characters.embedding IS 'CLIP ViT-B/32 embedding (512 dimensions) of character reference image';
COMMENT ON COLUMN generations.similarity_score IS 'Cosine similarity score between generated image and character reference (0-1)';
