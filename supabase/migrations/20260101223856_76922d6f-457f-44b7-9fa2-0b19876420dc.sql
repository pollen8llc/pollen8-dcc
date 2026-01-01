-- Drop existing function first
DROP FUNCTION IF EXISTS public.calculate_evalu8_stats(UUID, UUID);

-- Recreate function with corrected column name (outreach_channel instead of type)
CREATE OR REPLACE FUNCTION public.calculate_evalu8_stats(p_contact_id UUID, p_user_id UUID)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_total_outreach INTEGER := 0;
  v_completed_outreach INTEGER := 0;
  v_pending_outreach INTEGER := 0;
  v_cancelled_outreach INTEGER := 0;
  v_first_outreach_at TIMESTAMPTZ;
  v_last_outreach_at TIMESTAMPTZ;
  v_last_completed_at TIMESTAMPTZ;
  v_channel_stats JSONB := '{}'::jsonb;
  v_engagement_score NUMERIC := 0;
  v_connection_strength TEXT := 'cold';
BEGIN
  -- Count total outreach
  SELECT COUNT(*)
  INTO v_total_outreach
  FROM rms_outreach o
  JOIN rms_outreach_contacts oc ON o.id = oc.outreach_id
  WHERE oc.contact_id = p_contact_id AND o.user_id = p_user_id;

  -- Count by status
  SELECT 
    COUNT(*) FILTER (WHERE o.status = 'completed'),
    COUNT(*) FILTER (WHERE o.status = 'pending'),
    COUNT(*) FILTER (WHERE o.status = 'cancelled')
  INTO v_completed_outreach, v_pending_outreach, v_cancelled_outreach
  FROM rms_outreach o
  JOIN rms_outreach_contacts oc ON o.id = oc.outreach_id
  WHERE oc.contact_id = p_contact_id AND o.user_id = p_user_id;

  -- Get first and last outreach dates
  SELECT 
    MIN(o.scheduled_at),
    MAX(o.scheduled_at)
  INTO v_first_outreach_at, v_last_outreach_at
  FROM rms_outreach o
  JOIN rms_outreach_contacts oc ON o.id = oc.outreach_id
  WHERE oc.contact_id = p_contact_id AND o.user_id = p_user_id;

  -- Get last completed outreach date
  SELECT MAX(o.scheduled_at)
  INTO v_last_completed_at
  FROM rms_outreach o
  JOIN rms_outreach_contacts oc ON o.id = oc.outreach_id
  WHERE oc.contact_id = p_contact_id AND o.user_id = p_user_id AND o.status = 'completed';

  -- Calculate channel stats using correct column name
  SELECT jsonb_object_agg(COALESCE(channel, 'other'), cnt)
  INTO v_channel_stats
  FROM (
    SELECT o.outreach_channel as channel, COUNT(*) as cnt
    FROM rms_outreach o
    JOIN rms_outreach_contacts oc ON o.id = oc.outreach_id
    WHERE oc.contact_id = p_contact_id AND o.user_id = p_user_id
    GROUP BY o.outreach_channel
  ) subq;

  -- Calculate engagement score (0-100)
  IF v_total_outreach > 0 THEN
    v_engagement_score := LEAST(100, (v_completed_outreach::NUMERIC / v_total_outreach) * 100);
  END IF;

  -- Determine connection strength
  IF v_completed_outreach >= 10 THEN
    v_connection_strength := 'hot';
  ELSIF v_completed_outreach >= 5 THEN
    v_connection_strength := 'warm';
  ELSE
    v_connection_strength := 'cold';
  END IF;

  -- Return all stats as JSON
  RETURN jsonb_build_object(
    'total_outreach_count', v_total_outreach,
    'completed_outreach_count', v_completed_outreach,
    'pending_outreach_count', v_pending_outreach,
    'cancelled_outreach_count', v_cancelled_outreach,
    'first_outreach_at', v_first_outreach_at,
    'last_outreach_at', v_last_outreach_at,
    'last_completed_outreach_at', v_last_completed_at,
    'channel_stats', COALESCE(v_channel_stats, '{}'::jsonb),
    'engagement_score', v_engagement_score,
    'connection_strength', v_connection_strength
  );
END;
$$;