
-- Update the handle_proposal_card_response function to properly map response types to card statuses
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
BEGIN
  -- Map response types to card statuses
  CASE NEW.response_type
    WHEN 'accept' THEN v_card_status := 'accepted';
    WHEN 'reject' THEN v_card_status := 'rejected';
    WHEN 'counter' THEN v_card_status := 'countered';
    WHEN 'cancel' THEN v_card_status := 'cancelled';
    ELSE v_card_status := NEW.response_type; -- fallback
  END CASE;

  -- Get the original card and request details separately
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

  -- Update the original card status and lock it
  UPDATE public.modul8_proposal_cards 
  SET 
    is_locked = true,
    status = v_card_status,
    responded_at = NEW.created_at,
    responded_by = NEW.responded_by,
    updated_at = NEW.created_at
  WHERE id = NEW.card_id;

  -- If response is 'accept', check for mutual acceptance
  IF NEW.response_type = 'accept' THEN
    -- Check if the other party has already accepted this same card
    SELECT * INTO v_other_party_response
    FROM public.modul8_proposal_card_responses
    WHERE card_id = NEW.card_id 
      AND response_type = 'accept'
      AND responded_by != NEW.responded_by;

    -- If mutual acceptance, create final confirmation card and update request status
    IF FOUND THEN
      -- Get next card number
      SELECT COALESCE(MAX(card_number), 0) + 1 INTO v_next_card_number
      FROM public.modul8_proposal_cards
      WHERE request_id = v_request_id;

      -- Create final confirmation card
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
        NEW.responded_by, -- System-generated, but attributed to responder
        'final_confirmation',
        true,
        'MUTUAL ACCEPTANCE ACHIEVED - Deal confirmed by both parties. Ready for contract execution.',
        v_negotiated_title,
        v_negotiated_description,
        v_negotiated_budget_range,
        v_negotiated_timeline
      );

      -- Update service request status to agreed
      UPDATE public.modul8_service_requests 
      SET status = 'agreed', updated_at = NEW.created_at
      WHERE id = v_request_id;
    END IF;
  END IF;

  -- If response is 'reject', just update the card (already done above)
  -- If response is 'counter', the counter proposal will be created separately

  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  -- Log the error for debugging
  RAISE LOG 'Error in handle_proposal_card_response: %', SQLERRM;
  -- Re-raise the exception to ensure transaction rollback
  RAISE;
END;
$function$;
