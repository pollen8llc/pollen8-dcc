-- Update the handle_new_user function to remove avatar system references
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
    v_role_id UUID;
    v_first_name TEXT;
    v_last_name TEXT;
    v_email TEXT;
    v_user_role TEXT;
BEGIN
    -- Extract metadata
    v_first_name := NEW.raw_user_meta_data->>'first_name';
    v_last_name := NEW.raw_user_meta_data->>'last_name';
    v_email := COALESCE(NEW.email, NEW.raw_user_meta_data->>'email');
    v_user_role := COALESCE(NEW.raw_user_meta_data->>'role', 'MEMBER');
    
    -- Get role ID for the specified role
    SELECT id INTO v_role_id FROM public.roles WHERE name = v_user_role;
    
    -- If role doesn't exist, default to MEMBER
    IF v_role_id IS NULL THEN
        SELECT id INTO v_role_id FROM public.roles WHERE name = 'MEMBER';
        v_user_role := 'MEMBER';
    END IF;
    
    -- Create profile without avatar references
    INSERT INTO public.profiles (
        user_id, 
        email, 
        first_name, 
        last_name,
        role,
        privacy_settings
    ) VALUES (
        NEW.id,
        v_email,
        v_first_name,
        v_last_name,
        v_user_role,
        '{"contact_visibility": "members", "profile_visibility": "public"}'::jsonb
    );
    
    -- Assign the appropriate role
    IF v_role_id IS NOT NULL THEN
        INSERT INTO public.user_roles (user_id, role_id, assigned_by)
        VALUES (NEW.id, v_role_id, NEW.id);
    END IF;
    
    RETURN NEW;
END;
$$;