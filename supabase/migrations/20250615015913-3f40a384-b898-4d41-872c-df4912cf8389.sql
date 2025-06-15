
-- Add project revision tracking table
CREATE TABLE public.modul8_project_revisions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  service_request_id UUID NOT NULL REFERENCES public.modul8_service_requests(id) ON DELETE CASCADE,
  organizer_id UUID NOT NULL,
  service_provider_id UUID NOT NULL,
  revision_type TEXT NOT NULL CHECK (revision_type IN ('requested', 'response')),
  description TEXT NOT NULL,
  attachments JSONB DEFAULT '[]'::jsonb,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'addressed', 'accepted')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add project completion tracking table
CREATE TABLE public.modul8_project_completions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  service_request_id UUID NOT NULL REFERENCES public.modul8_service_requests(id) ON DELETE CASCADE,
  service_provider_id UUID NOT NULL,
  organizer_id UUID NOT NULL,
  completion_notes TEXT,
  deliverables JSONB DEFAULT '[]'::jsonb,
  submitted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  confirmed_at TIMESTAMP WITH TIME ZONE,
  confirmed_by UUID,
  status TEXT NOT NULL DEFAULT 'submitted' CHECK (status IN ('submitted', 'confirmed', 'rejected'))
);

-- Add project ratings table
CREATE TABLE public.modul8_project_ratings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  service_request_id UUID NOT NULL REFERENCES public.modul8_service_requests(id) ON DELETE CASCADE,
  completion_id UUID NOT NULL REFERENCES public.modul8_project_completions(id) ON DELETE CASCADE,
  organizer_id UUID NOT NULL,
  service_provider_id UUID NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  feedback TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add project milestone tracking table
CREATE TABLE public.modul8_project_milestones (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  service_request_id UUID NOT NULL REFERENCES public.modul8_service_requests(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  due_date TIMESTAMP WITH TIME ZONE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'overdue')),
  completed_at TIMESTAMP WITH TIME ZONE,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add updated_at triggers for new tables
CREATE TRIGGER update_modul8_project_revisions_updated_at
  BEFORE UPDATE ON public.modul8_project_revisions
  FOR EACH ROW EXECUTE FUNCTION public.update_timestamp();

CREATE TRIGGER update_modul8_project_milestones_updated_at
  BEFORE UPDATE ON public.modul8_project_milestones
  FOR EACH ROW EXECUTE FUNCTION public.update_timestamp();

-- Update the service requests table to support extended project statuses
ALTER TABLE public.modul8_service_requests 
ADD COLUMN IF NOT EXISTS project_progress INTEGER DEFAULT 0 CHECK (project_progress >= 0 AND project_progress <= 100);

-- Update the status check constraint to include new project statuses
ALTER TABLE public.modul8_service_requests 
DROP CONSTRAINT IF EXISTS modul8_service_requests_status_check;

ALTER TABLE public.modul8_service_requests 
ADD CONSTRAINT modul8_service_requests_status_check 
CHECK (status IN ('pending', 'negotiating', 'agreed', 'in_progress', 'pending_review', 'revision_requested', 'pending_completion', 'completed', 'cancelled'));

-- Create indexes for performance
CREATE INDEX idx_modul8_project_revisions_service_request ON public.modul8_project_revisions(service_request_id);
CREATE INDEX idx_modul8_project_revisions_status ON public.modul8_project_revisions(status);
CREATE INDEX idx_modul8_project_completions_service_request ON public.modul8_project_completions(service_request_id);
CREATE INDEX idx_modul8_project_completions_status ON public.modul8_project_completions(status);
CREATE INDEX idx_modul8_project_ratings_service_request ON public.modul8_project_ratings(service_request_id);
CREATE INDEX idx_modul8_project_milestones_service_request ON public.modul8_project_milestones(service_request_id);

-- Enable RLS on new tables
ALTER TABLE public.modul8_project_revisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.modul8_project_completions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.modul8_project_ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.modul8_project_milestones ENABLE ROW LEVEL SECURITY;

-- RLS policies for project revisions
CREATE POLICY "Users can view revisions for their projects" ON public.modul8_project_revisions
  FOR SELECT USING (
    organizer_id = auth.uid() OR 
    service_provider_id = auth.uid() OR
    public.has_role(auth.uid(), 'ADMIN')
  );

CREATE POLICY "Organizers can create revision requests" ON public.modul8_project_revisions
  FOR INSERT WITH CHECK (
    organizer_id = auth.uid() AND revision_type = 'requested'
  );

CREATE POLICY "Service providers can create revision responses" ON public.modul8_project_revisions
  FOR INSERT WITH CHECK (
    service_provider_id = auth.uid() AND revision_type = 'response'
  );

-- RLS policies for project completions
CREATE POLICY "Users can view completions for their projects" ON public.modul8_project_completions
  FOR SELECT USING (
    organizer_id = auth.uid() OR 
    service_provider_id = auth.uid() OR
    public.has_role(auth.uid(), 'ADMIN')
  );

CREATE POLICY "Service providers can submit completions" ON public.modul8_project_completions
  FOR INSERT WITH CHECK (service_provider_id = auth.uid());

CREATE POLICY "Organizers can update completion status" ON public.modul8_project_completions
  FOR UPDATE USING (organizer_id = auth.uid());

-- RLS policies for project ratings
CREATE POLICY "Users can view ratings for their projects" ON public.modul8_project_ratings
  FOR SELECT USING (
    organizer_id = auth.uid() OR 
    service_provider_id = auth.uid() OR
    public.has_role(auth.uid(), 'ADMIN')
  );

CREATE POLICY "Organizers can create ratings" ON public.modul8_project_ratings
  FOR INSERT WITH CHECK (organizer_id = auth.uid());

-- RLS policies for project milestones
CREATE POLICY "Users can view milestones for their projects" ON public.modul8_project_milestones
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.modul8_service_requests sr
      WHERE sr.id = service_request_id
      AND (sr.organizer_id = auth.uid() OR sr.service_provider_id = auth.uid())
    ) OR public.has_role(auth.uid(), 'ADMIN')
  );

CREATE POLICY "Project participants can manage milestones" ON public.modul8_project_milestones
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.modul8_service_requests sr
      WHERE sr.id = service_request_id
      AND (sr.organizer_id = auth.uid() OR sr.service_provider_id = auth.uid())
    ) OR public.has_role(auth.uid(), 'ADMIN')
  );
