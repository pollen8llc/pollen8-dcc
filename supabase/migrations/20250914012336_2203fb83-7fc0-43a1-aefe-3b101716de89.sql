-- Create lexicon table for centralized term management
CREATE TABLE public.lexicon (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    term TEXT NOT NULL,
    term_type TEXT NOT NULL, -- tag, interest, location, category, group_name, etc.
    source_module TEXT, -- eco8, modul8, rel8, nmn8, knowledge, etc.
    usage_count INTEGER DEFAULT 0,
    first_used_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    first_user_id UUID, -- Track who first used this term
    last_used_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    is_active BOOLEAN DEFAULT true,
    is_suggested BOOLEAN DEFAULT true,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    
    -- Create unique constraint on term + term_type combination
    UNIQUE(term, term_type)
);

-- Create lexicon_usage table for detailed usage tracking
CREATE TABLE public.lexicon_usage (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    lexicon_id UUID NOT NULL REFERENCES public.lexicon(id) ON DELETE CASCADE,
    source_table TEXT NOT NULL,
    source_record_id UUID NOT NULL,
    source_field TEXT NOT NULL,
    user_id UUID,
    used_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on both tables
ALTER TABLE public.lexicon ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lexicon_usage ENABLE ROW LEVEL SECURITY;

-- RLS Policies for lexicon table
CREATE POLICY "Anyone can view active lexicon terms" ON public.lexicon
FOR SELECT USING (is_active = true);

CREATE POLICY "Authenticated users can create lexicon terms" ON public.lexicon
FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can manage all lexicon terms" ON public.lexicon
FOR ALL USING (has_role(auth.uid(), 'ADMIN'));

-- RLS Policies for lexicon_usage table  
CREATE POLICY "Users can view lexicon usage" ON public.lexicon_usage
FOR SELECT USING (true);

CREATE POLICY "System can track lexicon usage" ON public.lexicon_usage
FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can manage lexicon usage" ON public.lexicon_usage
FOR ALL USING (has_role(auth.uid(), 'ADMIN'));

-- Function to update lexicon usage
CREATE OR REPLACE FUNCTION public.update_lexicon_usage(
    p_term TEXT,
    p_term_type TEXT,
    p_source_table TEXT,
    p_source_record_id UUID,
    p_source_field TEXT,
    p_user_id UUID DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_lexicon_id UUID;
    v_user_id UUID;
BEGIN
    v_user_id := COALESCE(p_user_id, auth.uid());
    
    -- Insert or get existing lexicon term
    INSERT INTO public.lexicon (term, term_type, usage_count, first_user_id, first_used_at, last_used_at)
    VALUES (p_term, p_term_type, 1, v_user_id, now(), now())
    ON CONFLICT (term, term_type) 
    DO UPDATE SET 
        usage_count = lexicon.usage_count + 1,
        last_used_at = now()
    RETURNING id INTO v_lexicon_id;
    
    -- Track the usage
    INSERT INTO public.lexicon_usage (
        lexicon_id, 
        source_table, 
        source_record_id, 
        source_field, 
        user_id
    ) VALUES (
        v_lexicon_id,
        p_source_table,
        p_source_record_id,
        p_source_field,
        v_user_id
    );
    
    RETURN v_lexicon_id;
END;
$$;

-- Function to get term suggestions
CREATE OR REPLACE FUNCTION public.get_term_suggestions(
    p_term_type TEXT,
    p_search_query TEXT DEFAULT '',
    p_limit INTEGER DEFAULT 10
)
RETURNS TABLE(
    id UUID,
    term TEXT,
    usage_count INTEGER,
    first_user_name TEXT
)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
    SELECT 
        l.id,
        l.term,
        l.usage_count,
        COALESCE(p.full_name, p.first_name || ' ' || p.last_name, 'Unknown') as first_user_name
    FROM public.lexicon l
    LEFT JOIN public.profiles p ON p.user_id = l.first_user_id
    WHERE 
        l.term_type = p_term_type 
        AND l.is_suggested = true 
        AND l.is_active = true
        AND (p_search_query = '' OR l.term ILIKE '%' || p_search_query || '%')
    ORDER BY l.usage_count DESC, l.term ASC
    LIMIT p_limit;
$$;

-- Function to get lexicon analytics
CREATE OR REPLACE FUNCTION public.get_lexicon_analytics(
    p_term_type TEXT DEFAULT NULL,
    p_days_back INTEGER DEFAULT 30
)
RETURNS TABLE(
    term TEXT,
    term_type TEXT,
    total_usage INTEGER,
    unique_users BIGINT,
    first_user_name TEXT,
    first_used_at TIMESTAMP WITH TIME ZONE,
    recent_usage BIGINT
)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
    SELECT 
        l.term,
        l.term_type,
        l.usage_count as total_usage,
        COUNT(DISTINCT lu.user_id) as unique_users,
        COALESCE(p.full_name, p.first_name || ' ' || p.last_name, 'Unknown') as first_user_name,
        l.first_used_at,
        COUNT(CASE WHEN lu.used_at >= now() - INTERVAL '1 day' * p_days_back THEN 1 END) as recent_usage
    FROM public.lexicon l
    LEFT JOIN public.lexicon_usage lu ON lu.lexicon_id = l.id
    LEFT JOIN public.profiles p ON p.user_id = l.first_user_id
    WHERE (p_term_type IS NULL OR l.term_type = p_term_type)
    GROUP BY l.id, l.term, l.term_type, l.usage_count, l.first_used_at, p.full_name, p.first_name, p.last_name
    ORDER BY l.usage_count DESC;
$$;

-- Function to sync existing data to lexicon
CREATE OR REPLACE FUNCTION public.sync_existing_data_to_lexicon()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    sync_count INTEGER := 0;
    tag_rec RECORD;
BEGIN
    -- Sync community tags
    FOR tag_rec IN 
        SELECT UNNEST(tags) as tag, owner_id, created_at, 'communities' as source_table, id as record_id
        FROM communities 
        WHERE tags IS NOT NULL AND array_length(tags, 1) > 0
    LOOP
        PERFORM public.update_lexicon_usage(
            tag_rec.tag, 
            'tag', 
            'communities', 
            tag_rec.record_id, 
            'tags', 
            tag_rec.owner_id
        );
        sync_count := sync_count + 1;
    END LOOP;

    -- Sync profile interests
    FOR tag_rec IN 
        SELECT UNNEST(interests) as interest, user_id, created_at, 'profiles' as source_table, id as record_id
        FROM profiles 
        WHERE interests IS NOT NULL AND array_length(interests, 1) > 0
    LOOP
        PERFORM public.update_lexicon_usage(
            tag_rec.interest, 
            'interest', 
            'profiles', 
            tag_rec.record_id, 
            'interests', 
            tag_rec.user_id
        );
        sync_count := sync_count + 1;
    END LOOP;

    -- Sync profile skills
    FOR tag_rec IN 
        SELECT UNNEST(skills) as skill, user_id, created_at, 'profiles' as source_table, id as record_id
        FROM profiles 
        WHERE skills IS NOT NULL AND array_length(skills, 1) > 0
    LOOP
        PERFORM public.update_lexicon_usage(
            tag_rec.skill, 
            'skill', 
            'profiles', 
            tag_rec.record_id, 
            'skills', 
            tag_rec.user_id
        );
        sync_count := sync_count + 1;
    END LOOP;

    -- Sync profile locations
    FOR tag_rec IN 
        SELECT location, user_id, created_at, 'profiles' as source_table, id as record_id
        FROM profiles 
        WHERE location IS NOT NULL AND location != ''
    LOOP
        PERFORM public.update_lexicon_usage(
            tag_rec.location, 
            'location', 
            'profiles', 
            tag_rec.record_id, 
            'location', 
            tag_rec.user_id
        );
        sync_count := sync_count + 1;
    END LOOP;

    -- Sync knowledge article tags
    FOR tag_rec IN 
        SELECT UNNEST(tags) as tag, author_id, created_at, 'knowledge_articles' as source_table, id as record_id
        FROM knowledge_articles 
        WHERE tags IS NOT NULL AND array_length(tags, 1) > 0
    LOOP
        PERFORM public.update_lexicon_usage(
            tag_rec.tag, 
            'tag', 
            'knowledge_articles', 
            tag_rec.record_id, 
            'tags', 
            tag_rec.author_id
        );
        sync_count := sync_count + 1;
    END LOOP;

    -- Sync community types
    FOR tag_rec IN 
        SELECT type, owner_id, created_at, 'communities' as source_table, id as record_id
        FROM communities 
        WHERE type IS NOT NULL AND type != ''
    LOOP
        PERFORM public.update_lexicon_usage(
            tag_rec.type, 
            'category', 
            'communities', 
            tag_rec.record_id, 
            'type', 
            tag_rec.owner_id
        );
        sync_count := sync_count + 1;
    END LOOP;

    RETURN sync_count;
END;
$$;

-- Add updated_at trigger
CREATE TRIGGER update_lexicon_updated_at
    BEFORE UPDATE ON public.lexicon
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Seed initial data
SELECT public.sync_existing_data_to_lexicon();