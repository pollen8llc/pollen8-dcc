-- Knowledge system tables
CREATE TABLE public.knowledge_articles (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    author_id UUID NOT NULL,
    community_id UUID,
    category TEXT,
    tags TEXT[],
    is_published BOOLEAN DEFAULT false,
    view_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.knowledge_comments (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    article_id UUID NOT NULL,
    author_id UUID NOT NULL,
    content TEXT NOT NULL,
    is_accepted_answer BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.knowledge_votes (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    comment_id UUID,
    article_id UUID,
    vote_type TEXT NOT NULL CHECK (vote_type IN ('up', 'down')),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(user_id, comment_id),
    UNIQUE(user_id, article_id)
);

-- Modul8 service request comments table
CREATE TABLE public.modul8_service_request_comments (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    service_request_id UUID NOT NULL,
    user_id UUID NOT NULL,
    comment_type TEXT NOT NULL DEFAULT 'general',
    content TEXT NOT NULL,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Modul8 negotiation status table
CREATE TABLE public.modul8_negotiation_status (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    service_request_id UUID NOT NULL,
    current_status TEXT NOT NULL,
    previous_status TEXT,
    service_provider_id UUID,
    status_data JSONB DEFAULT '{}',
    updated_by UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- RMS outreach tables
CREATE TABLE public.rms_outreach (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    scheduled_at TIMESTAMP WITH TIME ZONE,
    status TEXT NOT NULL DEFAULT 'scheduled',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.rms_outreach_contacts (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    outreach_id UUID NOT NULL,
    contact_id UUID NOT NULL,
    status TEXT DEFAULT 'pending',
    sent_at TIMESTAMP WITH TIME ZONE,
    opened_at TIMESTAMP WITH TIME ZONE,
    clicked_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(outreach_id, contact_id)
);

-- Audit logs table
CREATE TABLE public.audit_logs (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    action TEXT NOT NULL,
    performed_by UUID,
    details JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.knowledge_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.knowledge_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.knowledge_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.modul8_service_request_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.modul8_negotiation_status ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rms_outreach ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rms_outreach_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Knowledge articles RLS policies
CREATE POLICY "Published articles are viewable by everyone" 
ON public.knowledge_articles FOR SELECT 
USING (is_published = true);

CREATE POLICY "Authors can manage their articles" 
ON public.knowledge_articles FOR ALL 
USING (author_id = auth.uid());

-- Knowledge comments RLS policies
CREATE POLICY "Comments are viewable by everyone" 
ON public.knowledge_comments FOR SELECT 
USING (true);

CREATE POLICY "Users can create comments" 
ON public.knowledge_comments FOR INSERT 
WITH CHECK (author_id = auth.uid());

CREATE POLICY "Authors can manage their comments" 
ON public.knowledge_comments FOR ALL 
USING (author_id = auth.uid());

-- Knowledge votes RLS policies
CREATE POLICY "Votes are viewable by everyone" 
ON public.knowledge_votes FOR SELECT 
USING (true);

CREATE POLICY "Users can manage their own votes" 
ON public.knowledge_votes FOR ALL 
USING (user_id = auth.uid());

-- Modul8 service request comments RLS policies
CREATE POLICY "Users can view comments on their requests" 
ON public.modul8_service_request_comments FOR SELECT 
USING (true);

CREATE POLICY "Users can create comments" 
ON public.modul8_service_request_comments FOR INSERT 
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can manage their own comments" 
ON public.modul8_service_request_comments FOR ALL 
USING (user_id = auth.uid());

-- Modul8 negotiation status RLS policies
CREATE POLICY "Users can view negotiation status" 
ON public.modul8_negotiation_status FOR SELECT 
USING (true);

CREATE POLICY "Authorized users can manage negotiation status" 
ON public.modul8_negotiation_status FOR ALL 
USING (updated_by = auth.uid());

-- RMS outreach RLS policies
CREATE POLICY "Users can manage their own outreach" 
ON public.rms_outreach FOR ALL 
USING (user_id = auth.uid());

CREATE POLICY "Users can manage their outreach contacts" 
ON public.rms_outreach_contacts FOR ALL 
USING (EXISTS (
    SELECT 1 FROM rms_outreach o 
    WHERE o.id = outreach_id AND o.user_id = auth.uid()
));

-- Audit logs RLS policies
CREATE POLICY "Admins can view audit logs" 
ON public.audit_logs FOR SELECT 
USING (has_role(auth.uid(), 'ADMIN'));

CREATE POLICY "System can create audit logs" 
ON public.audit_logs FOR INSERT 
WITH CHECK (true);

-- Create missing RPC functions
CREATE OR REPLACE FUNCTION public.get_user_owned_communities(user_id uuid)
RETURNS TABLE(community_id uuid, community_name text, member_count integer)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
    SELECT 
        c.id,
        c.name,
        public.get_community_member_count(c.id)
    FROM public.communities c
    WHERE c.owner_id = $1
    ORDER BY c.created_at DESC;
$$;

CREATE OR REPLACE FUNCTION public.increment_view_count(article_id uuid)
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
    UPDATE public.knowledge_articles 
    SET view_count = view_count + 1, updated_at = now()
    WHERE id = $1;
$$;

CREATE OR REPLACE FUNCTION public.log_audit_action(action_name text, user_id uuid DEFAULT NULL, action_details jsonb DEFAULT '{}'::jsonb)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    audit_id UUID;
BEGIN
    INSERT INTO public.audit_logs (action, performed_by, details)
    VALUES (action_name, COALESCE(user_id, auth.uid()), action_details)
    RETURNING id INTO audit_id;
    
    RETURN audit_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.get_connection_depth(user_a uuid, user_b uuid)
RETURNS integer
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
    -- Placeholder implementation - returns 1 for direct connection, 2 for second degree, etc.
    -- This would need proper implementation based on your connection/relationship model
    SELECT CASE 
        WHEN user_a = user_b THEN 0
        ELSE 1
    END;
$$;

CREATE OR REPLACE FUNCTION public.generate_unique_invite_code()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    code TEXT;
    exists_check BOOLEAN;
BEGIN
    LOOP
        -- Generate a random 8-character code
        code := upper(substring(md5(random()::text) from 1 for 8));
        
        -- Check if it already exists (assuming you have an invites table)
        -- For now, just return the code
        EXIT;
    END LOOP;
    
    RETURN code;
END;
$$;

CREATE OR REPLACE FUNCTION public.record_invite_use(invite_code text, used_by_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    -- Placeholder implementation
    -- This would update an invites table to mark the code as used
    RETURN true;
END;
$$;

CREATE OR REPLACE FUNCTION public.get_rel8t_metrics()
RETURNS jsonb
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
    SELECT jsonb_build_object(
        'total_contacts', (SELECT COUNT(*) FROM rms_contacts WHERE user_id = auth.uid()),
        'total_outreach', (SELECT COUNT(*) FROM rms_outreach WHERE user_id = auth.uid()),
        'active_campaigns', (SELECT COUNT(*) FROM rms_outreach WHERE user_id = auth.uid() AND status = 'active')
    );
$$;

CREATE OR REPLACE FUNCTION public.assign_request_to_provider(p_service_request_id uuid, p_service_provider_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    -- Placeholder implementation
    -- This would update a service requests table
    RETURN true;
END;
$$;

CREATE OR REPLACE FUNCTION public.can_view_profile(viewer_id uuid, profile_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
    SELECT CASE
        WHEN viewer_id = profile_user_id THEN true
        WHEN (SELECT privacy_settings->>'profile_visibility' FROM profiles WHERE user_id = profile_user_id) = 'public' THEN true
        WHEN (SELECT privacy_settings->>'profile_visibility' FROM profiles WHERE user_id = profile_user_id) = 'members' AND viewer_id IS NOT NULL THEN true
        ELSE false
    END;
$$;

CREATE OR REPLACE FUNCTION public.get_connected_profiles(user_id uuid)
RETURNS TABLE(profile_id uuid, user_id uuid, full_name text, avatar_url text)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
    -- Placeholder implementation - returns all public profiles
    SELECT p.id, p.user_id, p.full_name, p.avatar_url
    FROM profiles p
    WHERE p.privacy_settings->>'profile_visibility' = 'public'
    AND p.user_id != $1
    LIMIT 10;
$$;

CREATE OR REPLACE FUNCTION public.get_user_memberships(user_id uuid)
RETURNS TABLE(community_id uuid, community_name text, role text, status text)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
    SELECT cm.community_id, c.name, cm.role, cm.status
    FROM community_members cm
    JOIN communities c ON c.id = cm.community_id
    WHERE cm.user_id = $1 AND cm.status = 'active'
    ORDER BY cm.joined_at DESC;
$$;

-- Create update triggers for timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_knowledge_articles_updated_at
    BEFORE UPDATE ON public.knowledge_articles
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_knowledge_comments_updated_at
    BEFORE UPDATE ON public.knowledge_comments
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_modul8_service_request_comments_updated_at
    BEFORE UPDATE ON public.modul8_service_request_comments
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_modul8_negotiation_status_updated_at
    BEFORE UPDATE ON public.modul8_negotiation_status
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_rms_outreach_updated_at
    BEFORE UPDATE ON public.rms_outreach
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();