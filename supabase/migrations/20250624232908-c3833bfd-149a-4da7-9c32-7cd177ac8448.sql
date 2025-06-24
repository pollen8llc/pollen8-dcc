
-- Add negotiated request fields to proposal cards
ALTER TABLE public.modul8_proposal_cards 
ADD COLUMN negotiated_title TEXT,
ADD COLUMN negotiated_description TEXT,
ADD COLUMN negotiated_budget_range JSONB DEFAULT '{}'::jsonb,
ADD COLUMN negotiated_timeline TEXT;

-- Update existing cards to have the original request data
UPDATE public.modul8_proposal_cards 
SET 
  negotiated_title = sr.title,
  negotiated_description = sr.description,
  negotiated_budget_range = sr.budget_range,
  negotiated_timeline = sr.timeline
FROM public.modul8_service_requests sr
WHERE public.modul8_proposal_cards.request_id = sr.id;
