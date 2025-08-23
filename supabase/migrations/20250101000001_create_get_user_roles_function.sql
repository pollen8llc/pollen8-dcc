-- Create the get_user_roles function
-- This function returns an array of role names for a given user

CREATE OR REPLACE FUNCTION public.get_user_roles(user_id UUID)
RETURNS TEXT[]
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    roles TEXT[] := ARRAY[]::TEXT[];
BEGIN
    -- Get roles from user_roles table
    SELECT ARRAY_AGG(role) INTO roles
    FROM public.user_roles
    WHERE user_id = get_user_roles.user_id;
    
    -- If no roles found, initialize as empty array
    IF roles IS NULL THEN
        roles := ARRAY[]::TEXT[];
    END IF;
    
    -- Get admin roles and append them
    SELECT roles || ARRAY_AGG(role) INTO roles
    FROM public.admin_roles
    WHERE user_id = get_user_roles.user_id;
    
    -- Return unique roles
    RETURN ARRAY(
        SELECT DISTINCT unnest(roles)
        ORDER BY unnest
    );
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.get_user_roles(UUID) TO authenticated;
