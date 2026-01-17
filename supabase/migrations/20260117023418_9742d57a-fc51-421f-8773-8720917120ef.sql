-- Remove the level completion requirement for switching relationship levels
-- Users can now freely switch to any level at any time

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
    
    -- REMOVED: Level completion requirement check
    -- Users can now freely select any level at any time
    
    -- Record the switch (only if changing from a different level)
    IF v_current_level IS NOT NULL AND v_current_level != p_new_level THEN
        v_switch_record := jsonb_build_object(
            'from_level', v_current_level,
            'to_level', p_new_level,
            'switched_at', now()
        );
        v_new_switches := COALESCE(v_contact.level_switches, '[]'::jsonb) || v_switch_record;
    ELSE
        -- First time selection, don't record as a switch
        v_new_switches := COALESCE(v_contact.level_switches, '[]'::jsonb);
    END IF;
    
    -- Update the contact
    UPDATE public.rms_actv8_contacts
    SET 
        relationship_level = p_new_level,
        path_tier = v_level_data.starting_tier,
        level_switches = v_new_switches,
        updated_at = now()
    WHERE id = p_actv8_contact_id;
    
    RETURN jsonb_build_object(
        'success', true,
        'new_level', p_new_level,
        'new_tier', v_level_data.starting_tier,
        'level_label', v_level_data.label
    );
END;
$$;