-- =====================================================
-- ACTV8 DATABASE-DRIVEN ARCHITECTURE
-- =====================================================

-- 1. Create relationship levels reference table
CREATE TABLE IF NOT EXISTS public.rms_actv8_relationship_levels (
    id TEXT PRIMARY KEY,
    level INTEGER NOT NULL UNIQUE,
    label TEXT NOT NULL,
    description TEXT NOT NULL,
    starting_tier INTEGER NOT NULL,
    skipped_tiers INTEGER[] DEFAULT '{}',
    icon_name TEXT NOT NULL,
    display_order INTEGER NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Create tier metadata reference table
CREATE TABLE IF NOT EXISTS public.rms_actv8_tier_metadata (
    tier INTEGER PRIMARY KEY,
    label TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Create step instances table for tracking individual step progress
CREATE TABLE IF NOT EXISTS public.rms_actv8_step_instances (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    actv8_contact_id UUID NOT NULL REFERENCES public.rms_actv8_contacts(id) ON DELETE CASCADE,
    path_instance_id UUID REFERENCES public.rms_actv8_path_instances(id) ON DELETE CASCADE,
    step_id TEXT NOT NULL,
    step_index INTEGER NOT NULL,
    path_id TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'completed', 'missed', 'retrying')),
    retry_count INTEGER DEFAULT 0,
    last_outcome TEXT CHECK (last_outcome IN ('completed', 'missed', 'declined', NULL)),
    outreach_id UUID REFERENCES public.rms_outreach(id) ON DELETE SET NULL,
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    days_to_complete INTEGER,
    interaction_outcome TEXT,
    rapport_progress TEXT,
    notes TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(actv8_contact_id, step_id, path_instance_id)
);

-- 4. Add level_switches column to rms_actv8_contacts
ALTER TABLE public.rms_actv8_contacts 
ADD COLUMN IF NOT EXISTS level_switches JSONB DEFAULT '[]';

-- 5. Add icon_name to rms_actv8_path_steps if not exists
ALTER TABLE public.rms_actv8_path_steps 
ADD COLUMN IF NOT EXISTS icon_name TEXT;

-- 6. Enable RLS on new tables
ALTER TABLE public.rms_actv8_relationship_levels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rms_actv8_tier_metadata ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rms_actv8_step_instances ENABLE ROW LEVEL SECURITY;

-- 7. RLS Policies for relationship_levels (read-only for all authenticated)
CREATE POLICY "Anyone can view relationship levels"
ON public.rms_actv8_relationship_levels FOR SELECT
USING (true);

-- 8. RLS Policies for tier_metadata (read-only for all authenticated)
CREATE POLICY "Anyone can view tier metadata"
ON public.rms_actv8_tier_metadata FOR SELECT
USING (true);

-- 9. RLS Policies for step_instances
CREATE POLICY "Users can view their own step instances"
ON public.rms_actv8_step_instances FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own step instances"
ON public.rms_actv8_step_instances FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own step instances"
ON public.rms_actv8_step_instances FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own step instances"
ON public.rms_actv8_step_instances FOR DELETE
USING (auth.uid() = user_id);

-- 10. Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_step_instances_actv8_contact 
ON public.rms_actv8_step_instances(actv8_contact_id);

CREATE INDEX IF NOT EXISTS idx_step_instances_path_instance 
ON public.rms_actv8_step_instances(path_instance_id);

CREATE INDEX IF NOT EXISTS idx_step_instances_status 
ON public.rms_actv8_step_instances(status);

-- 11. Seed relationship levels data
INSERT INTO public.rms_actv8_relationship_levels (id, level, label, description, starting_tier, skipped_tiers, icon_name, display_order)
VALUES 
    ('level_1', 1, 'Level 1: Just Met', 'New or minimal contact', 1, '{}', 'UserPlus', 1),
    ('level_2', 2, 'Level 2: Building Rapport', 'Some interaction, still connecting', 2, '{1}', 'Users', 2),
    ('level_3', 3, 'Level 3: Established', 'Regular, mutual understanding', 3, '{1,2}', 'Handshake', 3),
    ('level_4', 4, 'Level 4: Close Bond', 'Strong, long-term connection', 4, '{1,2,3}', 'Heart', 4)
ON CONFLICT (id) DO UPDATE SET
    label = EXCLUDED.label,
    description = EXCLUDED.description,
    starting_tier = EXCLUDED.starting_tier,
    skipped_tiers = EXCLUDED.skipped_tiers,
    icon_name = EXCLUDED.icon_name,
    display_order = EXCLUDED.display_order;

