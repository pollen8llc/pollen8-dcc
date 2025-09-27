-- Drop avatar-related functions first
DROP FUNCTION IF EXISTS public.get_selected_avatar_id(uuid);
DROP FUNCTION IF EXISTS public.update_user_avatar_admin(uuid, uuid);

-- Remove avatar-related columns from profiles table
ALTER TABLE public.profiles 
  DROP COLUMN IF EXISTS selected_avatar_id,
  DROP COLUMN IF EXISTS unlocked_avatars;

-- Drop the ions_avatar table completely
DROP TABLE IF EXISTS public.ions_avatar CASCADE;