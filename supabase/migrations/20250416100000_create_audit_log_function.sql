
-- Create a function to log audit actions
CREATE OR REPLACE FUNCTION public.log_audit_action(
  action_name TEXT,
  performer_id UUID,
  target_id UUID DEFAULT NULL,
  action_details JSONB DEFAULT '{}'::jsonb
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.audit_logs (
    action,
    performed_by,
    target_user_id,
    details
  )
  VALUES (
    action_name,
    performer_id,
    target_id,
    action_details
  );
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.log_audit_action TO authenticated;
