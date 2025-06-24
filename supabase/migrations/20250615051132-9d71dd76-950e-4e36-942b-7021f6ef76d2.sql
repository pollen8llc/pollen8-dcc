
-- Add comment system for service requests
CREATE TABLE public.modul8_service_request_comments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  service_request_id UUID NOT NULL REFERENCES public.modul8_service_requests(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  comment_type TEXT NOT NULL DEFAULT 'general' CHECK (comment_type IN ('general', 'status_change', 'system_notification')),
  content TEXT NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add status tracking table
CREATE TABLE public.modul8_status_changes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  service_request_id UUID NOT NULL REFERENCES public.modul8_service_requests(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  from_status TEXT,
  to_status TEXT NOT NULL,
  reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Update service request status enum to include new provider statuses
ALTER TABLE public.modul8_service_requests 
DROP CONSTRAINT IF EXISTS modul8_service_requests_status_check;

ALTER TABLE public.modul8_service_requests 
ADD CONSTRAINT modul8_service_requests_status_check 
CHECK (status IN ('pending', 'provider_responded', 'provider_declined', 'provider_agreed', 'negotiating', 'agreed', 'in_progress', 'pending_review', 'revision_requested', 'pending_completion', 'completed', 'cancelled', 'closed', 'assigned', 'declined'));

-- Add indexes for better performance
CREATE INDEX idx_service_request_comments_request ON public.modul8_service_request_comments(service_request_id);
CREATE INDEX idx_service_request_comments_user ON public.modul8_service_request_comments(user_id);
CREATE INDEX idx_status_changes_request ON public.modul8_status_changes(service_request_id);

-- Add RLS policies
ALTER TABLE public.modul8_service_request_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.modul8_status_changes ENABLE ROW LEVEL SECURITY;

-- RLS policies for comments
CREATE POLICY "Users can view comments on their service requests" 
  ON public.modul8_service_request_comments 
  FOR SELECT 
  USING (EXISTS (
    SELECT 1 FROM public.modul8_service_requests sr 
    LEFT JOIN public.modul8_organizers o ON sr.organizer_id = o.id
    LEFT JOIN public.modul8_service_providers sp ON sr.service_provider_id = sp.id
    WHERE sr.id = service_request_id 
    AND (o.user_id = auth.uid() OR sp.user_id = auth.uid())
  ));

CREATE POLICY "Users can create comments on their service requests" 
  ON public.modul8_service_request_comments 
  FOR INSERT 
  WITH CHECK (user_id = auth.uid() AND EXISTS (
    SELECT 1 FROM public.modul8_service_requests sr 
    LEFT JOIN public.modul8_organizers o ON sr.organizer_id = o.id
    LEFT JOIN public.modul8_service_providers sp ON sr.service_provider_id = sp.id
    WHERE sr.id = service_request_id 
    AND (o.user_id = auth.uid() OR sp.user_id = auth.uid())
  ));

-- RLS policies for status changes
CREATE POLICY "Users can view status changes on their service requests" 
  ON public.modul8_status_changes 
  FOR SELECT 
  USING (EXISTS (
    SELECT 1 FROM public.modul8_service_requests sr 
    LEFT JOIN public.modul8_organizers o ON sr.organizer_id = o.id
    LEFT JOIN public.modul8_service_providers sp ON sr.service_provider_id = sp.id
    WHERE sr.id = service_request_id 
    AND (o.user_id = auth.uid() OR sp.user_id = auth.uid())
  ));

CREATE POLICY "Users can create status changes on their service requests" 
  ON public.modul8_status_changes 
  FOR INSERT 
  WITH CHECK (user_id = auth.uid());

-- Create triggers for updated_at timestamps
CREATE TRIGGER update_service_request_comments_updated_at 
  BEFORE UPDATE ON public.modul8_service_request_comments 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
