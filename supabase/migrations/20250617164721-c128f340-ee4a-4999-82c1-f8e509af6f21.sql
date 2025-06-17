
-- Create negotiation status tracking table
CREATE TABLE public.modul8_negotiation_status (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  service_request_id UUID NOT NULL REFERENCES public.modul8_service_requests(id) ON DELETE CASCADE,
  organizer_id UUID NOT NULL,
  service_provider_id UUID,
  current_status TEXT NOT NULL DEFAULT 'initiated',
  previous_status TEXT,
  status_data JSONB DEFAULT '{}'::jsonb,
  updated_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create cross-platform activity log
CREATE TABLE public.cross_platform_activity_log (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  service_request_id UUID NOT NULL REFERENCES public.modul8_service_requests(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  platform TEXT NOT NULL CHECK (platform IN ('modul8', 'labr8')),
  activity_type TEXT NOT NULL,
  activity_data JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create cross-platform notifications table
CREATE TABLE public.cross_platform_notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  recipient_id UUID NOT NULL,
  sender_id UUID,
  service_request_id UUID REFERENCES public.modul8_service_requests(id) ON DELETE CASCADE,
  notification_type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  platform_context TEXT NOT NULL CHECK (platform_context IN ('modul8', 'labr8', 'both')),
  data JSONB DEFAULT '{}'::jsonb,
  read_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add indexes for performance
CREATE INDEX idx_negotiation_status_request ON public.modul8_negotiation_status(service_request_id);
CREATE INDEX idx_negotiation_status_organizer ON public.modul8_negotiation_status(organizer_id);
CREATE INDEX idx_negotiation_status_provider ON public.modul8_negotiation_status(service_provider_id);
CREATE INDEX idx_activity_log_request ON public.cross_platform_activity_log(service_request_id);
CREATE INDEX idx_activity_log_user ON public.cross_platform_activity_log(user_id);
CREATE INDEX idx_cross_notifications_recipient ON public.cross_platform_notifications(recipient_id);
CREATE INDEX idx_cross_notifications_request ON public.cross_platform_notifications(service_request_id);

-- Add RLS policies
ALTER TABLE public.modul8_negotiation_status ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cross_platform_activity_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cross_platform_notifications ENABLE ROW LEVEL SECURITY;

-- RLS policies for negotiation status
CREATE POLICY "Users can view negotiation status for their service requests" 
  ON public.modul8_negotiation_status 
  FOR SELECT 
  USING (
    organizer_id = auth.uid() OR 
    service_provider_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.modul8_service_providers sp 
      WHERE sp.user_id = auth.uid() AND sp.id = service_provider_id
    )
  );

CREATE POLICY "Users can update negotiation status for their service requests" 
  ON public.modul8_negotiation_status 
  FOR ALL
  WITH CHECK (
    organizer_id = auth.uid() OR 
    service_provider_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.modul8_service_providers sp 
      WHERE sp.user_id = auth.uid() AND sp.id = service_provider_id
    )
  );

-- RLS policies for activity log
CREATE POLICY "Users can view activity for their service requests" 
  ON public.cross_platform_activity_log 
  FOR SELECT 
  USING (EXISTS (
    SELECT 1 FROM public.modul8_service_requests sr 
    LEFT JOIN public.modul8_organizers o ON sr.organizer_id = o.id
    LEFT JOIN public.modul8_service_providers sp ON sr.service_provider_id = sp.id
    WHERE sr.id = service_request_id 
    AND (o.user_id = auth.uid() OR sp.user_id = auth.uid())
  ));

CREATE POLICY "Users can create activity for their service requests" 
  ON public.cross_platform_activity_log 
  FOR INSERT 
  WITH CHECK (user_id = auth.uid());

-- RLS policies for cross-platform notifications
CREATE POLICY "Users can view their notifications" 
  ON public.cross_platform_notifications 
  FOR SELECT 
  USING (recipient_id = auth.uid());

CREATE POLICY "Users can create notifications" 
  ON public.cross_platform_notifications 
  FOR INSERT 
  WITH CHECK (sender_id = auth.uid() OR sender_id IS NULL);

CREATE POLICY "Users can update their notifications" 
  ON public.cross_platform_notifications 
  FOR UPDATE 
  USING (recipient_id = auth.uid());

-- Create triggers for updated_at timestamps
CREATE TRIGGER update_negotiation_status_updated_at 
  BEFORE UPDATE ON public.modul8_negotiation_status 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create function to log negotiation status changes
CREATE OR REPLACE FUNCTION public.log_negotiation_status_change()
RETURNS TRIGGER AS $$
BEGIN
  -- Log the status change in activity log
  INSERT INTO public.cross_platform_activity_log (
    service_request_id,
    user_id,
    platform,
    activity_type,
    activity_data
  ) VALUES (
    NEW.service_request_id,
    NEW.updated_by,
    CASE 
      WHEN EXISTS (SELECT 1 FROM public.modul8_organizers WHERE user_id = NEW.updated_by) THEN 'modul8'
      ELSE 'labr8'
    END,
    'status_change',
    jsonb_build_object(
      'from_status', OLD.current_status,
      'to_status', NEW.current_status,
      'status_data', NEW.status_data
    )
  );

  -- Create cross-platform notification for the other party
  IF NEW.service_provider_id IS NOT NULL THEN
    -- Notify service provider
    INSERT INTO public.cross_platform_notifications (
      recipient_id,
      sender_id,
      service_request_id,
      notification_type,
      title,
      message,
      platform_context,
      data
    )
    SELECT 
      sp.user_id,
      NEW.updated_by,
      NEW.service_request_id,
      'status_update',
      'Project Status Updated',
      'The project status has been updated to: ' || NEW.current_status,
      'labr8',
      jsonb_build_object(
        'status', NEW.current_status,
        'service_request_id', NEW.service_request_id
      )
    FROM public.modul8_service_providers sp
    WHERE sp.id = NEW.service_provider_id
    AND sp.user_id != NEW.updated_by;
  END IF;

  -- Notify organizer if updated by service provider
  INSERT INTO public.cross_platform_notifications (
    recipient_id,
    sender_id,
    service_request_id,
    notification_type,
    title,
    message,
    platform_context,
    data
  )
  SELECT 
    o.user_id,
    NEW.updated_by,
    NEW.service_request_id,
    'status_update',
    'Project Status Updated',
    'The project status has been updated to: ' || NEW.current_status,
    'modul8',
    jsonb_build_object(
      'status', NEW.current_status,
      'service_request_id', NEW.service_request_id
    )
  FROM public.modul8_organizers o
  WHERE o.id = NEW.organizer_id
  AND o.user_id != NEW.updated_by;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for negotiation status changes
CREATE TRIGGER trigger_log_negotiation_status_change
  AFTER UPDATE ON public.modul8_negotiation_status
  FOR EACH ROW
  WHEN (OLD.current_status IS DISTINCT FROM NEW.current_status)
  EXECUTE FUNCTION public.log_negotiation_status_change();

-- Enable realtime for new tables
ALTER TABLE public.modul8_negotiation_status REPLICA IDENTITY FULL;
ALTER TABLE public.cross_platform_activity_log REPLICA IDENTITY FULL;
ALTER TABLE public.cross_platform_notifications REPLICA IDENTITY FULL;

-- Add tables to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.modul8_negotiation_status;
ALTER PUBLICATION supabase_realtime ADD TABLE public.cross_platform_activity_log;
ALTER PUBLICATION supabase_realtime ADD TABLE public.cross_platform_notifications;
