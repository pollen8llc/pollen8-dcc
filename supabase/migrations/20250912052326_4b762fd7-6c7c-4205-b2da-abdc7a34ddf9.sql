-- Fix infinite recursion in community_members RLS policy
-- Create a security definer function to check user community membership
CREATE OR REPLACE FUNCTION public.get_user_community_ids(user_uuid uuid)
RETURNS uuid[]
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
    SELECT ARRAY(
        SELECT community_id 
        FROM public.community_members 
        WHERE user_id = user_uuid AND status = 'active'
    );
$$;

-- Drop the problematic policy and recreate it using the security definer function
DROP POLICY IF EXISTS "Members can view community membership" ON public.community_members;

-- Create a new safe policy that doesn't cause recursion
CREATE POLICY "Members can view community membership" 
ON public.community_members 
FOR SELECT 
USING (
    community_id = ANY(public.get_user_community_ids(auth.uid())) OR 
    (EXISTS ( 
        SELECT 1 FROM public.communities c 
        WHERE c.id = community_members.community_id AND c.owner_id = auth.uid()
    )) OR 
    public.has_role(auth.uid(), 'ADMIN')
);

-- Also fix the create_community function to handle missing parameters properly
CREATE OR REPLACE FUNCTION public.create_community(
    p_name text, 
    p_description text, 
    p_type text DEFAULT 'tech'::text, 
    p_location text DEFAULT 'Remote'::text, 
    p_format text DEFAULT 'hybrid'::text, 
    p_website text DEFAULT NULL::text, 
    p_is_public boolean DEFAULT true, 
    p_tags text[] DEFAULT ARRAY[]::text[], 
    p_target_audience text[] DEFAULT ARRAY[]::text[],
    p_social_media jsonb DEFAULT '{}'::jsonb,
    p_communication_platforms jsonb DEFAULT '{}'::jsonb
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    community_id UUID;
    user_id UUID;
BEGIN
    -- Get the current user
    user_id := auth.uid();
    
    IF user_id IS NULL THEN
        RAISE EXCEPTION 'Authentication required';
    END IF;
    
    -- Insert the community
    INSERT INTO public.communities (
        name,
        description,
        type,
        location,
        format,
        website,
        is_public,
        tags,
        target_audience,
        social_media,
        communication_platforms,
        owner_id
    ) VALUES (
        p_name,
        p_description,
        COALESCE(p_type, 'tech'),
        COALESCE(p_location, 'Remote'),
        COALESCE(p_format, 'hybrid'),
        p_website,
        COALESCE(p_is_public, true),
        COALESCE(p_tags, ARRAY[]::text[]),
        COALESCE(p_target_audience, ARRAY[]::text[]),
        COALESCE(p_social_media, '{}'::jsonb),
        COALESCE(p_communication_platforms, '{}'::jsonb),
        user_id
    ) RETURNING id INTO community_id;
    
    RETURN community_id;
END;
$$;