-- Add Pulsar avatar to ions_avatar table
INSERT INTO ions_avatar (
    name,
    svg_definition,
    color_scheme,
    animation_type,
    rarity_tier,
    network_score_threshold,
    is_active
) VALUES (
    'Pulsar',
    '<svg width="100%" height="100%" viewBox="0 0 64 64" className="w-full h-full">
        <defs>
            <radialGradient id="pulsar-core" cx="50%" cy="50%" r="30%">
                <stop offset="0%" stopColor="hsl(var(--primary))" />
                <stop offset="70%" stopColor="hsl(var(--accent))" />
                <stop offset="100%" stopColor="hsl(var(--secondary))" />
            </radialGradient>
            <linearGradient id="pulsar-beam" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="hsl(var(--primary) / 0)" />
                <stop offset="20%" stopColor="hsl(var(--primary) / 0.8)" />
                <stop offset="50%" stopColor="hsl(var(--accent) / 1)" />
                <stop offset="80%" stopColor="hsl(var(--primary) / 0.8)" />
                <stop offset="100%" stopColor="hsl(var(--primary) / 0)" />
            </linearGradient>
        </defs>
        
        <!-- Rotating beam lines -->
        <g>
            <line x1="8" y1="32" x2="56" y2="32" stroke="url(#pulsar-beam)" strokeWidth="2" opacity="0.6">
                <animateTransform attributeName="transform" type="rotate" 
                    values="0 32 32;360 32 32" dur="3s" repeatCount="indefinite" />
            </line>
            <line x1="32" y1="8" x2="32" y2="56" stroke="url(#pulsar-beam)" strokeWidth="2" opacity="0.6">
                <animateTransform attributeName="transform" type="rotate" 
                    values="45 32 32;405 32 32" dur="3s" repeatCount="indefinite" />
            </line>
        </g>
        
        <!-- Outer pulsing ring -->
        <circle cx="32" cy="32" r="20" fill="none" stroke="hsl(var(--primary) / 0.3)" strokeWidth="1">
            <animate attributeName="r" values="18;22;18" dur="2s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.3;0.7;0.3" dur="2s" repeatCount="indefinite" />
        </circle>
        
        <!-- Core pulsar -->
        <circle cx="32" cy="32" r="6" fill="url(#pulsar-core)">
            <animate attributeName="r" values="6;8;6" dur="1.5s" repeatCount="indefinite" />
        </circle>
        
        <!-- Inner bright pulse -->
        <circle cx="32" cy="32" r="3" fill="hsl(var(--accent))">
            <animate attributeName="opacity" values="1;0.3;1" dur="1.5s" repeatCount="indefinite" />
        </circle>
    </svg>',
    '{"primary": "hsl(var(--primary))", "secondary": "hsl(var(--secondary))", "accent": "hsl(var(--accent))"}',
    'rotate',
    'common',
    0,
    true
);

-- Update the handle_new_user function to use Pulsar as default instead of Magnetosphere
CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
    v_role_id UUID;
    v_first_name TEXT;
    v_last_name TEXT;
    v_email TEXT;
    v_user_role TEXT;
    v_pulsar_id UUID;
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
    
    -- Get Pulsar avatar ID (new default)
    SELECT id INTO v_pulsar_id 
    FROM public.ions_avatar 
    WHERE name = 'Pulsar' AND is_active = true;
    
    -- Create comprehensive profile with default Pulsar avatar
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
        v_pulsar_id,
        CASE 
            WHEN v_pulsar_id IS NOT NULL THEN ARRAY[v_pulsar_id::text]
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