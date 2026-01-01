-- Drop the existing function first
DROP FUNCTION IF EXISTS public.calculate_evalu8_stats(uuid, uuid);

-- Recreate with correct column name (scheduled_at instead of scheduled_date)
CREATE OR REPLACE FUNCTION public.calculate_evalu8_stats(p_user_id uuid, p_contact_id uuid)
 RETURNS uuid
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  v_evalu8_id UUID;
  v_total_outreach INTEGER;
  v_completed INTEGER;
  v_pending INTEGER;
  v_cancelled INTEGER;
  v_notes_count INTEGER;
  v_notes_words INTEGER;
  v_first_outreach TIMESTAMPTZ;
  v_last_outreach TIMESTAMPTZ;
  v_last_completed TIMESTAMPTZ;
  v_last_note TIMESTAMPTZ;
  v_channel_stats JSONB;
  v_actv8_record RECORD;
  v_engagement INTEGER;
  v_strength TEXT;
BEGIN
  -- Calculate outreach stats using scheduled_at (correct column name)
  SELECT 
    COUNT(*),
    COUNT(*) FILTER (WHERE o.status = 'completed'),
    COUNT(*) FILTER (WHERE o.status = 'pending'),
    COUNT(*) FILTER (WHERE o.status = 'cancelled'),
    MIN(o.scheduled_at),
    MAX(o.scheduled_at),
    MAX(o.scheduled_at) FILTER (WHERE o.status = 'completed')
  INTO v_total_outreach, v_completed, v_pending, v_cancelled, v_first_outreach, v_last_outreach, v_last_completed
  FROM rms_outreach o
  JOIN rms_outreach_contacts oc ON o.id = oc.outreach_id
  WHERE oc.contact_id = p_contact_id AND o.user_id = p_user_id;

  -- Calculate notes stats
  SELECT 
    COUNT(*) FILTER (WHERE o.notes IS NOT NULL AND o.notes != ''),
    COALESCE(SUM(array_length(regexp_split_to_array(o.notes, '\s+'), 1)) FILTER (WHERE o.notes IS NOT NULL), 0),
    MAX(o.updated_at) FILTER (WHERE o.notes IS NOT NULL AND o.notes != '')
  INTO v_notes_count, v_notes_words, v_last_note
  FROM rms_outreach o
  JOIN rms_outreach_contacts oc ON o.id = oc.outreach_id
  WHERE oc.contact_id = p_contact_id AND o.user_id = p_user_id;

  -- Calculate channel stats
  SELECT jsonb_object_agg(COALESCE(o.type, 'other'), cnt)
  INTO v_channel_stats
  FROM (
    SELECT o.type, COUNT(*) as cnt
    FROM rms_outreach o
    JOIN rms_outreach_contacts oc ON o.id = oc.outreach_id
    WHERE oc.contact_id = p_contact_id AND o.user_id = p_user_id
    GROUP BY o.type
  ) o;

  -- Get actv8 data if exists
  SELECT development_path_id as path_id, current_step_index, connection_strength
  INTO v_actv8_record
  FROM rms_actv8_contacts
  WHERE contact_id = p_contact_id AND status = 'active'
  LIMIT 1;

  -- Calculate engagement score (0-100)
  v_engagement := LEAST(100, 
    (COALESCE(v_completed, 0) * 10) + 
    (COALESCE(v_notes_count, 0) * 5) +
    CASE WHEN v_last_outreach > now() - interval '7 days' THEN 20 ELSE 0 END +
    CASE WHEN v_last_outreach > now() - interval '30 days' THEN 10 ELSE 0 END
  );

  -- Determine connection strength
  v_strength := CASE 
    WHEN v_engagement >= 80 THEN 'star'
    WHEN v_engagement >= 60 THEN 'hot'
    WHEN v_engagement >= 30 THEN 'warm'
    ELSE 'cold'
  END;

  -- Upsert evalu8_contacts record
  INSERT INTO evalu8_contacts (
    user_id, contact_id,
    total_outreach_count, completed_outreach_count, pending_outreach_count, cancelled_outreach_count,
    total_notes_count, total_notes_word_count,
    engagement_score, connection_strength,
    actv8_path_id, actv8_current_step,
    first_outreach_at, last_outreach_at, last_completed_outreach_at, last_note_added_at,
    channel_stats, updated_at
  ) VALUES (
    p_user_id, p_contact_id,
    COALESCE(v_total_outreach, 0), COALESCE(v_completed, 0), COALESCE(v_pending, 0), COALESCE(v_cancelled, 0),
    COALESCE(v_notes_count, 0), COALESCE(v_notes_words, 0),
    v_engagement, v_strength,
    v_actv8_record.path_id, COALESCE(v_actv8_record.current_step_index, 0),
    v_first_outreach, v_last_outreach, v_last_completed, v_last_note,
    COALESCE(v_channel_stats, '{}'), now()
  )
  ON CONFLICT (user_id, contact_id) DO UPDATE SET
    total_outreach_count = EXCLUDED.total_outreach_count,
    completed_outreach_count = EXCLUDED.completed_outreach_count,
    pending_outreach_count = EXCLUDED.pending_outreach_count,
    cancelled_outreach_count = EXCLUDED.cancelled_outreach_count,
    total_notes_count = EXCLUDED.total_notes_count,
    total_notes_word_count = EXCLUDED.total_notes_word_count,
    engagement_score = EXCLUDED.engagement_score,
    connection_strength = EXCLUDED.connection_strength,
    actv8_path_id = EXCLUDED.actv8_path_id,
    actv8_current_step = EXCLUDED.actv8_current_step,
    first_outreach_at = EXCLUDED.first_outreach_at,
    last_outreach_at = EXCLUDED.last_outreach_at,
    last_completed_outreach_at = EXCLUDED.last_completed_outreach_at,
    last_note_added_at = EXCLUDED.last_note_added_at,
    channel_stats = EXCLUDED.channel_stats,
    updated_at = now()
  RETURNING id INTO v_evalu8_id;

  RETURN v_evalu8_id;
END;
$function$;