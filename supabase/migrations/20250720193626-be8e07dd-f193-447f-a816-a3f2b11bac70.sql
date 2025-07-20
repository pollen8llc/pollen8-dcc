-- Fix profile viewing by cleaning up conflicting RLS policies and ensuring proper access
-- First, drop all existing policies on profiles table to clean slate
DROP POLICY IF EXISTS "Allow authenticated users to delete their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Allow authenticated users to insert their profile" ON public.profiles;
DROP POLICY IF EXISTS "Allow authenticated users to update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Allow authenticated users to view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can view profiles based on connection visibility" ON public.profiles;
DROP POLICY IF EXISTS "Users can view their own profiles" ON public.profiles;
DROP POLICY IF EXISTS "profiles_insert_policy" ON public.profiles;
DROP POLICY IF EXISTS "profiles_select_policy" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update_policy" ON public.profiles;

-- Create clean, simplified policies that allow proper profile viewing
-- Policy 1: Users can always view their own profile
CREATE POLICY "Users can view their own profile" 
ON public.profiles FOR SELECT 
USING (auth.uid() = id);

-- Policy 2: Public profiles can be viewed by anyone authenticated
CREATE POLICY "Public profiles viewable by authenticated users" 
ON public.profiles FOR SELECT 
USING (
  auth.role() = 'authenticated' AND 
  ((privacy_settings->>'profile_visibility' = 'public') OR 
   (privacy_settings->>'profile_visibility' IS NULL)) -- Default to public if not set
);

-- Policy 3: Connected profiles can be viewed based on privacy settings
CREATE POLICY "Connected profiles viewable based on privacy" 
ON public.profiles FOR SELECT 
USING (
  auth.role() = 'authenticated' AND 
  can_view_profile(auth.uid(), id)
);

-- Policy 4: Admins can view all profiles
CREATE POLICY "Admins can view all profiles" 
ON public.profiles FOR SELECT 
USING (
  auth.role() = 'authenticated' AND 
  has_role(auth.uid(), 'ADMIN')
);

-- Insert policies: Users can only insert their own profile
CREATE POLICY "Users can insert their own profile" 
ON public.profiles FOR INSERT 
WITH CHECK (auth.uid() = id);

-- Update policies: Users can only update their own profile
CREATE POLICY "Users can update their own profile" 
ON public.profiles FOR UPDATE 
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Delete policies: Users can only delete their own profile
CREATE POLICY "Users can delete their own profile" 
ON public.profiles FOR DELETE 
USING (auth.uid() = id);