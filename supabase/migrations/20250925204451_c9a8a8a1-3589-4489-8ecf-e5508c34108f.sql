-- Create an admin function to update user avatars
CREATE OR REPLACE FUNCTION public.update_user_avatar_admin(
    target_user_id UUID,
    new_avatar_id UUID
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    -- Check if the current user is an admin
    IF NOT public.has_role(auth.uid(), 'ADMIN') THEN
        RAISE EXCEPTION 'Only admins can update user avatars';
    END IF;
    
    -- Update the user's avatar
    UPDATE public.profiles 
    SET 
        selected_avatar_id = new_avatar_id,
        unlocked_avatars = CASE 
            WHEN new_avatar_id::text = ANY(unlocked_avatars) THEN unlocked_avatars
            ELSE array_append(unlocked_avatars, new_avatar_id::text)
        END,
        updated_at = now()
    WHERE user_id = target_user_id;
    
    -- Check if the update was successful
    IF NOT FOUND THEN
        RAISE EXCEPTION 'User not found: %', target_user_id;
    END IF;
    
    RETURN true;
END;
$$;