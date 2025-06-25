
-- Drop the trigger that automatically creates initial proposal cards
DROP TRIGGER IF EXISTS create_initial_proposal_card_trigger ON public.modul8_service_requests;

-- Drop the function that creates initial proposal cards
DROP FUNCTION IF EXISTS public.create_initial_proposal_card();

-- Clean up existing auto-generated initial proposal cards
-- These are cards with notes = 'Initial service request' and card_number = 1
DELETE FROM public.modul8_proposal_cards 
WHERE notes = 'Initial service request' 
AND card_number = 1;
