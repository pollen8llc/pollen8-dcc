
-- Create proposal threads table for structured negotiation
CREATE TABLE public.modul8_proposal_threads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  service_request_id UUID NOT NULL REFERENCES public.modul8_service_requests(id) ON DELETE CASCADE,
  organizer_id UUID NOT NULL,
  service_provider_id UUID NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'closed', 'completed')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create proposal versions table for version history
CREATE TABLE public.modul8_proposal_versions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  thread_id UUID NOT NULL REFERENCES public.modul8_proposal_threads(id) ON DELETE CASCADE,
  proposal_id UUID NOT NULL REFERENCES public.modul8_proposals(id) ON DELETE CASCADE,
  version_number INTEGER NOT NULL DEFAULT 1,
  quote_amount NUMERIC,
  timeline TEXT,
  scope_details TEXT,
  terms TEXT,
  change_notes TEXT,
  created_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create project comments table for collaboration
CREATE TABLE public.modul8_project_comments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  service_request_id UUID NOT NULL REFERENCES public.modul8_service_requests(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  comment_type TEXT NOT NULL DEFAULT 'comment' CHECK (comment_type IN ('comment', 'status_update', 'deliverable', 'milestone')),
  content TEXT NOT NULL,
  attachments JSONB DEFAULT '[]'::jsonb,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Update modul8_service_requests status enum to include new statuses
ALTER TABLE public.modul8_service_requests 
DROP CONSTRAINT IF EXISTS modul8_service_requests_status_check;

ALTER TABLE public.modul8_service_requests 
ADD CONSTRAINT modul8_service_requests_status_check 
CHECK (status IN ('pending', 'negotiating', 'agreed', 'in_progress', 'pending_review', 'revision_requested', 'pending_completion', 'completed', 'cancelled', 'closed', 'assigned', 'declined'));

-- Update modul8_proposals status enum
ALTER TABLE public.modul8_proposals 
DROP CONSTRAINT IF EXISTS modul8_proposals_status_check;

ALTER TABLE public.modul8_proposals 
ADD CONSTRAINT modul8_proposals_status_check 
CHECK (status IN ('pending', 'accepted', 'rejected', 'submitted', 'countered'));

-- Add indexes for better performance
CREATE INDEX idx_proposal_threads_service_request ON public.modul8_proposal_threads(service_request_id);
CREATE INDEX idx_proposal_versions_thread ON public.modul8_proposal_versions(thread_id);
CREATE INDEX idx_project_comments_service_request ON public.modul8_project_comments(service_request_id);
CREATE INDEX idx_project_comments_user ON public.modul8_project_comments(user_id);

-- Add RLS policies for the new tables
ALTER TABLE public.modul8_proposal_threads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.modul8_proposal_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.modul8_project_comments ENABLE ROW LEVEL SECURITY;

-- RLS policies for proposal threads
CREATE POLICY "Users can view proposal threads they're involved in" 
  ON public.modul8_proposal_threads 
  FOR SELECT 
  USING (organizer_id = auth.uid() OR service_provider_id = auth.uid());

CREATE POLICY "Organizers and providers can create proposal threads" 
  ON public.modul8_proposal_threads 
  FOR INSERT 
  WITH CHECK (organizer_id = auth.uid() OR service_provider_id = auth.uid());

-- RLS policies for proposal versions
CREATE POLICY "Users can view proposal versions in their threads" 
  ON public.modul8_proposal_versions 
  FOR SELECT 
  USING (EXISTS (
    SELECT 1 FROM public.modul8_proposal_threads pt 
    WHERE pt.id = thread_id AND (pt.organizer_id = auth.uid() OR pt.service_provider_id = auth.uid())
  ));

CREATE POLICY "Users can create proposal versions" 
  ON public.modul8_proposal_versions 
  FOR INSERT 
  WITH CHECK (created_by = auth.uid());

-- RLS policies for project comments
CREATE POLICY "Users can view project comments they're involved in" 
  ON public.modul8_project_comments 
  FOR SELECT 
  USING (EXISTS (
    SELECT 1 FROM public.modul8_service_requests sr 
    LEFT JOIN public.modul8_organizers o ON sr.organizer_id = o.id
    LEFT JOIN public.modul8_service_providers sp ON sr.service_provider_id = sp.id
    WHERE sr.id = service_request_id 
    AND (o.user_id = auth.uid() OR sp.user_id = auth.uid())
  ));

CREATE POLICY "Users can create project comments on their projects" 
  ON public.modul8_project_comments 
  FOR INSERT 
  WITH CHECK (user_id = auth.uid() AND EXISTS (
    SELECT 1 FROM public.modul8_service_requests sr 
    LEFT JOIN public.modul8_organizers o ON sr.organizer_id = o.id
    LEFT JOIN public.modul8_service_providers sp ON sr.service_provider_id = sp.id
    WHERE sr.id = service_request_id 
    AND (o.user_id = auth.uid() OR sp.user_id = auth.uid())
  ));

-- Create triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_proposal_threads_updated_at 
  BEFORE UPDATE ON public.modul8_proposal_threads 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_project_comments_updated_at 
  BEFORE UPDATE ON public.modul8_project_comments 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
