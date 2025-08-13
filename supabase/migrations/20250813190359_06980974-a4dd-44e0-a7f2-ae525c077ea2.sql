-- Add username column to profiles table if it doesn't exist
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS username TEXT;

-- Create unique index on username (allowing nulls for now during migration)
CREATE UNIQUE INDEX IF NOT EXISTS profiles_username_unique ON public.profiles (username) WHERE username IS NOT NULL;

-- Create a function to generate usernames from email for existing users
CREATE OR REPLACE FUNCTION public.generate_username_from_email(email_input text)
RETURNS text
LANGUAGE plpgsql
AS $$
DECLARE
  base_username text;
  final_username text;
  counter integer := 1;
BEGIN
  -- Extract username part from email (before @)
  base_username := split_part(email_input, '@', 1);
  
  -- Remove non-alphanumeric characters and convert to lowercase
  base_username := lower(regexp_replace(base_username, '[^a-zA-Z0-9]', '', 'g'));
  
  -- Ensure it's not empty
  IF length(base_username) = 0 THEN
    base_username := 'user';
  END IF;
  
  -- Find a unique username
  final_username := base_username;
  
  WHILE EXISTS (SELECT 1 FROM public.profiles WHERE username = final_username) LOOP
    final_username := base_username || counter::text;
    counter := counter + 1;
  END LOOP;
  
  RETURN final_username;
END;
$$;

-- Update existing profiles to have usernames
UPDATE public.profiles 
SET username = public.generate_username_from_email(email)
WHERE username IS NULL AND email IS NOT NULL;

-- Drop the temporary function
DROP FUNCTION public.generate_username_from_email(text);

-- Update knowledge_comment_mentions to use username instead of user_id
ALTER TABLE public.knowledge_comment_mentions ADD COLUMN IF NOT EXISTS mentioned_username TEXT;

-- Populate mentioned_username from existing mentioned_user_id
UPDATE public.knowledge_comment_mentions 
SET mentioned_username = (
  SELECT username 
  FROM public.profiles 
  WHERE id = knowledge_comment_mentions.mentioned_user_id
)
WHERE mentioned_username IS NULL;