
-- Drop the existing INSERT policy that's causing the RLS violation
DROP POLICY IF EXISTS "Allow request participants to respond to cards" ON public.modul8_proposal_card_responses;

-- Create the updated INSERT policy that includes NULL handling for service_provider_id
CREATE POLICY "Allow request participants to respond to cards" ON public.modul8_proposal_card_responses
  FOR INSERT WITH CHECK (
    responded_by = auth.uid()
    AND EXISTS (
      SELECT 1 FROM public.modul8_proposal_cards pc
      JOIN public.modul8_service_requests sr ON pc.request_id = sr.id
      LEFT JOIN public.modul8_organizers o ON sr.organizer_id = o.id
      LEFT JOIN public.modul8_service_providers sp ON sr.service_provider_id = sp.id
      WHERE pc.id = card_id 
      AND (
        o.user_id = auth.uid() OR 
        sp.user_id = auth.uid() OR 
        (sr.service_provider_id IS NULL AND is_service_provider(auth.uid()))
      )
    )
  );
