
-- Add comprehensive RLS policies for the proposal system

-- First, let's create helper functions to check user roles
CREATE OR REPLACE FUNCTION public.is_service_provider(user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.modul8_service_providers
    WHERE user_id = $1
  );
$$;

CREATE OR REPLACE FUNCTION public.is_organizer(user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.modul8_organizers
    WHERE user_id = $1
  );
$$;

-- Drop existing policies to recreate them properly
DROP POLICY IF EXISTS "Users can view proposal cards for their requests" ON public.modul8_proposal_cards;
DROP POLICY IF EXISTS "Users can create proposal cards for their requests" ON public.modul8_proposal_cards;
DROP POLICY IF EXISTS "Users can update their own proposal cards" ON public.modul8_proposal_cards;

-- Create comprehensive RLS policies for modul8_proposal_cards
CREATE POLICY "Users can view proposal cards for their requests" ON public.modul8_proposal_cards
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.modul8_service_requests sr
      LEFT JOIN public.modul8_organizers o ON sr.organizer_id = o.id
      LEFT JOIN public.modul8_service_providers sp ON sr.service_provider_id = sp.id
      WHERE sr.id = request_id 
      AND (
        o.user_id = auth.uid() OR 
        sp.user_id = auth.uid() OR
        (sr.service_provider_id IS NULL AND public.is_service_provider(auth.uid()))
      )
    )
  );

CREATE POLICY "Service providers can create proposal cards" ON public.modul8_proposal_cards
  FOR INSERT WITH CHECK (
    public.is_service_provider(auth.uid()) AND
    submitted_by = auth.uid() AND
    EXISTS (
      SELECT 1 FROM public.modul8_service_requests sr
      WHERE sr.id = request_id
      AND (
        sr.service_provider_id IS NULL OR 
        EXISTS (
          SELECT 1 FROM public.modul8_service_providers sp 
          WHERE sp.id = sr.service_provider_id AND sp.user_id = auth.uid()
        )
      )
    )
  );

CREATE POLICY "Organizers can create proposal cards" ON public.modul8_proposal_cards
  FOR INSERT WITH CHECK (
    public.is_organizer(auth.uid()) AND
    submitted_by = auth.uid() AND
    EXISTS (
      SELECT 1 FROM public.modul8_service_requests sr
      JOIN public.modul8_organizers o ON sr.organizer_id = o.id
      WHERE sr.id = request_id AND o.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update their own proposal cards" ON public.modul8_proposal_cards
  FOR UPDATE USING (submitted_by = auth.uid() AND NOT is_locked);

-- Update RLS policies for modul8_proposal_card_responses
DROP POLICY IF EXISTS "Users can view responses for their request cards" ON public.modul8_proposal_card_responses;
DROP POLICY IF EXISTS "Users can create responses for request cards" ON public.modul8_proposal_card_responses;
DROP POLICY IF EXISTS "Users can update their own responses" ON public.modul8_proposal_card_responses;
DROP POLICY IF EXISTS "Users can delete their own responses" ON public.modul8_proposal_card_responses;

CREATE POLICY "Users can view responses for their request cards" ON public.modul8_proposal_card_responses
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.modul8_proposal_cards pc
      JOIN public.modul8_service_requests sr ON pc.request_id = sr.id
      LEFT JOIN public.modul8_organizers o ON sr.organizer_id = o.id
      LEFT JOIN public.modul8_service_providers sp ON sr.service_provider_id = sp.id
      WHERE pc.id = card_id 
      AND (
        o.user_id = auth.uid() OR 
        sp.user_id = auth.uid() OR
        (sr.service_provider_id IS NULL AND public.is_service_provider(auth.uid()))
      )
    )
  );

CREATE POLICY "Users can create responses for request cards" ON public.modul8_proposal_card_responses
  FOR INSERT WITH CHECK (
    responded_by = auth.uid() AND
    EXISTS (
      SELECT 1 FROM public.modul8_proposal_cards pc
      JOIN public.modul8_service_requests sr ON pc.request_id = sr.id
      LEFT JOIN public.modul8_organizers o ON sr.organizer_id = o.id
      LEFT JOIN public.modul8_service_providers sp ON sr.service_provider_id = sp.id
      WHERE pc.id = card_id 
      AND (
        o.user_id = auth.uid() OR 
        sp.user_id = auth.uid() OR
        (sr.service_provider_id IS NULL AND public.is_service_provider(auth.uid()))
      )
      AND pc.submitted_by != auth.uid()
    )
  );

CREATE POLICY "Users can update their own responses" ON public.modul8_proposal_card_responses
  FOR UPDATE USING (responded_by = auth.uid());

CREATE POLICY "Users can delete their own responses" ON public.modul8_proposal_card_responses
  FOR DELETE USING (responded_by = auth.uid());

-- Update RLS policies for modul8_request_comments
DROP POLICY IF EXISTS "Users can view comments for their requests" ON public.modul8_request_comments;
DROP POLICY IF EXISTS "Users can create comments for their requests" ON public.modul8_request_comments;
DROP POLICY IF EXISTS "Users can update their own comments" ON public.modul8_request_comments;

CREATE POLICY "Users can view comments for their requests" ON public.modul8_request_comments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.modul8_service_requests sr
      LEFT JOIN public.modul8_organizers o ON sr.organizer_id = o.id
      LEFT JOIN public.modul8_service_providers sp ON sr.service_provider_id = sp.id
      WHERE sr.id = request_id 
      AND (
        o.user_id = auth.uid() OR 
        sp.user_id = auth.uid() OR
        (sr.service_provider_id IS NULL AND public.is_service_provider(auth.uid()))
      )
    )
  );

CREATE POLICY "Users can create comments for their requests" ON public.modul8_request_comments
  FOR INSERT WITH CHECK (
    user_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM public.modul8_service_requests sr
      LEFT JOIN public.modul8_organizers o ON sr.organizer_id = o.id
      LEFT JOIN public.modul8_service_providers sp ON sr.service_provider_id = sp.id
      WHERE sr.id = request_id 
      AND (
        o.user_id = auth.uid() OR 
        sp.user_id = auth.uid() OR
        (sr.service_provider_id IS NULL AND public.is_service_provider(auth.uid()))
      )
    )
  );

CREATE POLICY "Users can update their own comments" ON public.modul8_request_comments
  FOR UPDATE USING (user_id = auth.uid());

-- Add audit logging for proposal submissions
CREATE OR REPLACE FUNCTION public.log_proposal_submission()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
BEGIN
  -- Log proposal card creation
  PERFORM log_audit_action(
    'proposal_card_created',
    NEW.submitted_by,
    NULL,
    jsonb_build_object(
      'card_id', NEW.id,
      'request_id', NEW.request_id,
      'card_number', NEW.card_number,
      'status', NEW.status,
      'negotiated_title', NEW.negotiated_title
    )
  );
  
  RETURN NEW;
END;
$function$;

-- Create trigger for audit logging
DROP TRIGGER IF EXISTS log_proposal_submission_trigger ON public.modul8_proposal_cards;
CREATE TRIGGER log_proposal_submission_trigger
  AFTER INSERT ON public.modul8_proposal_cards
  FOR EACH ROW
  EXECUTE FUNCTION public.log_proposal_submission();
