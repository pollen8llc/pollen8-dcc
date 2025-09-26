-- Update all profiles to use the specified avatar ID
UPDATE public.profiles 
SET 
  selected_avatar_id = 'a038a996-f284-4090-9cfa-f6c8bb83a1b9',
  updated_at = now()
WHERE selected_avatar_id IS DISTINCT FROM 'a038a996-f284-4090-9cfa-f6c8bb83a1b9';