-- ================================================
-- PHASE 1: CORE USER & AUTHENTICATION SYSTEM REBUILD
-- Using platform code as source of truth
-- ================================================

-- ================================================
-- 1. ENHANCE PROFILES TABLE TO MATCH PLATFORM CODE
-- ================================================

-- Add missing columns to profiles table to match UnifiedProfile interface
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS phone TEXT,
ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'MEMBER',
ADD COLUMN IF NOT EXISTS profile_complete BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS last_login_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS communities TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS managed_communities TEXT[] DEFAULT '{}';

-- Add module completion tracking fields
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS rel8_complete BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS modul8_setup_complete BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS eco8_setup_complete BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS nmn8_setup_complete BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS labr8_setup_complete BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS onboarding_complete BOOLEAN DEFAULT false;

-- ================================================
-- 2. CREATE COMPREHENSIVE RPC FUNCTIONS
-- ================================================

-- Enhanced get_highest_role function that matches platform expectations
CREATE OR REPLACE FUNCTION public.get_highest_role(user_id UUID)
RETURNS TEXT
LANGUAGE SQL
STABLE SECURITY DEFINER
SET search_path = public
AS $$
    SELECT COALESCE(
        (SELECT r.name
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
         LIMIT 1),
        'MEMBER'
    );
$$;

-- Function to check if user is community owner (used by usePermissions)
CREATE OR REPLACE FUNCTION public.is_community_owner(user_id UUID, community_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.communities 
        WHERE id = $2 AND owner_id = $1
    );
$$;

-- Function to get managed communities with stats
CREATE OR REPLACE FUNCTION public.get_managed_communities_detailed(user_id UUID)
RETURNS TABLE(
    community_id UUID,
    community_name TEXT,
    member_count INTEGER,
    created_at TIMESTAMP WITH TIME ZONE,
    is_public BOOLEAN,
    type TEXT
)
LANGUAGE SQL
STABLE SECURITY DEFINER
SET search_path = public
AS $$
    SELECT 
        c.id,
        c.name,
        public.get_community_member_count(c.id),
        c.created_at,
        c.is_public,
        c.type
    FROM public.communities c
    WHERE c.owner_id = $1
    ORDER BY c.created_at DESC;
$$;

-- Function to get user profile with role (used extensively in platform)
CREATE OR REPLACE FUNCTION public.get_user_profile_with_role(user_id UUID)
RETURNS TABLE(
    id UUID,
    user_id UUID,
    email TEXT,
    first_name TEXT,
    last_name TEXT,
    full_name TEXT,
    bio TEXT,
    location TEXT,
    avatar_url TEXT,
    phone TEXT,
    website TEXT,
    interests TEXT[],
    skills TEXT[],
    social_links JSONB,
    privacy_settings JSONB,
    role TEXT,
    is_profile_complete BOOLEAN,
    created_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE,
    rel8_complete BOOLEAN,
    modul8_setup_complete BOOLEAN,
    eco8_setup_complete BOOLEAN,
    nmn8_setup_complete BOOLEAN,
    labr8_setup_complete BOOLEAN,
    onboarding_complete BOOLEAN
)
LANGUAGE SQL
STABLE SECURITY DEFINER
SET search_path = public
AS $$
    SELECT 
        p.id,
        p.user_id,
        p.email,
        p.first_name,
        p.last_name,
        p.full_name,
        p.bio,
        p.location,
        p.avatar_url,
        p.phone,
        p.website,
        p.interests,
        p.skills,
        p.social_links,
        p.privacy_settings,
        public.get_highest_role(p.user_id) as role,
        p.is_profile_complete,
        p.created_at,
        p.updated_at,
        p.rel8_complete,
        p.modul8_setup_complete,
        p.eco8_setup_complete,
        p.nmn8_setup_complete,
        p.labr8_setup_complete,
        p.onboarding_complete
    FROM public.profiles p
    WHERE p.user_id = $1;
$$;

-- ================================================
-- 3. IMPROVE ROLE MANAGEMENT SYSTEM
-- ================================================

-- Enhanced update_user_role function with better security
CREATE OR REPLACE FUNCTION public.update_user_role(p_user_id UUID, p_role_name TEXT, p_assigner_id UUID DEFAULT NULL)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_role_id UUID;
    v_assigner_id UUID;
BEGIN
    -- Use current user as assigner if not provided
    v_assigner_id := COALESCE(p_assigner_id, auth.uid());
    
    -- Verify assigner has admin role
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

