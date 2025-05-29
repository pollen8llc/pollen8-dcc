
-- Drop and recreate the get_highest_role function with correct parameters
CREATE OR REPLACE FUNCTION public.get_highest_role(user_id UUID)
RETURNS TEXT
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Check for admin role first
  IF public.has_role(user_id, 'ADMIN') THEN
    RETURN 'ADMIN';
  END IF;
  
  -- Check for organizer role next
  IF public.has_role(user_id, 'ORGANIZER') THEN
    RETURN 'ORGANIZER';
  END IF;
  
  -- Check for member role next
  IF public.has_role(user_id, 'MEMBER') THEN
    RETURN 'MEMBER';
  END IF;
  
  -- Default to GUEST
  RETURN 'GUEST';
END;
$$;
