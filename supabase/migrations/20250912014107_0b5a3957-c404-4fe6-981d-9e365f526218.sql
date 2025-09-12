-- Create missing modul8 tables
CREATE TABLE public.modul8_deals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  service_request_id UUID NOT NULL,
  organizer_id UUID NOT NULL,
  service_provider_id UUID NOT NULL,
  deal_amount DECIMAL(10,2),
  deal_status TEXT NOT NULL DEFAULT 'pending',
  signed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.modul8_project_completions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  service_request_id UUID NOT NULL,
  service_provider_id UUID NOT NULL,
  organizer_id UUID NOT NULL,
  deliverables JSONB DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'pending',
  completed_at TIMESTAMP WITH TIME ZONE,
  confirmed_at TIMESTAMP WITH TIME ZONE,
  confirmed_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.modul8_project_ratings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  service_request_id UUID NOT NULL,
  completion_id UUID NOT NULL,
  organizer_id UUID NOT NULL,
  service_provider_id UUID NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  feedback TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.modul8_project_revisions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  service_request_id UUID NOT NULL,
  requested_by UUID NOT NULL,
  revision_details TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.modul8_project_milestones (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  service_request_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  due_date TIMESTAMP WITH TIME ZONE,
  status TEXT NOT NULL DEFAULT 'pending',
  order_index INTEGER NOT NULL DEFAULT 0,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create eco8 tables
CREATE TABLE public.eco8_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  community_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  event_date TIMESTAMP WITH TIME ZONE NOT NULL,
  location TEXT,
  max_attendees INTEGER,
  registration_required BOOLEAN DEFAULT false,
  created_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.eco8_event_registrations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID NOT NULL,
  user_id UUID NOT NULL,
  registration_status TEXT NOT NULL DEFAULT 'registered',
  registered_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(event_id, user_id)
);

CREATE TABLE public.eco8_community_posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  community_id UUID NOT NULL,
  author_id UUID NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  post_type TEXT DEFAULT 'general',
  is_pinned BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.eco8_post_reactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID NOT NULL,
  user_id UUID NOT NULL,
  reaction_type TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(post_id, user_id)
);

-- Enable RLS
ALTER TABLE public.modul8_deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.modul8_project_completions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.modul8_project_ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.modul8_project_revisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.modul8_project_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.eco8_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.eco8_event_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.eco8_community_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.eco8_post_reactions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for modul8 tables
CREATE POLICY "Users can view relevant deals" ON public.modul8_deals FOR SELECT USING (
  (EXISTS (SELECT 1 FROM modul8_organizers o WHERE o.id = modul8_deals.organizer_id AND o.user_id = auth.uid()))
  OR (EXISTS (SELECT 1 FROM modul8_service_providers p WHERE p.id = modul8_deals.service_provider_id AND p.user_id = auth.uid()))
  OR has_role(auth.uid(), 'ADMIN')
);

CREATE POLICY "Authorized users can manage project completions" ON public.modul8_project_completions FOR ALL USING (
  (EXISTS (SELECT 1 FROM modul8_organizers o WHERE o.id = modul8_project_completions.organizer_id AND o.user_id = auth.uid()))
  OR (EXISTS (SELECT 1 FROM modul8_service_providers p WHERE p.id = modul8_project_completions.service_provider_id AND p.user_id = auth.uid()))
  OR has_role(auth.uid(), 'ADMIN')
);

CREATE POLICY "Authorized users can manage project ratings" ON public.modul8_project_ratings FOR ALL USING (
  (EXISTS (SELECT 1 FROM modul8_organizers o WHERE o.id = modul8_project_ratings.organizer_id AND o.user_id = auth.uid()))
  OR (EXISTS (SELECT 1 FROM modul8_service_providers p WHERE p.id = modul8_project_ratings.service_provider_id AND p.user_id = auth.uid()))
  OR has_role(auth.uid(), 'ADMIN')
);

CREATE POLICY "Authorized users can manage project revisions" ON public.modul8_project_revisions FOR ALL USING (
  requested_by = auth.uid() OR has_role(auth.uid(), 'ADMIN')
);

CREATE POLICY "Authorized users can manage project milestones" ON public.modul8_project_milestones FOR ALL USING (
  auth.uid() IS NOT NULL
);

