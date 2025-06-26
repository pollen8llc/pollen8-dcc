
-- Add 'agreement' status to proposal cards enum constraint
-- First, let's check current constraint and add the new status
DO $$ 
BEGIN
  -- Drop existing constraint if it exists
  IF EXISTS (SELECT 1 FROM information_schema.constraint_column_usage WHERE constraint_name LIKE '%status%' AND table_name = 'modul8_proposal_cards') THEN
    ALTER TABLE public.modul8_proposal_cards DROP CONSTRAINT IF EXISTS modul8_proposal_cards_status_check;
  END IF;
  
  -- Add new constraint with 'agreement' status
  ALTER TABLE public.modul8_proposal_cards 
  ADD CONSTRAINT modul8_proposal_cards_status_check 
  CHECK (status IN ('pending', 'accepted', 'rejected', 'countered', 'cancelled', 'final_confirmation', 'agreement'));
END $$;

-- Add is_agreement_locked field to service requests
ALTER TABLE public.modul8_service_requests 
ADD COLUMN IF NOT EXISTS is_agreement_locked BOOLEAN DEFAULT FALSE;

-- Update the proposal card response handler to create agreement cards
CREATE OR REPLACE FUNCTION public.handle_proposal_card_response()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
DECLARE
  v_request_id UUID;
  v_organizer_id UUID;
  v_service_provider_id UUID;
  v_negotiated_title TEXT;
  v_negotiated_description TEXT;
  v_negotiated_budget_range JSONB;
  v_negotiated_timeline TEXT;
  v_other_party_response RECORD;
  v_next_card_number INTEGER;
  v_card_status TEXT;
  v_should_lock BOOLEAN := false;
  v_has_mutual_acceptance BOOLEAN := false;
BEGIN
  -- Map response types to card statuses
  CASE NEW.response_type
    WHEN 'accept' THEN v_card_status := 'accepted';
    WHEN 'reject' THEN v_card_status := 'rejected';
    WHEN 'counter' THEN v_card_status := 'countered';
    WHEN 'cancel' THEN v_card_status := 'cancelled';
    ELSE v_card_status := NEW.response_type;
  END CASE;

  -- Get the original card and request details
  SELECT sr.organizer_id, sr.service_provider_id, sr.id
  INTO v_organizer_id, v_service_provider_id, v_request_id
  FROM public.modul8_proposal_cards pc
  JOIN public.modul8_service_requests sr ON pc.request_id = sr.id
  WHERE pc.id = NEW.card_id;

  -- Get negotiated fields from the card
  SELECT negotiated_title, negotiated_description, negotiated_budget_range, negotiated_timeline
  INTO v_negotiated_title, v_negotiated_description, v_negotiated_budget_range, v_negotiated_timeline
  FROM public.modul8_proposal_cards
  WHERE id = NEW.card_id;

  -- Handle different response types
  IF NEW.response_type IN ('reject', 'cancel') THEN
    -- Definitive endings - lock immediately
    v_should_lock := true;
  ELSIF NEW.response_type = 'accept' THEN
    -- Check if the other party has already accepted this same card
    SELECT * INTO v_other_party_response
    FROM public.modul8_proposal_card_responses
    WHERE card_id = NEW.card_id 
      AND response_type = 'accept'
      AND responded_by != NEW.responded_by;

    -- If mutual acceptance, create agreement card and lock everything
    IF FOUND THEN
      v_has_mutual_acceptance := true;
      v_should_lock := true;
    ELSE
      -- Single acceptance - keep unlocked for other party
      v_should_lock := false;
    END IF;
  END IF;

  -- Update the original card status
  UPDATE public.modul8_proposal_cards 
  SET 
    is_locked = v_should_lock,
    status = v_card_status,
    responded_at = NEW.created_at,
    responded_by = NEW.responded_by,
    updated_at = NEW.created_at
  WHERE id = NEW.card_id;

  -- If mutual acceptance achieved, create AGREEMENT card and lock request
  IF v_has_mutual_acceptance THEN
    -- Get next card number
    SELECT COALESCE(MAX(card_number), 0) + 1 INTO v_next_card_number
    FROM public.modul8_proposal_cards
    WHERE request_id = v_request_id;

    -- Create agreement card
    INSERT INTO public.modul8_proposal_cards (
      request_id,
      card_number,
      submitted_by,
      status,
      is_locked,
      notes,
      negotiated_title,
      negotiated_description,
      negotiated_budget_range,
      negotiated_timeline
    ) VALUES (
      v_request_id,
      v_next_card_number,
      NEW.responded_by, -- System-generated, attributed to responder
      'agreement',
      true,
      'AGREEMENT REACHED - Both parties have accepted the proposal. Ready to proceed with contract execution via DEEL.',
      v_negotiated_title,
      v_negotiated_description,
      v_negotiated_budget_range,
      v_negotiated_timeline
    );

    -- Lock the service request to prevent further proposals
    UPDATE public.modul8_service_requests 
    SET 
      status = 'agreed',
      is_agreement_locked = true,
      updated_at = NEW.created_at
    WHERE id = v_request_id;
  END IF;

  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  RAISE LOG 'Error in handle_proposal_card_response: %', SQLERRM;
  RAISE;
END;
$function$;
