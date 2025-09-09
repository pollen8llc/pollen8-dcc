-- Fix Function Search Path Security Issues

-- Update all SECURITY DEFINER functions to have explicit search_path
CREATE OR REPLACE FUNCTION public.has_role(user_id uuid, role_name text)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1 
        FROM public.user_roles ur 
        JOIN public.roles r ON ur.role_id = r.id 
        WHERE ur.user_id = $1 AND r.name = $2
    )
$$;

CREATE OR REPLACE FUNCTION public.get_user_roles(user_id uuid)
RETURNS TABLE(role_name text, role_description text, assigned_at timestamp with time zone)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT r.name, r.description, ur.assigned_at
    FROM public.user_roles ur
    JOIN public.roles r ON ur.role_id = r.id
    WHERE ur.user_id = $1
    ORDER BY ur.assigned_at DESC
$$;

CREATE OR REPLACE FUNCTION public.is_admin(user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT public.has_role($1, 'ADMIN')
$$;

CREATE OR REPLACE FUNCTION public.get_highest_role(user_id uuid)
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT r.name
    FROM public.user_roles ur
    JOIN public.roles r ON ur.role_id = r.id
    WHERE ur.user_id = $1
    ORDER BY 
        CASE r.name 
            WHEN 'ADMIN' THEN 1
            WHEN 'ORGANIZER' THEN 2
            WHEN 'SERVICE_PROVIDER' THEN 3
            WHEN 'MEMBER' THEN 4
            ELSE 5
        END
    LIMIT 1
$$;

CREATE OR REPLACE FUNCTION public.update_user_role(p_user_id uuid, p_role_name text, p_assigner_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_role_id uuid;
BEGIN
    -- Get role ID
    SELECT id INTO v_role_id FROM public.roles WHERE name = p_role_name;
    
    IF v_role_id IS NULL THEN
        RAISE EXCEPTION 'Role % does not exist', p_role_name;
    END IF;
    
    -- Remove existing roles for this user
    DELETE FROM public.user_roles WHERE user_id = p_user_id;
    
    -- Add new role
    INSERT INTO public.user_roles (user_id, role_id, assigned_by)
    VALUES (p_user_id, v_role_id, p_assigner_id);
    
    RETURN true;
END;
$$;

CREATE OR REPLACE FUNCTION public.get_managed_communities(user_id uuid)
RETURNS TABLE(community_id uuid, community_name text, member_count integer)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT c.id, c.name, 0 as member_count
    FROM public.communities c
    WHERE c.owner_id = $1
    ORDER BY c.created_at DESC
$$;

CREATE OR REPLACE FUNCTION public.handle_profile_update()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    NEW.updated_at = now();
    
    -- Update profile completeness
    NEW.is_profile_complete = (
        NEW.first_name IS NOT NULL AND 
        NEW.last_name IS NOT NULL AND 
        NEW.bio IS NOT NULL AND 
        length(NEW.bio) > 10
    );
    
    -- Update full_name
    NEW.full_name = trim(concat(NEW.first_name, ' ', NEW.last_name));
    
    RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_member_role_id uuid;
BEGIN
    -- Get member role ID
    SELECT id INTO v_member_role_id FROM public.roles WHERE name = 'MEMBER';
    
    -- Create profile
    INSERT INTO public.profiles (user_id, email, first_name, last_name)
    VALUES (
        NEW.id,
        NEW.email,
        NEW.raw_user_meta_data->>'first_name',
        NEW.raw_user_meta_data->>'last_name'
    );
    
    -- Assign default MEMBER role
    IF v_member_role_id IS NOT NULL THEN
        INSERT INTO public.user_roles (user_id, role_id, assigned_by)
        VALUES (NEW.id, v_member_role_id, NEW.id);
    END IF;
    
    RETURN NEW;
END;
$$;