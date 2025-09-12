-- Ensure profiles table has correct constraints and indexes for user_id
-- This migration fixes profile querying issues and prevents duplicate key violations

-- Ensure unique constraint exists on user_id (should already exist based on error message)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'profiles_user_id_key' 
    AND conrelid = 'public.profiles'::regclass
  ) THEN
    ALTER TABLE public.profiles ADD CONSTRAINT profiles_user_id_key UNIQUE (user_id);
  END IF;
END $$;

-- Add index for performance on user_id queries
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON public.profiles(user_id);

-- Ensure profile_complete column exists (fallback if using legacy is_profile_complete)
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS profile_complete BOOLEAN DEFAULT false;

-- Backfill profile_complete from is_profile_complete if that legacy column exists
DO $$ 
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema='public' AND table_name='profiles' AND column_name='is_profile_complete'
  ) THEN
    UPDATE public.profiles
    SET profile_complete = COALESCE(profile_complete, is_profile_complete)
    WHERE profile_complete IS NULL OR profile_complete = false;
  END IF;
END $$;