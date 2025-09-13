-- First, update the has_role function to check both user_roles and admin_roles tables
CREATE OR REPLACE FUNCTION public.has_role(user_id uuid, role_name text)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (
        -- Check new user_roles table
        SELECT 1 
        FROM public.user_roles ur 
        JOIN public.roles r ON ur.role_id = r.id 
        WHERE ur.user_id = $1 AND r.name = $2
    ) OR EXISTS (
        -- Also check legacy admin_roles table
        SELECT 1 
        FROM public.admin_roles ar
        WHERE ar.user_id = $1 AND ar.role = $2
    );
$$;

-- Backfill admin users from admin_roles into user_roles and profiles
DO $$
DECLARE
    admin_user RECORD;
    admin_role_id UUID;
BEGIN
    -- Get the ADMIN role ID
    SELECT id INTO admin_role_id FROM public.roles WHERE name = 'ADMIN';
    
    IF admin_role_id IS NULL THEN
        RAISE EXCEPTION 'ADMIN role not found in roles table';
    END IF;
    
    -- Process each admin user from admin_roles table
    FOR admin_user IN SELECT DISTINCT user_id FROM public.admin_roles WHERE role = 'ADMIN'
    LOOP
        -- Insert into user_roles if not exists
        INSERT INTO public.user_roles (user_id, role_id, assigned_by)
        VALUES (admin_user.user_id, admin_role_id, admin_user.user_id)
        ON CONFLICT (user_id, role_id) DO NOTHING;
        
        -- Update profiles table to cache the role
        UPDATE public.profiles 
        SET role = 'ADMIN', updated_at = NOW()
        WHERE user_id = admin_user.user_id;
        
        RAISE NOTICE 'Backfilled admin user: %', admin_user.user_id;
    END LOOP;
END
$$;

-- Update the update_user_role function to handle assigner_id properly
CREATE OR REPLACE FUNCTION public.update_user_role(p_user_id uuid, p_role_name text, p_assigner_id uuid DEFAULT NULL::uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_role_id UUID;
    v_assigner_id UUID;
BEGIN
    -- Use current authenticated user as assigner if not provided
    v_assigner_id := COALESCE(p_assigner_id, auth.uid());
    
    -- Verify assigner has admin role using the updated has_role function
    IF NOT public.has_role(v_assigner_id, 'ADMIN') THEN
        RAISE EXCEPTION 'Only admins can update user roles';
    END IF;
    
    -- Get role ID
    SELECT id INTO v_role_id FROM public.roles WHERE name = p_role_name;
    
    IF v_role_id IS NULL THEN
        RAISE EXCEPTION 'Role % does not exist', p_role_name;
    END IF;
    
    -- Remove existing roles for this user
    DELETE FROM public.user_roles WHERE user_id = p_user_id;
    
    -- Add new role
    INSERT INTO public.user_roles (user_id, role_id, assigned_by)
    VALUES (p_user_id, v_role_id, v_assigner_id);
    
    -- Update role cache in profiles table
    UPDATE public.profiles 
    SET role = p_role_name, updated_at = NOW()
    WHERE user_id = p_user_id;
    
    RETURN true;
END;
$$;