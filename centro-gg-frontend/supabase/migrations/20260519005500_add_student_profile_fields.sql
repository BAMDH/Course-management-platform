-- 20260519005500_add_student_profile_fields.sql
-- Adds missing profile fields for the Student Profile and creates avatars storage

BEGIN;

-- Add new columns to profiles
ALTER TABLE public.profiles 
  ADD COLUMN IF NOT EXISTS cedula text,
  ADD COLUMN IF NOT EXISTS level text,
  ADD COLUMN IF NOT EXISTS provincia text,
  ADD COLUMN IF NOT EXISTS canton text,
  ADD COLUMN IF NOT EXISTS distrito text,
  ADD COLUMN IF NOT EXISTS direccion_exacta text;

-- Insert the 'avatars' bucket into storage.buckets if it does not exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Set up RLS policies for the avatars bucket
-- 1. Allow public read access to avatars
CREATE POLICY "Public Access" ON storage.objects
  FOR SELECT
  USING ( bucket_id = 'avatars' );

-- 2. Allow authenticated users to upload their own avatar
CREATE POLICY "Authenticated users can upload avatars" ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'avatars' AND 
    auth.uid() = owner
  );

-- 3. Allow users to update their own avatar
CREATE POLICY "Users can update their own avatars" ON storage.objects
  FOR UPDATE
  USING (
    bucket_id = 'avatars' AND 
    auth.uid() = owner
  );

-- 4. Allow users to delete their own avatar
CREATE POLICY "Users can delete their own avatars" ON storage.objects
  FOR DELETE
  USING (
    bucket_id = 'avatars' AND 
    auth.uid() = owner
  );

COMMIT;