-- RLS Policies for eco8 tables
CREATE POLICY "Community members can view events" ON public.eco8_events FOR SELECT USING (
  (EXISTS (SELECT 1 FROM community_members cm WHERE cm.community_id = eco8_events.community_id AND cm.user_id = auth.uid() AND cm.status = 'active'))
  OR (EXISTS (SELECT 1 FROM communities c WHERE c.id = eco8_events.community_id AND c.owner_id = auth.uid()))
  OR has_role(auth.uid(), 'ADMIN')
);

CREATE POLICY "Community owners can manage events" ON public.eco8_events FOR ALL USING (
  (EXISTS (SELECT 1 FROM communities c WHERE c.id = eco8_events.community_id AND c.owner_id = auth.uid()))
  OR has_role(auth.uid(), 'ADMIN')
);

CREATE POLICY "Users can manage their event registrations" ON public.eco8_event_registrations FOR ALL USING (
  user_id = auth.uid()
);

CREATE POLICY "Community members can view posts" ON public.eco8_community_posts FOR SELECT USING (
  (EXISTS (SELECT 1 FROM community_members cm WHERE cm.community_id = eco8_community_posts.community_id AND cm.user_id = auth.uid() AND cm.status = 'active'))
  OR (EXISTS (SELECT 1 FROM communities c WHERE c.id = eco8_community_posts.community_id AND c.owner_id = auth.uid()))
  OR has_role(auth.uid(), 'ADMIN')
);

CREATE POLICY "Community members can create posts" ON public.eco8_community_posts FOR INSERT WITH CHECK (
  (EXISTS (SELECT 1 FROM community_members cm WHERE cm.community_id = eco8_community_posts.community_id AND cm.user_id = auth.uid() AND cm.status = 'active'))
  AND author_id = auth.uid()
);

CREATE POLICY "Authors can manage their posts" ON public.eco8_community_posts FOR ALL USING (
  author_id = auth.uid() OR has_role(auth.uid(), 'ADMIN')
);

CREATE POLICY "Users can manage their reactions" ON public.eco8_post_reactions FOR ALL USING (
  user_id = auth.uid()
);

-- Add triggers for updated_at
CREATE TRIGGER update_modul8_deals_updated_at
BEFORE UPDATE ON public.modul8_deals
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_modul8_project_completions_updated_at
BEFORE UPDATE ON public.modul8_project_completions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_modul8_project_ratings_updated_at
BEFORE UPDATE ON public.modul8_project_ratings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_modul8_project_revisions_updated_at
BEFORE UPDATE ON public.modul8_project_revisions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_modul8_project_milestones_updated_at
BEFORE UPDATE ON public.modul8_project_milestones
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_eco8_events_updated_at
BEFORE UPDATE ON public.eco8_events
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_eco8_community_posts_updated_at
BEFORE UPDATE ON public.eco8_community_posts
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create eco8 RPC functions
CREATE OR REPLACE FUNCTION public.get_community_events(community_id uuid)
RETURNS TABLE(
  id uuid,
  title text,
  description text,
  event_date timestamp with time zone,
  location text,
  max_attendees integer,
  registration_required boolean,
  attendee_count bigint
)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    e.id,
    e.title,
    e.description,
    e.event_date,
    e.location,
    e.max_attendees,
    e.registration_required,
    COALESCE(r.attendee_count, 0) as attendee_count
  FROM eco8_events e
  LEFT JOIN (
    SELECT event_id, COUNT(*) as attendee_count
    FROM eco8_event_registrations 
    WHERE registration_status = 'registered'
    GROUP BY event_id
  ) r ON e.id = r.event_id
  WHERE e.community_id = $1
  ORDER BY e.event_date ASC;
$$;

CREATE OR REPLACE FUNCTION public.register_for_event(event_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_id uuid;
  max_attendees integer;
  current_attendees integer;
BEGIN
  user_id := auth.uid();
  
  IF user_id IS NULL THEN
    RAISE EXCEPTION 'Authentication required';
  END IF;
  
  -- Get max attendees for event
  SELECT e.max_attendees INTO max_attendees
  FROM eco8_events e
  WHERE e.id = $1;
  
  -- Count current registrations
  SELECT COUNT(*) INTO current_attendees
  FROM eco8_event_registrations
  WHERE event_id = $1 AND registration_status = 'registered';
  
  -- Check if event is full
  IF max_attendees IS NOT NULL AND current_attendees >= max_attendees THEN
    RETURN false;
  END IF;
  
  -- Register user
  INSERT INTO eco8_event_registrations (event_id, user_id)
  VALUES ($1, user_id)
  ON CONFLICT (event_id, user_id) DO UPDATE SET
    registration_status = 'registered',
    registered_at = now();
    
  RETURN true;
END;
$$;