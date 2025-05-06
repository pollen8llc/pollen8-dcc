
-- Fix the audit log RLS issues by modifying the log_audit_action function to use SECURITY DEFINER
-- This ensures that the function runs with the privileges of its creator, bypassing RLS
CREATE OR REPLACE FUNCTION public.log_audit_action(
  action_name TEXT,
  performer_id UUID DEFAULT NULL,
  target_id UUID DEFAULT NULL,
  action_details JSONB DEFAULT '{}'::jsonb
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER -- This ensures the function runs with the privileges of the function creator
SET search_path = 'public'
AS $$
DECLARE
  current_user_id UUID;
BEGIN
  -- Get the current user if no performer_id is provided
  IF performer_id IS NULL THEN
    current_user_id := auth.uid();
  ELSE
    current_user_id := performer_id;
  END IF;

  -- Insert with error handling
  BEGIN
    INSERT INTO public.audit_logs (
      action,
      performed_by,
      target_user_id,
      details
    )
    VALUES (
      action_name,
      current_user_id,
      target_id,
      action_details
    );
  EXCEPTION WHEN OTHERS THEN
    -- Log the error but don't fail the entire transaction
    RAISE WARNING 'Failed to insert audit log: %', SQLERRM;
  END;
END;
$$;

-- Update RLS policies for audit logs to ensure administrators can access them
-- This policy allows administrators to view audit logs
DROP POLICY IF EXISTS "Only admins can select audit logs" ON public.audit_logs;
CREATE POLICY "Only admins can select audit logs"
ON public.audit_logs
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles ur
    JOIN public.roles r ON ur.role_id = r.id
    WHERE ur.user_id = auth.uid()
    AND r.name = 'ADMIN'
  )
);

-- Ensure authenticated users can insert audit logs through the function
DROP POLICY IF EXISTS "Authenticated users can insert audit logs" ON public.audit_logs;
CREATE POLICY "Authenticated users can insert audit logs"
ON public.audit_logs
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = performed_by);

-- Grant execute permission on log_audit_action to authenticated users
GRANT EXECUTE ON FUNCTION public.log_audit_action TO authenticated;
