-- Drop existing policies if they exist
DROP POLICY IF EXISTS "uploads_select_all" ON storage.objects;
DROP POLICY IF EXISTS "uploads_insert_authenticated" ON storage.objects;
DROP POLICY IF EXISTS "uploads_delete_own" ON storage.objects;
DROP POLICY IF EXISTS "uploads_update_own" ON storage.objects;

-- Recreate the uploads bucket (if it doesn't exist)
INSERT INTO storage.buckets (id, name, public)
VALUES ('uploads', 'uploads', true)
ON CONFLICT (id) DO UPDATE
SET public = true;

-- Allow anyone to view uploads (public bucket)
CREATE POLICY "uploads_select_all"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'uploads');

-- Allow authenticated users to upload files
CREATE POLICY "uploads_insert_authenticated"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'uploads' 
  AND auth.role() = 'authenticated'
);

-- Allow users to update their own files
CREATE POLICY "uploads_update_own"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'uploads' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow users to delete their own files
CREATE POLICY "uploads_delete_own"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'uploads' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);
