-- Create poll_responses table for voting system
CREATE TABLE IF NOT EXISTS public.poll_responses (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    poll_id UUID NOT NULL,
    user_id UUID NOT NULL,
    option_index INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(poll_id, user_id, option_index)
);

-- Enable RLS on poll_responses
ALTER TABLE public.poll_responses ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for poll_responses
CREATE POLICY "Users can view all poll responses" ON public.poll_responses
FOR SELECT USING (true);

CREATE POLICY "Users can insert their own poll responses" ON public.poll_responses
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own poll responses" ON public.poll_responses
FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own poll responses" ON public.poll_responses
FOR DELETE USING (auth.uid() = user_id);

-- Create get_poll_counts RPC function
CREATE OR REPLACE FUNCTION public.get_poll_counts(poll_id UUID)
RETURNS TABLE(option_index INTEGER, count BIGINT)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
    SELECT 
        pr.option_index,
        COUNT(*) as count
    FROM public.poll_responses pr
    WHERE pr.poll_id = $1
    GROUP BY pr.option_index
    ORDER BY pr.option_index;
$$;

-- Create create_community RPC function
CREATE OR REPLACE FUNCTION public.create_community(
    p_name TEXT,
    p_description TEXT,
    p_type TEXT DEFAULT NULL,
    p_location TEXT DEFAULT NULL,
    p_format TEXT DEFAULT NULL,
    p_website TEXT DEFAULT NULL,
    p_is_public BOOLEAN DEFAULT true,
    p_tags TEXT[] DEFAULT NULL,
    p_target_audience TEXT[] DEFAULT NULL
)
RETURNS UUID
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
        owner_id
    ) VALUES (
        p_name,
        p_description,
        p_type,
        p_location,
        p_format,
        p_website,
        p_is_public,
        p_tags,
        p_target_audience,
        user_id
    ) RETURNING id INTO community_id;
    
    RETURN community_id;
END;
$$;