
-- Create the app_role enum type if it doesn't exist
DO $$ BEGIN
    CREATE TYPE public.app_role AS ENUM ('ADMIN', 'ORGANIZER', 'MEMBER', 'SERVICE_PROVIDER');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Insert the service provider role into the roles table if it doesn't exist
INSERT INTO public.roles (name, description, permissions)
SELECT 'SERVICE_PROVIDER', 'Service providers who offer specialized services to the community', '{}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM public.roles WHERE name = 'SERVICE_PROVIDER');

-- Create a function to allow users to update their own role (with restrictions)
CREATE OR REPLACE FUNCTION public.update_user_role_self(new_role text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  current_user_id uuid;
  allowed_roles text[] := ARRAY['MEMBER', 'ORGANIZER', 'SERVICE_PROVIDER'];
BEGIN
  -- Get the current user ID
  current_user_id := auth.uid();
  
  -- Check if the user is authenticated
  IF current_user_id IS NULL THEN
    RETURN false;
  END IF;
  
  -- Check if the new role is allowed for self-update
  IF NOT (new_role = ANY(allowed_roles)) THEN
    RETURN false;
  END IF;
  
  -- Update or insert the user role
  INSERT INTO public.user_roles (user_id, role_id)
  SELECT current_user_id, r.id
  FROM public.roles r
  WHERE r.name = new_role
  ON CONFLICT (user_id, role_id) DO NOTHING;
  
  -- Remove other roles that are not the new role (to ensure single role per user)
  DELETE FROM public.user_roles 
  WHERE user_id = current_user_id 
    AND role_id != (SELECT id FROM public.roles WHERE name = new_role);
  
  RETURN true;
END;
$$;
