-- Migration: Setup Supabase Storage Buckets
-- Version: 002
-- Date: 2026-06-23
-- Description: Creates storage buckets for character reference and generated images

-- ============================================================================
-- Storage Bucket: reference-images
-- For storing character reference images uploaded by users
-- ============================================================================

-- Insert bucket if not exists
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'reference-images',
    'reference-images',
    true,
    10485760, -- 10MB
    ARRAY['image/jpeg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO UPDATE SET
    public = true,
    file_size_limit = 10485760,
    allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp'];

-- RLS Policies for reference-images bucket
CREATE POLICY "Users can upload own reference images"
    ON storage.objects FOR INSERT
    WITH CHECK (
        bucket_id = 'reference-images' 
        AND auth.uid()::text = (storage.foldername(name))[1]
    );

CREATE POLICY "Users can view own reference images"
    ON storage.objects FOR SELECT
    USING (
        bucket_id = 'reference-images' 
        AND auth.uid()::text = (storage.foldername(name))[1]
    );

CREATE POLICY "Users can update own reference images"
    ON storage.objects FOR UPDATE
    USING (
        bucket_id = 'reference-images' 
        AND auth.uid()::text = (storage.foldername(name))[1]
    );

CREATE POLICY "Users can delete own reference images"
    ON storage.objects FOR DELETE
    USING (
        bucket_id = 'reference-images' 
        AND auth.uid()::text = (storage.foldername(name))[1]
    );

-- ============================================================================
-- Storage Bucket: generated-images
-- For storing AI-generated images with character consistency
-- ============================================================================

-- Insert bucket if not exists
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'generated-images',
    'generated-images',
    true,
    10485760, -- 10MB
    ARRAY['image/jpeg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO UPDATE SET
    public = true,
    file_size_limit = 10485760,
    allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp'];

-- RLS Policies for generated-images bucket
CREATE POLICY "Users can upload own generated images"
    ON storage.objects FOR INSERT
    WITH CHECK (
        bucket_id = 'generated-images' 
        AND auth.uid()::text = (storage.foldername(name))[1]
    );

CREATE POLICY "Users can view own generated images"
    ON storage.objects FOR SELECT
    USING (
        bucket_id = 'generated-images' 
        AND auth.uid()::text = (storage.foldername(name))[1]
    );

CREATE POLICY "Users can delete own generated images"
    ON storage.objects FOR DELETE
    USING (
        bucket_id = 'generated-images' 
        AND auth.uid()::text = (storage.foldername(name))[1]
    );

-- ============================================================================
-- Storage Functions
-- ============================================================================

-- Function to get public URL for an object
CREATE OR REPLACE FUNCTION get_public_url(bucket_name TEXT, object_path TEXT)
RETURNS TEXT AS $$
BEGIN
    RETURN storage.get_public_url(bucket_name, object_path);
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- Comments
-- ============================================================================
COMMENT ON TABLE storage.buckets IS 'Supabase storage buckets configuration';
COMMENT ON TABLE storage.objects IS 'Stored objects (files) in Supabase storage';
