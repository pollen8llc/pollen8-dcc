-- Fix check_level_completion to look for 'ended' status instead of 'completed'
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
    -- Check if any path at this level/tier has been completed (ended)
    -- A level is considered complete when its associated path is ended
    SELECT EXISTS (
        SELECT 1 
        FROM public.rms_actv8_path_instances pi
        JOIN public.rms_actv8_paths p ON pi.path_id = p.id
        WHERE pi.actv8_contact_id = p_actv8_contact_id
          AND p.tier = p_level
          AND pi.status = 'ended'  -- Changed from 'completed' to 'ended'
    ) INTO v_completed;
    
    RETURN v_completed;
END;
$$;