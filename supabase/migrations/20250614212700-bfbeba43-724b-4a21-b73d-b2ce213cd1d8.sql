
-- Add domain specializations to service providers
ALTER TABLE public.modul8_service_providers 
ADD COLUMN IF NOT EXISTS domain_specializations INTEGER[] DEFAULT '{}';

-- Add notification system for service requests
CREATE TABLE IF NOT EXISTS public.modul8_notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  type TEXT NOT NULL, -- 'service_request', 'proposal_update', 'deal_locked'
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  data JSONB DEFAULT '{}',
  read_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add engagement tracking
CREATE TABLE IF NOT EXISTS public.modul8_engagements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  organizer_id UUID REFERENCES public.modul8_organizers(id) NOT NULL,
  service_provider_id UUID REFERENCES public.modul8_service_providers(id) NOT NULL,
  service_request_id UUID REFERENCES public.modul8_service_requests(id),
  engagement_type TEXT NOT NULL, -- 'view_profile', 'engage', 'proposal_sent'
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- RLS policies for notifications
ALTER TABLE public.modul8_notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own notifications" 
  ON public.modul8_notifications 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "System can create notifications" 
  ON public.modul8_notifications 
  FOR INSERT 
  WITH CHECK (true);

-- RLS policies for engagements
ALTER TABLE public.modul8_engagements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view engagements they're involved in" 
  ON public.modul8_engagements 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.modul8_organizers 
      WHERE id = organizer_id AND user_id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM public.modul8_service_providers 
      WHERE id = service_provider_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create engagements" 
  ON public.modul8_engagements 
  FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.modul8_organizers 
      WHERE id = organizer_id AND user_id = auth.uid()
    ) OR
    EXISTS (
      SELECT 1 FROM public.modul8_service_providers 
      WHERE id = service_provider_id AND user_id = auth.uid()
    )
  );
