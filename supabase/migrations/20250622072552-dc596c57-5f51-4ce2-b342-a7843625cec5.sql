
-- Fix role assignment for service providers during signup
CREATE OR REPLACE FUNCTION public.ensure_service_provider_role()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  -- Check if user has SERVICE_PROVIDER role in metadata
  IF NEW.raw_user_meta_data->>'role' = 'SERVICE_PROVIDER' THEN
    -- Assign SERVICE_PROVIDER role
    INSERT INTO public.user_roles (user_id, role_id)
    SELECT NEW.id, r.id
    FROM public.roles r
    WHERE r.name = 'SERVICE_PROVIDER'
    ON CONFLICT (user_id, role_id) DO NOTHING;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger for role assignment
DROP TRIGGER IF EXISTS assign_service_provider_role ON auth.users;
CREATE TRIGGER assign_service_provider_role
  AFTER INSERT ON auth.users
  FOR EACH ROW 
  EXECUTE FUNCTION public.ensure_service_provider_role();

-- Add function to properly assign requests to service providers
CREATE OR REPLACE FUNCTION public.assign_request_to_provider(
  p_service_request_id UUID,
  p_service_provider_id UUID
) RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Update the service request with provider assignment and status
  UPDATE public.modul8_service_requests
  SET 
    service_provider_id = p_service_provider_id,
    status = 'assigned',
    engagement_status = 'affiliated',
    updated_at = NOW()
  WHERE id = p_service_request_id;
  
  -- Create notification for the service provider
  INSERT INTO public.modul8_notifications (
    user_id,
    type,
    title,
    message,
    data
  )
  SELECT 
    sp.user_id,
    'service_request',
    'New Service Request Assigned',
    'You have been assigned a new service request',
    jsonb_build_object(
      'service_request_id', p_service_request_id,
      'status', 'assigned'
    )
  FROM public.modul8_service_providers sp
  WHERE sp.id = p_service_provider_id;
  
  RETURN TRUE;
END;
$$;

-- Ensure SERVICE_PROVIDER role exists
INSERT INTO public.roles (name, description, permissions)
VALUES ('SERVICE_PROVIDER', 'Service Provider Role', '{"labr8_access": true}')
ON CONFLICT (name) DO NOTHING;

-- Add status validation constraint
ALTER TABLE public.modul8_service_requests 
DROP CONSTRAINT IF EXISTS modul8_service_requests_status_check;

ALTER TABLE public.modul8_service_requests 
ADD CONSTRAINT modul8_service_requests_status_check 
CHECK (status IN ('pending', 'assigned', 'negotiating', 'agreed', 'in_progress', 'pending_review', 'revision_requested', 'pending_completion', 'completed', 'cancelled', 'closed', 'declined'));
