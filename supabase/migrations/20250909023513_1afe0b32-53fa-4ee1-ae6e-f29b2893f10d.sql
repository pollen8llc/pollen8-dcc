-- Rebuild Authentication System - Fixed order to avoid circular references

-- Create roles table first
CREATE TABLE public.roles (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name text NOT NULL UNIQUE,
    description text,
    permissions jsonb DEFAULT '{}',
    created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on roles (simple policies first)
ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view roles" ON public.roles FOR SELECT USING (true);

-- Create user_roles table
CREATE TABLE public.user_roles (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role_id uuid NOT NULL REFERENCES public.roles(id) ON DELETE CASCADE,
    assigned_at timestamp with time zone NOT NULL DEFAULT now(),
    assigned_by uuid REFERENCES auth.users(id),
    UNIQUE(user_id, role_id)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own roles" ON public.user_roles FOR SELECT USING (user_id = auth.uid());

-- Insert seed roles
INSERT INTO public.roles (name, description, permissions) VALUES
('ADMIN', 'System administrator with full access', '{"all": true}'),
('ORGANIZER', 'Community organizer with management privileges', '{"manage_community": true, "invite_users": true}'),
('SERVICE_PROVIDER', 'Service provider for LABR8 platform', '{"provide_services": true, "access_labr8": true}'),
('MEMBER', 'Regular community member', '{"basic_access": true}');

-- Create role management functions
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

-- Create profiles table
CREATE TABLE public.profiles (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
    email text NOT NULL,
    first_name text,
    last_name text,
    full_name text,
    avatar_url text,
    bio text,
    location text,
    website text,
    social_links jsonb DEFAULT '{}',
    interests text[],
    skills text[],
    privacy_settings jsonb DEFAULT '{"profile_visibility": "public", "contact_visibility": "members"}',
    is_profile_complete boolean DEFAULT false,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles table
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles FOR SELECT USING (
    privacy_settings->>'profile_visibility' = 'public'
);

CREATE POLICY "Member profiles are viewable by authenticated users" ON public.profiles FOR SELECT USING (
    auth.role() = 'authenticated' AND (
        privacy_settings->>'profile_visibility' = 'public' OR
        privacy_settings->>'profile_visibility' = 'members'
    )
);

CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (user_id = auth.uid());

-- Create profile management functions and triggers
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

CREATE TRIGGER handle_profile_update_trigger
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_profile_update();

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

CREATE TRIGGER handle_new_user_trigger
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- Create basic communities table
CREATE TABLE public.communities (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name text NOT NULL,
    description text,
    owner_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on communities
ALTER TABLE public.communities ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Communities are viewable by everyone" ON public.communities FOR SELECT USING (true);
CREATE POLICY "Users can create communities" ON public.communities FOR INSERT WITH CHECK (owner_id = auth.uid());
CREATE POLICY "Owners can update their communities" ON public.communities FOR UPDATE USING (owner_id = auth.uid());
CREATE POLICY "Owners can delete their communities" ON public.communities FOR DELETE USING (owner_id = auth.uid());

-- Create function to get managed communities
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

-- Now add complex policies that reference other tables
CREATE POLICY "Only admins can modify roles" ON public.roles FOR ALL USING (
    public.has_role(auth.uid(), 'ADMIN')
);

CREATE POLICY "Admins can view all roles" ON public.user_roles FOR SELECT USING (
    public.has_role(auth.uid(), 'ADMIN')
);

CREATE POLICY "Admins can manage roles" ON public.user_roles FOR ALL USING (
    public.has_role(auth.uid(), 'ADMIN')
);