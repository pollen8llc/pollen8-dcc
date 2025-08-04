-- Add phone and website fields to profiles table
ALTER TABLE public.profiles 
ADD COLUMN phone text,
ADD COLUMN website text;