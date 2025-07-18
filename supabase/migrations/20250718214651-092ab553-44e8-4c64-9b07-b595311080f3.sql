
-- Update RLS policy to allow organizers to update deel_contract_url on agreement cards
DROP POLICY IF EXISTS "Users can update their own proposal cards" ON public.modul8_proposal_cards;

-- Create a more flexible update policy that allows:
-- 1. Card submitters to update non-locked cards (existing functionality)
-- 2. Organizers to update deel_contract_url on agreement cards for their requests
CREATE POLICY "Users can update proposal cards with specific permissions" ON public.modul8_proposal_cards
  FOR UPDATE USING (
    -- Original submitter can update their own non-locked cards
    (submitted_by = auth.uid() AND NOT is_locked)
    OR
    -- Organizers can update deel_contract_url on agreement cards for their service requests
    (status = 'agreement' AND EXISTS (
      SELECT 1 FROM public.modul8_service_requests sr
      JOIN public.modul8_organizers o ON sr.organizer_id = o.id
      WHERE sr.id = request_id 
      AND o.user_id = auth.uid()
    ))
  );
