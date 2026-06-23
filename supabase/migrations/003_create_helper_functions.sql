-- Migration: Helper Functions and RPC for Character Consistency
-- Version: 003
-- Date: 2026-06-23
-- Description: Creates RPC functions for character operations

-- ============================================================================
-- Function: Increment generation count
-- ============================================================================
CREATE OR REPLACE FUNCTION increment_generation_count(char_id UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE characters
    SET generation_count = generation_count + 1,
        updated_at = NOW()
    WHERE id = char_id;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- Function: Get character with stats
-- ============================================================================
CREATE OR REPLACE FUNCTION get_character_with_stats(char_id UUID, user_uuid UUID)
RETURNS TABLE (
    id UUID,
    name VARCHAR(255),
    description TEXT,
    tags TEXT[],
    image_url TEXT,
    image_path TEXT,
    image_size INTEGER,
    image_mime VARCHAR(50),
    default_strength FLOAT,
    generation_count INTEGER,
    created_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ,
    recent_generations_count INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        c.id,
        c.name,
        c.description,
        c.tags,
        c.image_url,
        c.image_path,
        c.image_size,
        c.image_mime,
        c.default_strength,
        c.generation_count,
        c.created_at,
        c.updated_at,
        (
            SELECT COUNT(*) 
            FROM generations g 
            WHERE g.character_id = c.id 
            AND g.created_at > NOW() - INTERVAL '30 days'
        )::INTEGER AS recent_generations_count
    FROM characters c
    WHERE c.id = char_id 
        AND c.user_id = user_uuid
        AND c.deleted_at IS NULL;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- Function: Search characters by text
-- ============================================================================
CREATE OR REPLACE FUNCTION search_characters_by_text(
    user_uuid UUID,
    search_query TEXT,
    result_limit INTEGER DEFAULT 20,
    result_offset INTEGER DEFAULT 0
)
RETURNS TABLE (
    id UUID,
    name VARCHAR(255),
    description TEXT,
    tags TEXT[],
    image_url TEXT,
    image_path TEXT,
    generation_count INTEGER,
    created_at TIMESTAMPTZ,
    similarity_rank REAL
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        c.id,
        c.name,
        c.description,
        c.tags,
        c.image_url,
        c.image_path,
        c.generation_count,
        c.created_at,
        ts_rank(to_tsvector('simple', c.name || ' ' || array_to_string(c.tags, ' ')), query) AS similarity_rank
    FROM characters c,
         plainto_tsquery('simple', search_query) query
    WHERE c.user_id = user_uuid
        AND c.deleted_at IS NULL
        AND to_tsvector('simple', c.name || ' ' || array_to_string(c.tags, ' ')) @@ query
    ORDER BY similarity_rank DESC
    LIMIT result_limit
    OFFSET result_offset;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- Function: Get generation history with character info
-- ============================================================================
CREATE OR REPLACE FUNCTION get_generation_history(
    user_uuid UUID,
    char_id UUID DEFAULT NULL,
    result_limit INTEGER DEFAULT 20,
    result_offset INTEGER DEFAULT 0
)
RETURNS TABLE (
    id UUID,
    character_id UUID,
    character_name VARCHAR(255),
    character_thumbnail TEXT,
    prompt TEXT,
    image_url TEXT,
    image_path TEXT,
    similarity_score FLOAT,
    generation_time_ms INTEGER,
    status VARCHAR(20),
    created_at TIMESTAMPTZ
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        g.id,
        g.character_id,
        c.name AS character_name,
        c.image_url AS character_thumbnail,
        g.prompt,
        g.image_url,
        g.image_path,
        g.similarity_score,
        g.generation_time_ms,
        g.status,
        g.created_at
    FROM generations g
    LEFT JOIN characters c ON g.character_id = c.id
    WHERE g.user_id = user_uuid
        AND (char_id IS NULL OR g.character_id = char_id)
    ORDER BY g.created_at DESC
    LIMIT result_limit
    OFFSET result_offset;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- Function: Delete character and associated data (hard delete)
-- ============================================================================
CREATE OR REPLACE FUNCTION delete_character_full(char_id UUID, user_uuid UUID)
RETURNS BOOLEAN AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    -- Delete associated generations first
    DELETE FROM generations
    WHERE character_id = char_id AND user_id = user_uuid;
    
    -- Delete character
    DELETE FROM characters
    WHERE id = char_id AND user_id = user_uuid;
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    
    RETURN deleted_count > 0;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- Function: Get user statistics
-- ============================================================================
CREATE OR REPLACE FUNCTION get_user_stats(user_uuid UUID)
RETURNS TABLE (
    total_characters INTEGER,
    total_generations INTEGER,
    total_storage_bytes BIGINT,
    avg_similarity_score FLOAT,
    most_used_character_id UUID,
    most_used_character_name VARCHAR(255)
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        (SELECT COUNT(*) FROM characters WHERE user_id = user_uuid AND deleted_at IS NULL)::INTEGER AS total_characters,
        (SELECT COUNT(*) FROM generations WHERE user_id = user_uuid)::INTEGER AS total_generations,
        (
            SELECT COALESCE(SUM(image_size), 0)
            FROM (
                SELECT image_size FROM characters WHERE user_id = user_uuid AND deleted_at IS NULL
                UNION ALL
                SELECT image_size FROM generations WHERE user_id = user_uuid
            ) AS all_images
        )::BIGINT AS total_storage_bytes,
        (SELECT AVG(similarity_score) FROM generations WHERE user_id = user_uuid AND similarity_score IS NULL)::FLOAT AS avg_similarity_score,
        (
            SELECT c.id 
            FROM generations g
            JOIN characters c ON g.character_id = c.id
            WHERE g.user_id = user_uuid AND g.character_id IS NOT NULL
            GROUP BY c.id
            ORDER BY COUNT(*) DESC
            LIMIT 1
        ) AS most_used_character_id,
        (
            SELECT c.name 
            FROM generations g
            JOIN characters c ON g.character_id = c.id
            WHERE g.user_id = user_uuid AND g.character_id IS NOT NULL
            GROUP BY c.id, c.name
            ORDER BY COUNT(*) DESC
            LIMIT 1
        ) AS most_used_character_name;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- Comments
-- ============================================================================
COMMENT ON FUNCTION increment_generation_count IS 'Increments generation count for a character';
COMMENT ON FUNCTION get_character_with_stats IS 'Get character details with recent generation stats';
COMMENT ON FUNCTION search_characters_by_text IS 'Full-text search for characters by name and tags';
COMMENT ON FUNCTION get_generation_history IS 'Get generation history with character information';
COMMENT ON FUNCTION delete_character_full IS 'Hard delete character and associated generations';
COMMENT ON FUNCTION get_user_stats IS 'Get aggregated statistics for a user';
