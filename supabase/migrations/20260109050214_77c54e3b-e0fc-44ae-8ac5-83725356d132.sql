-- Add score columns to evalu8_contacts
ALTER TABLE public.evalu8_contacts
ADD COLUMN IF NOT EXISTS engagement_points INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS origin_points INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS overlap_points INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS path_progress_points INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS total_strength_score INTEGER GENERATED ALWAYS AS (
  LEAST(engagement_points, 30) + LEAST(origin_points, 15) + LEAST(overlap_points, 15) + LEAST(path_progress_points, 40)
) STORED;

-- Add network score columns to iotas
ALTER TABLE public.iotas
ADD COLUMN IF NOT EXISTS avg_connection_strength NUMERIC(5,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS engagement_multiplier NUMERIC(3,2) DEFAULT 1.0,
ADD COLUMN IF NOT EXISTS network_score INTEGER DEFAULT 0;

-- Create function to calculate contact strength
CREATE OR REPLACE FUNCTION public.calculate_contact_strength(p_user_id UUID, p_contact_id UUID)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_engagement_points INTEGER := 0;
  v_origin_points INTEGER := 0;
  v_overlap_points INTEGER := 0;
  v_path_progress_points INTEGER := 0;
  v_total_score INTEGER := 0;
  
  -- Weights from formulas
  v_path_weight NUMERIC;
  v_engagement_weight NUMERIC;
  v_origin_weight NUMERIC;
  v_network_weight NUMERIC;
  
  -- Engagement modifiers
  v_calendar_accepts_points NUMERIC;
  v_fast_response_points NUMERIC;
  v_ignored_penalty NUMERIC;
  v_decline_penalty NUMERIC;
  v_gap_penalty NUMERIC;
  
  -- Origin modifiers
  v_invite_points NUMERIC;
  v_wizard_points NUMERIC;
  v_manual_points NUMERIC;
  v_import_points NUMERIC;
  v_unknown_points NUMERIC;
  v_inviter_bonus NUMERIC;
  
  -- Network modifiers
  v_shared_contacts_mult NUMERIC;
  v_affiliations_mult NUMERIC;
  v_communities_mult NUMERIC;
  
  -- Path modifiers
  v_tier_multiplier NUMERIC;
  v_completed_path_points NUMERIC;
  v_skipped_path_penalty NUMERIC;
  
  -- Contact data
  v_contact_source TEXT;
  v_has_inviter BOOLEAN;
  v_current_step INTEGER;
  v_completed_steps_count INTEGER;
  v_skipped_count INTEGER;
  v_path_tier INTEGER;
  
  -- Evalu8 data
  v_completed_outreach INTEGER;
  v_response_rate NUMERIC;
  v_avg_response_time NUMERIC;
BEGIN
  -- Fetch weights from formulas
  SELECT COALESCE(value, 40) INTO v_path_weight FROM formulas WHERE category = 'weights' AND key = 'path_weight';
  SELECT COALESCE(value, 30) INTO v_engagement_weight FROM formulas WHERE category = 'weights' AND key = 'engagement_weight';
  SELECT COALESCE(value, 15) INTO v_origin_weight FROM formulas WHERE category = 'weights' AND key = 'origin_weight';
  SELECT COALESCE(value, 15) INTO v_network_weight FROM formulas WHERE category = 'weights' AND key = 'network_weight';
  
  -- Fetch engagement modifiers
  SELECT COALESCE(value, 6) INTO v_calendar_accepts_points FROM formulas WHERE category = 'engagement' AND key = 'calendar_accepts_points';
  SELECT COALESCE(value, 4) INTO v_fast_response_points FROM formulas WHERE category = 'engagement' AND key = 'fast_response_points';
  SELECT COALESCE(value, -6) INTO v_ignored_penalty FROM formulas WHERE category = 'engagement' AND key = 'ignored_penalty';
  SELECT COALESCE(value, -5) INTO v_decline_penalty FROM formulas WHERE category = 'engagement' AND key = 'decline_penalty';
  SELECT COALESCE(value, -5) INTO v_gap_penalty FROM formulas WHERE category = 'engagement' AND key = 'gap_penalty';
  
  -- Fetch origin modifiers
  SELECT COALESCE(value, 12) INTO v_invite_points FROM formulas WHERE category = 'origin' AND key = 'invite_points';
  SELECT COALESCE(value, 10) INTO v_wizard_points FROM formulas WHERE category = 'origin' AND key = 'wizard_points';
  SELECT COALESCE(value, 7) INTO v_manual_points FROM formulas WHERE category = 'origin' AND key = 'manual_points';
  SELECT COALESCE(value, 5) INTO v_import_points FROM formulas WHERE category = 'origin' AND key = 'import_points';
  SELECT COALESCE(value, 3) INTO v_unknown_points FROM formulas WHERE category = 'origin' AND key = 'unknown_points';
  SELECT COALESCE(value, 3) INTO v_inviter_bonus FROM formulas WHERE category = 'origin' AND key = 'inviter_bonus';
  
  -- Fetch network modifiers
  SELECT COALESCE(value, 1.5) INTO v_shared_contacts_mult FROM formulas WHERE category = 'network' AND key = 'shared_contacts_multiplier';
  SELECT COALESCE(value, 1) INTO v_affiliations_mult FROM formulas WHERE category = 'network' AND key = 'affiliations_multiplier';
  SELECT COALESCE(value, 1) INTO v_communities_mult FROM formulas WHERE category = 'network' AND key = 'communities_multiplier';
  
  -- Fetch path modifiers
  SELECT COALESCE(value, 5) INTO v_tier_multiplier FROM formulas WHERE category = 'path' AND key = 'tier_multiplier';
  SELECT COALESCE(value, 4) INTO v_completed_path_points FROM formulas WHERE category = 'path' AND key = 'completed_path_points';
  SELECT COALESCE(value, -2) INTO v_skipped_path_penalty FROM formulas WHERE category = 'path' AND key = 'skipped_path_penalty';
  
  -- Get contact source and inviter info
  SELECT source, invited_by IS NOT NULL 
  INTO v_contact_source, v_has_inviter
  FROM rms_contacts 
  WHERE id = p_contact_id AND user_id = p_user_id;
  
  -- Get evalu8 data
  SELECT 
    COALESCE(completed_outreach_count, 0),
    COALESCE(response_rate_percent, 0),
    COALESCE(average_response_time_hours, 48)
  INTO v_completed_outreach, v_response_rate, v_avg_response_time
  FROM evalu8_contacts
  WHERE contact_id = p_contact_id AND user_id = p_user_id;
  
  -- Get actv8 path data
  SELECT 
    COALESCE(current_step_index, 0),
    COALESCE(array_length(completed_steps, 1), 0),
    COALESCE(jsonb_array_length(skipped_paths), 0),
    COALESCE(path_tier, 0)
  INTO v_current_step, v_completed_steps_count, v_skipped_count, v_path_tier
  FROM rms_actv8_contacts
  WHERE contact_id = p_contact_id AND user_id = p_user_id;
  
  -- Calculate engagement points (max 30)
  -- Fast responses = response time < 24 hours
  v_engagement_points := LEAST(30, GREATEST(0,
    (v_completed_outreach * 2) +
    (CASE WHEN v_avg_response_time < 24 THEN v_fast_response_points ELSE 0 END) +
    (CASE WHEN v_response_rate > 50 THEN 5 ELSE 0 END)
  ));
  
  -- Calculate origin points (max 15)
  v_origin_points := CASE v_contact_source
    WHEN 'invite_link' THEN v_invite_points
    WHEN 'wizard' THEN v_wizard_points
    WHEN 'manual' THEN v_manual_points
    WHEN 'import' THEN v_import_points
    WHEN 'google' THEN v_import_points
    ELSE v_unknown_points
  END;
  IF v_has_inviter THEN
    v_origin_points := v_origin_points + v_inviter_bonus;
  END IF;
  v_origin_points := LEAST(15, v_origin_points);
  
  -- Calculate overlap points (max 15) - simplified for now
  v_overlap_points := LEAST(15, 5); -- Base points, can be expanded later
  
  -- Calculate path progress points (max 40)
  v_path_progress_points := LEAST(40, GREATEST(0,
    (v_path_tier * v_tier_multiplier) +
    (v_completed_steps_count * v_completed_path_points) +
    (v_skipped_count * v_skipped_path_penalty)
  ));
  
  -- Calculate total (capped at 100)
  v_total_score := LEAST(100, 
    LEAST(v_engagement_points, 30) + 
    LEAST(v_origin_points, 15) + 
    LEAST(v_overlap_points, 15) + 
    LEAST(v_path_progress_points, 40)
  );
  
  -- Update evalu8_contacts with calculated points
  UPDATE evalu8_contacts
  SET 
    engagement_points = LEAST(v_engagement_points, 30),
    origin_points = LEAST(v_origin_points, 15),
    overlap_points = LEAST(v_overlap_points, 15),
    path_progress_points = LEAST(v_path_progress_points, 40),
    updated_at = now()
  WHERE contact_id = p_contact_id AND user_id = p_user_id;
  
  -- Insert if not exists
  IF NOT FOUND THEN
    INSERT INTO evalu8_contacts (user_id, contact_id, engagement_points, origin_points, overlap_points, path_progress_points)
    VALUES (p_user_id, p_contact_id, LEAST(v_engagement_points, 30), LEAST(v_origin_points, 15), LEAST(v_overlap_points, 15), LEAST(v_path_progress_points, 40));
  END IF;
  
  RETURN v_total_score;
END;
$$;

-- Create function to update user network score
CREATE OR REPLACE FUNCTION public.update_user_network_score(p_user_id UUID)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_contact_count INTEGER;
  v_avg_strength NUMERIC(5,2);
  v_multiplier NUMERIC(3,2);
  v_network_score INTEGER;
BEGIN
  -- Get contact count and average strength
  SELECT 
    COUNT(*),
    COALESCE(AVG(total_strength_score), 0)
  INTO v_contact_count, v_avg_strength
  FROM evalu8_contacts
  WHERE user_id = p_user_id;
  
  -- Get current multiplier or default to 1.0
  SELECT COALESCE(engagement_multiplier, 1.0)
  INTO v_multiplier
  FROM iotas
  WHERE user_id = p_user_id;
  
  IF v_multiplier IS NULL THEN
    v_multiplier := 1.0;
  END IF;
  
  -- Calculate network score: count × avg_strength × multiplier
  v_network_score := FLOOR(v_contact_count * v_avg_strength * v_multiplier);
  
  -- Update iotas
  UPDATE iotas
  SET 
    avg_connection_strength = v_avg_strength,
    network_score = v_network_score,
    total_network_value = v_network_score,
    updated_at = now()
  WHERE user_id = p_user_id;
  
  -- Create iotas record if doesn't exist
  IF NOT FOUND THEN
    INSERT INTO iotas (user_id, avg_connection_strength, network_score, total_network_value, engagement_multiplier)
    VALUES (p_user_id, v_avg_strength, v_network_score, v_network_score, 1.0);
  END IF;
  
  -- Also update profiles network_value
  UPDATE profiles
  SET network_value = v_network_score
  WHERE user_id = p_user_id;
  
  RETURN v_network_score;
END;
$$;