-- 12. Seed tier metadata
INSERT INTO public.rms_actv8_tier_metadata (tier, label, description)
VALUES 
    (1, 'Foundation', 'Build initial rapport and establish connection'),
    (2, 'Growth', 'Develop deeper understanding and mutual interest'),
    (3, 'Professional', 'Establish mutual value and collaboration'),
    (4, 'Advanced', 'Maintain strong bonds and long-term partnership')
ON CONFLICT (tier) DO UPDATE SET
    label = EXCLUDED.label,
    description = EXCLUDED.description;

-- =====================================================
-- DATABASE FUNCTIONS (RPC)
-- =====================================================

-- 13. Function to get all relationship levels
CREATE OR REPLACE FUNCTION public.get_relationship_levels()
RETURNS SETOF public.rms_actv8_relationship_levels
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT * FROM rms_actv8_relationship_levels ORDER BY display_order;
$$;

-- 14. Function to get all tier metadata
CREATE OR REPLACE FUNCTION public.get_tier_metadata()
RETURNS SETOF public.rms_actv8_tier_metadata
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT * FROM rms_actv8_tier_metadata ORDER BY tier;
$$;

-- 15. Function to mark a step as missed
CREATE OR REPLACE FUNCTION public.mark_step_missed(
    p_actv8_contact_id UUID,
    p_step_index INTEGER,
    p_reason TEXT DEFAULT 'missed'
)
RETURNS public.rms_actv8_step_instances
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_instance public.rms_actv8_step_instances;
BEGIN
    UPDATE public.rms_actv8_step_instances
    SET 
        status = 'missed',
        last_outcome = p_reason,
        retry_count = retry_count + 1,
        updated_at = now()
    WHERE actv8_contact_id = p_actv8_contact_id
      AND step_index = p_step_index
      AND status IN ('active', 'retrying')
    RETURNING * INTO v_instance;
    
    RETURN v_instance;
END;
$$;

-- 16. Function to retry a step
CREATE OR REPLACE FUNCTION public.retry_step(
    p_actv8_contact_id UUID,
    p_step_index INTEGER
)
RETURNS public.rms_actv8_step_instances
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_instance public.rms_actv8_step_instances;
BEGIN
    UPDATE public.rms_actv8_step_instances
    SET 
        status = 'retrying',
        started_at = now(),
        updated_at = now()
    WHERE actv8_contact_id = p_actv8_contact_id
      AND step_index = p_step_index
      AND status = 'missed'
    RETURNING * INTO v_instance;
    
    RETURN v_instance;
END;
$$;

