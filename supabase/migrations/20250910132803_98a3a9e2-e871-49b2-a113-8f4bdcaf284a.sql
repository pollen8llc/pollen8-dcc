-- Update Community System Schema - Fixed order

-- First, update the existing communities table with all required columns
ALTER TABLE public.communities 
ADD COLUMN IF NOT EXISTS logo_url text,
ADD COLUMN IF NOT EXISTS website text,
ADD COLUMN IF NOT EXISTS is_public boolean DEFAULT true,
ADD COLUMN IF NOT EXISTS location text,
ADD COLUMN IF NOT EXISTS member_count text DEFAULT '1',
ADD COLUMN IF NOT EXISTS target_audience text[],
ADD COLUMN IF NOT EXISTS type text,
ADD COLUMN IF NOT EXISTS format text,
ADD COLUMN IF NOT EXISTS social_media jsonb DEFAULT '{}',
ADD COLUMN IF NOT EXISTS communication_platforms jsonb DEFAULT '{}',
ADD COLUMN IF NOT EXISTS newsletter_url text,
ADD COLUMN IF NOT EXISTS vision text,
ADD COLUMN IF NOT EXISTS tags text[];

-- Create community_members table first (needed by other policies)
CREATE TABLE IF NOT EXISTS public.community_members (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    community_id uuid NOT NULL REFERENCES public.communities(id) ON DELETE CASCADE,
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role text NOT NULL DEFAULT 'member' CHECK (role IN ('member', 'moderator', 'admin')),
    joined_at timestamp with time zone NOT NULL DEFAULT now(),
    status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'banned')),
    invited_by uuid REFERENCES auth.users(id),
    UNIQUE(community_id, user_id)
);

-- Create community_data_distribution table
CREATE TABLE IF NOT EXISTS public.community_data_distribution (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    submission_data jsonb NOT NULL,
    submitter_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
    community_id uuid REFERENCES public.communities(id) ON DELETE SET NULL,
    processed_at timestamp with time zone,
    error_message text,
    created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create community_data table
CREATE TABLE IF NOT EXISTS public.community_data (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    community_id uuid NOT NULL REFERENCES public.communities(id) ON DELETE CASCADE,
    data_type text NOT NULL,
    data jsonb NOT NULL DEFAULT '{}',
    metadata jsonb DEFAULT '{}',
    imported_at timestamp with time zone NOT NULL DEFAULT now(),
    imported_by uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Create knowledge_base table
CREATE TABLE IF NOT EXISTS public.knowledge_base (
    id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    community_id uuid NOT NULL REFERENCES public.communities(id) ON DELETE CASCADE,
    title text NOT NULL,
    content text NOT NULL,
    author_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    category text,
    tags text[],
    is_published boolean DEFAULT false,
    view_count integer DEFAULT 0,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.community_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_data_distribution ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.knowledge_base ENABLE ROW LEVEL SECURITY;

-- Now create policies for community_members
CREATE POLICY "Members can view community membership" ON public.community_members 
    FOR SELECT USING (
        community_id IN (
            SELECT cm.community_id FROM public.community_members cm 
            WHERE cm.user_id = auth.uid() AND cm.status = 'active'
        ) OR
        EXISTS (
            SELECT 1 FROM public.communities c 
            WHERE c.id = community_members.community_id 
            AND c.owner_id = auth.uid()
        ) OR
        public.has_role(auth.uid(), 'ADMIN')
    );

CREATE POLICY "Users can view their own membership" ON public.community_members 
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Community owners can manage membership" ON public.community_members 
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.communities c 
            WHERE c.id = community_members.community_id 
            AND c.owner_id = auth.uid()
        ) OR
        public.has_role(auth.uid(), 'ADMIN')
    );

-- Policies for community_data_distribution
CREATE POLICY "Users can view their own submissions" ON public.community_data_distribution 
    FOR SELECT USING (submitter_id = auth.uid());

CREATE POLICY "Users can create submissions" ON public.community_data_distribution 
    FOR INSERT WITH CHECK (submitter_id = auth.uid());

CREATE POLICY "Admins can view all submissions" ON public.community_data_distribution 
    FOR SELECT USING (public.has_role(auth.uid(), 'ADMIN'));

CREATE POLICY "Admins can update submissions" ON public.community_data_distribution 
    FOR UPDATE USING (public.has_role(auth.uid(), 'ADMIN'));

-- Policies for community_data  
CREATE POLICY "Community data is viewable by members" ON public.community_data 
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.community_members cm 
            WHERE cm.community_id = community_data.community_id 
            AND cm.user_id = auth.uid()
        ) OR 
        EXISTS (
            SELECT 1 FROM public.communities c 
            WHERE c.id = community_data.community_id 
            AND c.owner_id = auth.uid()
        ) OR
        public.has_role(auth.uid(), 'ADMIN')
    );

