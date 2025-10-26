-- Update create_community function to accept jsonb for target_audience
CREATE OR REPLACE FUNCTION public.create_community(
    p_name text, 
    p_description text, 
    p_type text DEFAULT 'tech'::text, 
    p_location text DEFAULT 'Remote'::text, 
    p_format text DEFAULT 'hybrid'::text, 
    p_website text DEFAULT NULL::text, 
    p_is_public boolean DEFAULT true, 
    p_tags text[] DEFAULT ARRAY[]::text[], 
    p_target_audience jsonb DEFAULT '[]'::jsonb,
    p_social_media jsonb DEFAULT '{}'::jsonb,
    p_communication_platforms jsonb DEFAULT '{}'::jsonb
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    user_id uuid;
    community_id uuid;
BEGIN
    -- Get the current user ID
    user_id := auth.uid();
    
    -- Check if user is authenticated
    IF user_id IS NULL THEN
        RAISE EXCEPTION 'User must be authenticated to create a community';
    END IF;
    
    -- Insert the new community
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
        COALESCE(p_target_audience, '[]'::jsonb),
        COALESCE(p_social_media, '{}'::jsonb),
        COALESCE(p_communication_platforms, '{}'::jsonb),
        user_id
    ) RETURNING id INTO community_id;
    
    RETURN community_id;
END;
$$;