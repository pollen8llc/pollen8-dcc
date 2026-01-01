-- Create evalu8_contacts table for storing pre-computed contact statistics
CREATE TABLE public.evalu8_contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  contact_id UUID NOT NULL REFERENCES public.rms_contacts(id) ON DELETE CASCADE,
  
  -- Outreach Statistics
  total_outreach_count INTEGER DEFAULT 0,
  completed_outreach_count INTEGER DEFAULT 0,
  pending_outreach_count INTEGER DEFAULT 0,
  cancelled_outreach_count INTEGER DEFAULT 0,
  
  -- Notes Analytics
  total_notes_count INTEGER DEFAULT 0,
  total_notes_word_count INTEGER DEFAULT 0,
  
  -- Engagement Metrics
  engagement_score INTEGER DEFAULT 0,
  connection_strength TEXT DEFAULT 'cold',
  rapport_status TEXT DEFAULT 'new',
  
  -- Actv8 Integration
  actv8_path_id UUID,
  actv8_current_step INTEGER DEFAULT 0,
  actv8_total_steps INTEGER DEFAULT 0,
  actv8_completed_steps INTEGER DEFAULT 0,
  
  -- Activity Timeline
  first_outreach_at TIMESTAMPTZ,
  last_outreach_at TIMESTAMPTZ,
  last_completed_outreach_at TIMESTAMPTZ,
  last_note_added_at TIMESTAMPTZ,
  last_actv8_update_at TIMESTAMPTZ,
  
  -- Response Metrics
  average_response_time_hours NUMERIC(10,2),
  response_rate_percent NUMERIC(5,2),
  
  -- Channel Analytics (JSONB for flexibility)
  channel_stats JSONB DEFAULT '{}',
  
  -- Summary
  auto_summary TEXT,
  last_summary_update TIMESTAMPTZ,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  
  UNIQUE(user_id, contact_id)
);

-- Indexes for performance
CREATE INDEX idx_evalu8_contacts_user ON public.evalu8_contacts(user_id);
CREATE INDEX idx_evalu8_contacts_contact ON public.evalu8_contacts(contact_id);
CREATE INDEX idx_evalu8_contacts_engagement ON public.evalu8_contacts(user_id, engagement_score DESC);
CREATE INDEX idx_evalu8_contacts_last_activity ON public.evalu8_contacts(user_id, last_outreach_at DESC);

-- Enable RLS
ALTER TABLE public.evalu8_contacts ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own evalu8_contacts"
ON public.evalu8_contacts FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own evalu8_contacts"
ON public.evalu8_contacts FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own evalu8_contacts"
ON public.evalu8_contacts FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own evalu8_contacts"
ON public.evalu8_contacts FOR DELETE
USING (auth.uid() = user_id);

-- Function to calculate/refresh evalu8 stats for a contact
CREATE OR REPLACE FUNCTION public.calculate_evalu8_stats(p_user_id UUID, p_contact_id UUID)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
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
  -- Calculate outreach stats
  SELECT 
    COUNT(*),
    COUNT(*) FILTER (WHERE o.status = 'completed'),
    COUNT(*) FILTER (WHERE o.status = 'pending'),
    COUNT(*) FILTER (WHERE o.status = 'cancelled'),
    MIN(o.scheduled_date),
    MAX(o.scheduled_date),
    MAX(o.scheduled_date) FILTER (WHERE o.status = 'completed')
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
  SELECT path_id, current_step_index, connection_strength
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
$$;

-- Trigger function for outreach changes
CREATE OR REPLACE FUNCTION public.trigger_update_evalu8_on_outreach()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_contact_id UUID;
  v_user_id UUID;
BEGIN
  -- Get contact_id from outreach_contacts
  IF TG_OP = 'DELETE' THEN
    v_user_id := OLD.user_id;
    FOR v_contact_id IN SELECT contact_id FROM rms_outreach_contacts WHERE outreach_id = OLD.id
    LOOP
      PERFORM calculate_evalu8_stats(v_user_id, v_contact_id);
    END LOOP;
  ELSE
    v_user_id := NEW.user_id;
    FOR v_contact_id IN SELECT contact_id FROM rms_outreach_contacts WHERE outreach_id = NEW.id
    LOOP
      PERFORM calculate_evalu8_stats(v_user_id, v_contact_id);
    END LOOP;
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$;

-- Create trigger on rms_outreach
CREATE TRIGGER trg_evalu8_outreach_change
AFTER INSERT OR UPDATE OR DELETE ON public.rms_outreach
FOR EACH ROW
EXECUTE FUNCTION public.trigger_update_evalu8_on_outreach();

-- Trigger function for outreach_contacts changes (linking/unlinking)
CREATE OR REPLACE FUNCTION public.trigger_update_evalu8_on_outreach_contact()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_user_id UUID;
BEGIN
  IF TG_OP = 'DELETE' THEN
    SELECT user_id INTO v_user_id FROM rms_outreach WHERE id = OLD.outreach_id;
    IF v_user_id IS NOT NULL THEN
      PERFORM calculate_evalu8_stats(v_user_id, OLD.contact_id);
    END IF;
  ELSE
    SELECT user_id INTO v_user_id FROM rms_outreach WHERE id = NEW.outreach_id;
    IF v_user_id IS NOT NULL THEN
      PERFORM calculate_evalu8_stats(v_user_id, NEW.contact_id);
    END IF;
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$;

-- Create trigger on rms_outreach_contacts
CREATE TRIGGER trg_evalu8_outreach_contact_change
AFTER INSERT OR DELETE ON public.rms_outreach_contacts
FOR EACH ROW
EXECUTE FUNCTION public.trigger_update_evalu8_on_outreach_contact();