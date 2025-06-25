
-- First, let's check what policies already exist and drop/recreate them to ensure they're correct
DROP POLICY IF EXISTS "Users can view responses for their request cards" ON public.modul8_proposal_card_responses;
DROP POLICY IF EXISTS "Users can create responses for request cards" ON public.modul8_proposal_card_responses;
DROP POLICY IF EXISTS "Users can update their own responses" ON public.modul8_proposal_card_responses;
DROP POLICY IF EXISTS "Users can delete their own responses" ON public.modul8_proposal_card_responses;

-- Now create the correct policies
CREATE POLICY "Users can view responses for their request cards" ON public.modul8_proposal_card_responses
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.modul8_proposal_cards pc
      JOIN public.modul8_service_requests sr ON pc.request_id = sr.id
      LEFT JOIN public.modul8_organizers o ON sr.organizer_id = o.id
      LEFT JOIN public.modul8_service_providers sp ON sr.service_provider_id = sp.id
      WHERE pc.id = card_id 
      AND (o.user_id = auth.uid() OR sp.user_id = auth.uid())
    )
  );

CREATE POLICY "Users can create responses for request cards" ON public.modul8_proposal_card_responses
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.modul8_proposal_cards pc
      JOIN public.modul8_service_requests sr ON pc.request_id = sr.id
      LEFT JOIN public.modul8_organizers o ON sr.organizer_id = o.id
      LEFT JOIN public.modul8_service_providers sp ON sr.service_provider_id = sp.id
      WHERE pc.id = card_id 
      AND (o.user_id = auth.uid() OR sp.user_id = auth.uid())
      AND pc.submitted_by != auth.uid()
    )
    AND responded_by = auth.uid()
  );

CREATE POLICY "Users can update their own responses" ON public.modul8_proposal_card_responses
  FOR UPDATE USING (responded_by = auth.uid());

CREATE POLICY "Users can delete their own responses" ON public.modul8_proposal_card_responses
  FOR DELETE USING (responded_by = auth.uid());
