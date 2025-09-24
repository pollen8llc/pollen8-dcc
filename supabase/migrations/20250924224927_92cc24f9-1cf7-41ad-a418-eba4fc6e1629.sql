-- Update the handle_new_user function to automatically set Magnetosphere as default avatar
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
DECLARE
    v_role_id UUID;
    v_first_name TEXT;
    v_last_name TEXT;
    v_email TEXT;
    v_user_role TEXT;
    v_magnetosphere_id UUID;
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
    
    -- Get Magnetosphere avatar ID
    SELECT id INTO v_magnetosphere_id 
    FROM public.ions_avatar 
    WHERE name = 'Magnetosphere' AND is_active = true;
    
    -- Create comprehensive profile with default Magnetosphere avatar
    INSERT INTO public.profiles (
        user_id, 
        email, 
        first_name, 
        last_name,
        role,
        privacy_settings,
        selected_avatar_id,
        unlocked_avatars
    ) VALUES (
        NEW.id,
        v_email,
        v_first_name,
        v_last_name,
        v_user_role,
        '{"contact_visibility": "members", "profile_visibility": "public"}'::jsonb,
        v_magnetosphere_id,
        CASE 
            WHEN v_magnetosphere_id IS NOT NULL THEN ARRAY[v_magnetosphere_id::text]
            ELSE ARRAY[]::text[]
        END
    );
    
    -- Assign the appropriate role
    IF v_role_id IS NOT NULL THEN
        INSERT INTO public.user_roles (user_id, role_id, assigned_by)
        VALUES (NEW.id, v_role_id, NEW.id);
    END IF;
    
    RETURN NEW;
END;
$function$;