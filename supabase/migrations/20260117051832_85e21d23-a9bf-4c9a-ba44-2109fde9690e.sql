-- Fix retry_step RPC to work on 'active' and 'pending' steps, not just 'missed'
-- This ensures retry_count is incremented when rescheduling from any state

CREATE OR REPLACE FUNCTION public.retry_step(
  p_actv8_contact_id uuid,
  p_step_index integer
)
RETURNS public.rms_actv8_step_instances
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_result public.rms_actv8_step_instances;
BEGIN
  -- Update the step instance to retrying status and increment retry count
  -- Allow retrying from missed, active, or pending states
  UPDATE public.rms_actv8_step_instances
  SET 
    status = 'retrying',
    retry_count = retry_count + 1,
    started_at = now(),
    updated_at = now()
  WHERE actv8_contact_id = p_actv8_contact_id
    AND step_index = p_step_index
    AND status IN ('missed', 'active', 'pending')
  RETURNING * INTO v_result;
  
  RETURN v_result;
END;
$$;