-- 17. Function to complete a step
CREATE OR REPLACE FUNCTION public.complete_step(
    p_actv8_contact_id UUID,
    p_step_index INTEGER,
    p_outreach_id UUID DEFAULT NULL,
    p_interaction_outcome TEXT DEFAULT NULL,
    p_rapport_progress TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_instance public.rms_actv8_step_instances;
    v_days INTEGER;
    v_total_steps INTEGER;
    v_completed_count INTEGER;
    v_path_complete BOOLEAN := false;
BEGIN
    -- Calculate days to complete
    SELECT EXTRACT(DAY FROM (now() - started_at))::INTEGER INTO v_days
    FROM public.rms_actv8_step_instances
    WHERE actv8_contact_id = p_actv8_contact_id AND step_index = p_step_index;
    
    -- Update the step instance
    UPDATE public.rms_actv8_step_instances
    SET 
        status = 'completed',
        last_outcome = 'completed',
        outreach_id = COALESCE(p_outreach_id, outreach_id),
        completed_at = now(),
        days_to_complete = v_days,
        interaction_outcome = p_interaction_outcome,
        rapport_progress = p_rapport_progress,
        updated_at = now()
    WHERE actv8_contact_id = p_actv8_contact_id
      AND step_index = p_step_index
      AND status IN ('active', 'retrying')
    RETURNING * INTO v_instance;
    
    -- Check if path is complete
    SELECT COUNT(*), COUNT(*) FILTER (WHERE status = 'completed')
    INTO v_total_steps, v_completed_count
    FROM public.rms_actv8_step_instances
    WHERE actv8_contact_id = p_actv8_contact_id
      AND path_instance_id = v_instance.path_instance_id;
    
    v_path_complete := (v_total_steps > 0 AND v_total_steps = v_completed_count);
    
    -- Activate next step if not path complete
    IF NOT v_path_complete AND v_instance.id IS NOT NULL THEN
        UPDATE public.rms_actv8_step_instances
        SET status = 'active', started_at = now(), updated_at = now()
        WHERE actv8_contact_id = p_actv8_contact_id
          AND path_instance_id = v_instance.path_instance_id
          AND step_index = p_step_index + 1
          AND status = 'pending';
    END IF;
    
    RETURN jsonb_build_object(
        'step_instance', row_to_json(v_instance),
        'path_complete', v_path_complete,
        'completed_count', v_completed_count,
        'total_steps', v_total_steps
    );
END;
$$;

-- 18. Function to check if a level is completed
CREATE OR REPLACE FUNCTION public.check_level_completion(
    p_actv8_contact_id UUID,
    p_level INTEGER
)
RETURNS BOOLEAN
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_completed BOOLEAN;
BEGIN
    -- Check if all paths at the previous tier are completed
    -- A level is considered complete when its associated path is completed
    SELECT EXISTS (
        SELECT 1 
        FROM public.rms_actv8_path_instances pi
        JOIN public.rms_actv8_paths p ON pi.path_id = p.id
        WHERE pi.actv8_contact_id = p_actv8_contact_id
          AND p.tier = p_level
          AND pi.status = 'completed'
    ) INTO v_completed;
    
    RETURN v_completed;
END;
$$;

-- 19. Function to switch relationship level
CREATE OR REPLACE FUNCTION public.switch_relationship_level(
    p_actv8_contact_id UUID,
    p_new_level INTEGER
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_contact public.rms_actv8_contacts;
    v_current_level INTEGER;
    v_previous_complete BOOLEAN;
    v_level_data public.rms_actv8_relationship_levels;
    v_switch_record JSONB;
    v_new_switches JSONB;
BEGIN
    -- Get current contact state
    SELECT * INTO v_contact FROM public.rms_actv8_contacts WHERE id = p_actv8_contact_id;
    
    IF v_contact IS NULL THEN
        RETURN jsonb_build_object('success', false, 'error', 'Contact not found');
    END IF;
    
    v_current_level := v_contact.relationship_level;
    
    -- Get level data
    SELECT * INTO v_level_data FROM public.rms_actv8_relationship_levels WHERE level = p_new_level;
    
    IF v_level_data IS NULL THEN
        RETURN jsonb_build_object('success', false, 'error', 'Invalid level');
    END IF;
    
    -- If moving up, check if previous level is completed
    IF p_new_level > v_current_level THEN
        SELECT public.check_level_completion(p_actv8_contact_id, v_current_level) INTO v_previous_complete;
        
        IF NOT v_previous_complete AND p_new_level > 1 THEN
            RETURN jsonb_build_object(
                'success', false, 
                'error', 'Must complete level ' || v_current_level || ' before advancing',
                'requires_completion', v_current_level
            );
        END IF;
    END IF;
    
    -- Record the switch
    v_switch_record := jsonb_build_object(
        'from_level', v_current_level,
        'to_level', p_new_level,
        'switched_at', now()
    );
    
    v_new_switches := COALESCE(v_contact.level_switches, '[]'::jsonb) || v_switch_record;
    
    -- Update the contact
    UPDATE public.rms_actv8_contacts
    SET 
        relationship_level = p_new_level,
        path_tier = v_level_data.starting_tier,
        level_switches = v_new_switches,
        updated_at = now()
    WHERE id = p_actv8_contact_id;
    
    -- Create skipped path instances for skipped tiers
    IF array_length(v_level_data.skipped_tiers, 1) > 0 THEN
        INSERT INTO public.rms_actv8_path_instances (
            actv8_contact_id,
            path_id,
            status,
            skipped_reason,
            started_at,
            ended_at
        )
        SELECT 
            p_actv8_contact_id,
            p.id,
            'skipped',
            'Level switch to ' || p_new_level,
            now(),
            now()
        FROM public.rms_actv8_paths p
        WHERE p.tier = ANY(v_level_data.skipped_tiers)
          AND p.is_default = true
          AND NOT EXISTS (
              SELECT 1 FROM public.rms_actv8_path_instances pi
              WHERE pi.actv8_contact_id = p_actv8_contact_id
                AND pi.path_id = p.id
          );
    END IF;
    
    RETURN jsonb_build_object(
        'success', true,
        'new_level', p_new_level,
        'new_tier', v_level_data.starting_tier,
        'switch_count', jsonb_array_length(v_new_switches)
    );
END;
$$;

-- 20. Function to get step instances for a contact
CREATE OR REPLACE FUNCTION public.get_step_instances(
    p_actv8_contact_id UUID
)
RETURNS SETOF public.rms_actv8_step_instances
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT * FROM public.rms_actv8_step_instances
    WHERE actv8_contact_id = p_actv8_contact_id
    ORDER BY path_instance_id, step_index;
$$;

-- 21. Updated timestamp trigger for step_instances
CREATE TRIGGER update_step_instances_updated_at
    BEFORE UPDATE ON public.rms_actv8_step_instances
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();