CREATE POLICY "Community owners can manage data" ON public.community_data 
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.communities c 
            WHERE c.id = community_data.community_id 
            AND c.owner_id = auth.uid()
        ) OR
        public.has_role(auth.uid(), 'ADMIN')
    );

-- Policies for knowledge_base
CREATE POLICY "Published knowledge base is viewable by community members" ON public.knowledge_base 
    FOR SELECT USING (
        is_published = true AND (
            EXISTS (
                SELECT 1 FROM public.community_members cm 
                WHERE cm.community_id = knowledge_base.community_id 
                AND cm.user_id = auth.uid() 
                AND cm.status = 'active'
            ) OR 
            EXISTS (
                SELECT 1 FROM public.communities c 
                WHERE c.id = knowledge_base.community_id 
                AND c.owner_id = auth.uid()
            ) OR
            public.has_role(auth.uid(), 'ADMIN')
        )
    );

CREATE POLICY "Authors can manage their knowledge base entries" ON public.knowledge_base 
    FOR ALL USING (author_id = auth.uid());

CREATE POLICY "Community owners can manage knowledge base" ON public.knowledge_base 
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.communities c 
            WHERE c.id = knowledge_base.community_id 
            AND c.owner_id = auth.uid()
        ) OR
        public.has_role(auth.uid(), 'ADMIN')
    );

-- Create trigger for knowledge_base updated_at
CREATE TRIGGER handle_knowledge_base_updated_at
    BEFORE UPDATE ON public.knowledge_base
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_profile_update();

-- Update communities table policies
DROP POLICY IF EXISTS "Communities are viewable by everyone" ON public.communities;
DROP POLICY IF EXISTS "Users can create communities" ON public.communities;
DROP POLICY IF EXISTS "Owners can update their communities" ON public.communities;
DROP POLICY IF EXISTS "Owners can delete their communities" ON public.communities;

CREATE POLICY "Public communities are viewable by everyone" ON public.communities 
    FOR SELECT USING (is_public = true);

CREATE POLICY "Private communities are viewable by members" ON public.communities 
    FOR SELECT USING (
        is_public = false AND (
            EXISTS (
                SELECT 1 FROM public.community_members cm 
                WHERE cm.community_id = communities.id 
                AND cm.user_id = auth.uid() 
                AND cm.status = 'active'
            ) OR 
            owner_id = auth.uid() OR
            public.has_role(auth.uid(), 'ADMIN')
        )
    );

CREATE POLICY "Authenticated users can create communities" ON public.communities 
    FOR INSERT WITH CHECK (owner_id = auth.uid());

CREATE POLICY "Owners can update their communities" ON public.communities 
    FOR UPDATE USING (owner_id = auth.uid() OR public.has_role(auth.uid(), 'ADMIN'));

CREATE POLICY "Owners can delete their communities" ON public.communities 
    FOR DELETE USING (owner_id = auth.uid() OR public.has_role(auth.uid(), 'ADMIN'));

-- Create helper functions
CREATE OR REPLACE FUNCTION public.add_creator_as_member()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    -- Add the community creator as an admin member
    INSERT INTO public.community_members (community_id, user_id, role, status)
    VALUES (NEW.id, NEW.owner_id, 'admin', 'active');
    
    RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.get_community_member_count(community_id uuid)
RETURNS integer
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT COUNT(*)::integer
    FROM public.community_members cm
    WHERE cm.community_id = $1 AND cm.status = 'active'
$$;

-- Create triggers
DROP TRIGGER IF EXISTS add_creator_as_member_trigger ON public.communities;
CREATE TRIGGER add_creator_as_member_trigger
    AFTER INSERT ON public.communities
    FOR EACH ROW
    EXECUTE FUNCTION public.add_creator_as_member();

-- Update the get_managed_communities function
CREATE OR REPLACE FUNCTION public.get_managed_communities(user_id uuid)
RETURNS TABLE(community_id uuid, community_name text, member_count integer)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT 
        c.id, 
        c.name, 
        public.get_community_member_count(c.id) as member_count
    FROM public.communities c
    WHERE c.owner_id = $1
    ORDER BY c.created_at DESC
$$;