-- Function to update module completion status
CREATE OR REPLACE FUNCTION public.update_module_completion(
    user_id UUID,
    module_name TEXT,
    is_complete BOOLEAN DEFAULT true
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    -- Update the appropriate module completion field
    CASE module_name
        WHEN 'rel8' THEN
            UPDATE public.profiles SET rel8_complete = is_complete WHERE user_id = $1;
        WHEN 'modul8' THEN
            UPDATE public.profiles SET modul8_setup_complete = is_complete WHERE user_id = $1;
        WHEN 'eco8' THEN
            UPDATE public.profiles SET eco8_setup_complete = is_complete WHERE user_id = $1;
        WHEN 'nmn8' THEN
            UPDATE public.profiles SET nmn8_setup_complete = is_complete WHERE user_id = $1;
        WHEN 'labr8' THEN
            UPDATE public.profiles SET labr8_setup_complete = is_complete WHERE user_id = $1;
        WHEN 'onboarding' THEN
            UPDATE public.profiles SET onboarding_complete = is_complete WHERE user_id = $1;
        ELSE
            RAISE EXCEPTION 'Invalid module name: %', module_name;
    END CASE;
    
    RETURN true;
END;
$$;

-- ================================================
-- 4. IMPROVE PROFILE HANDLING TRIGGER
-- ================================================

-- Enhanced profile update trigger
CREATE OR REPLACE FUNCTION public.handle_profile_update()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    NEW.updated_at = NOW();
    
    -- Update profile completeness based on platform requirements
    NEW.is_profile_complete = (
        NEW.first_name IS NOT NULL AND 
        NEW.last_name IS NOT NULL AND 
        NEW.bio IS NOT NULL AND 
        length(trim(NEW.bio)) > 10 AND
        NEW.location IS NOT NULL
    );
    
    -- Update full_name
    NEW.full_name = trim(concat(NEW.first_name, ' ', NEW.last_name));
    
    -- Cache the user's highest role
    IF NEW.role IS NULL THEN
        NEW.role = public.get_highest_role(NEW.user_id);
    END IF;
    
    RETURN NEW;
END;
$$;

-- ================================================
-- 5. ENHANCED NEW USER HANDLER
-- ================================================

-- Improved new user handler to match platform expectations
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_member_role_id UUID;
    v_first_name TEXT;
    v_last_name TEXT;
    v_email TEXT;
BEGIN
    -- Get member role ID
    SELECT id INTO v_member_role_id FROM public.roles WHERE name = 'MEMBER';
    
    -- Extract metadata
    v_first_name := NEW.raw_user_meta_data->>'first_name';
    v_last_name := NEW.raw_user_meta_data->>'last_name';
    v_email := COALESCE(NEW.email, NEW.raw_user_meta_data->>'email');
    
    -- Create comprehensive profile
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
        'MEMBER',
        '{"contact_visibility": "members", "profile_visibility": "public"}'::jsonb
    );
    
    -- Assign default MEMBER role
    IF v_member_role_id IS NOT NULL THEN
        INSERT INTO public.user_roles (user_id, role_id, assigned_by)
        VALUES (NEW.id, v_member_role_id, NEW.id);
    END IF;
    
    RETURN NEW;
END;
$$;

-- ================================================
-- 6. SEED DEFAULT ROLES IF THEY DON'T EXIST
-- ================================================

-- Insert default roles
INSERT INTO public.roles (name, description) VALUES 
    ('ADMIN', 'System administrator with full access')
ON CONFLICT (name) DO NOTHING;

INSERT INTO public.roles (name, description) VALUES 
    ('ORGANIZER', 'Community organizer who can manage communities and events')
ON CONFLICT (name) DO NOTHING;

INSERT INTO public.roles (name, description) VALUES 
    ('SERVICE_PROVIDER', 'Service provider who can offer services through MODUL8')
ON CONFLICT (name) DO NOTHING;

INSERT INTO public.roles (name, description) VALUES 
    ('MEMBER', 'Regular community member')
ON CONFLICT (name) DO NOTHING;

-- ================================================
-- 7. UPDATE RLS POLICIES FOR ENHANCED PROFILES
-- ================================================

-- Enhanced profile RLS policies
DROP POLICY IF EXISTS "Users can view own profile enhanced" ON public.profiles;
CREATE POLICY "Users can view own profile enhanced" ON public.profiles
FOR ALL USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
CREATE POLICY "Admins can view all profiles" ON public.profiles
FOR SELECT USING (public.has_role(auth.uid(), 'ADMIN'));

-- ================================================
-- 8. CREATE INDEXES FOR PERFORMANCE
-- ================================================

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON public.profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON public.user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_role_id ON public.user_roles(role_id);
CREATE INDEX IF NOT EXISTS idx_communities_owner_id ON public.communities(owner_id);

-- ================================================
-- END PHASE 1: CORE USER & AUTHENTICATION SYSTEM
-- ================================================