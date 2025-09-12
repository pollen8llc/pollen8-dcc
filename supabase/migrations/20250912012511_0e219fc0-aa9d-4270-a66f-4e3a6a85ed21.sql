-- Add missing tables for enhanced modul8 functionality

-- Proposal threads table
CREATE TABLE IF NOT EXISTS public.modul8_proposal_threads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  service_request_id UUID NOT NULL REFERENCES public.modul8_service_requests(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Proposal versions table
CREATE TABLE IF NOT EXISTS public.modul8_proposal_versions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  thread_id UUID NOT NULL REFERENCES public.modul8_proposal_threads(id) ON DELETE CASCADE,
  proposal_id UUID NOT NULL REFERENCES public.modul8_proposal_cards(id) ON DELETE CASCADE,
  version_number INTEGER NOT NULL DEFAULT 1,
  changes_summary TEXT,
  proposed_budget NUMERIC,
  proposed_timeline TEXT,
  change_notes TEXT,
  created_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Project comments table  
CREATE TABLE IF NOT EXISTS public.modul8_project_comments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  service_request_id UUID NOT NULL REFERENCES public.modul8_service_requests(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  content TEXT NOT NULL,
  comment_type TEXT NOT NULL DEFAULT 'general',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add missing organizer_id column to negotiation status table
ALTER TABLE public.modul8_negotiation_status 
ADD COLUMN IF NOT EXISTS organizer_id UUID;

-- Enable RLS on new tables
ALTER TABLE public.modul8_proposal_threads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.modul8_proposal_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.modul8_project_comments ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for proposal threads
CREATE POLICY "Users can view proposal threads" ON public.modul8_proposal_threads
  FOR SELECT USING (true);

CREATE POLICY "Users can manage proposal threads" ON public.modul8_proposal_threads  
  FOR ALL USING (auth.uid() IS NOT NULL);

-- Create RLS policies for proposal versions
CREATE POLICY "Users can view proposal versions" ON public.modul8_proposal_versions
  FOR SELECT USING (true);

CREATE POLICY "Users can manage proposal versions" ON public.modul8_proposal_versions
  FOR ALL USING (created_by = auth.uid());

-- Create RLS policies for project comments
CREATE POLICY "Users can view project comments" ON public.modul8_project_comments
  FOR SELECT USING (true);

CREATE POLICY "Users can create project comments" ON public.modul8_project_comments
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can manage their own project comments" ON public.modul8_project_comments
  FOR ALL USING (user_id = auth.uid());

-- Add updated_at triggers
CREATE TRIGGER update_modul8_proposal_threads_updated_at
  BEFORE UPDATE ON public.modul8_proposal_threads
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_modul8_proposal_versions_updated_at  
  BEFORE UPDATE ON public.modul8_proposal_versions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_modul8_project_comments_updated_at
  BEFORE UPDATE ON public.modul8_project_comments  
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();