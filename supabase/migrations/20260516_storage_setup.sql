-- Ensure the 'media' bucket exists
INSERT INTO storage.buckets (id, name, public)
VALUES ('media', 'media', true)
ON CONFLICT (id) DO NOTHING;

-- Set up RLS for Storage
-- Allow anyone to read public media
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'media' );

-- Allow authenticated users to upload media
CREATE POLICY "Authenticated users can upload media"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'media' AND
  auth.role() = 'authenticated'
);

-- Allow users to delete their own media (assuming path starts with user_id)
CREATE POLICY "Users can delete their own media"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'media' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- RLS for public.media table
ALTER TABLE media ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage media of their websites" ON media;
CREATE POLICY "Users can manage media of their websites" ON media
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM websites 
    WHERE websites.id = media.website_id 
    AND websites.owner_id = auth.uid()
  )
);

DROP POLICY IF EXISTS "Public read access for media" ON media;
CREATE POLICY "Public read access for media" ON media
FOR SELECT USING (true);
