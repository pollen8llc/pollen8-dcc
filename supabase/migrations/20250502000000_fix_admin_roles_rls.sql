
-- Drop existing policies on admin_roles that might be causing recursive issues
DROP POLICY IF EXISTS "admin_roles_policy" ON public.admin_roles;

-- Create a security definer function to check admin status safely
CREATE OR REPLACE FUNCTION public.is_admin_or_self(check_user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Return true if current user is the user being checked
  IF auth.uid() = check_user_id THEN
    RETURN TRUE;
  END IF;
  
  -- Return true if current user has ADMIN role in user_roles
  RETURN EXISTS (
    SELECT 1 
    FROM public.user_roles ur
    JOIN public.roles r ON ur.role_id = r.id
    WHERE ur.user_id = auth.uid()
    AND r.name = 'ADMIN'
  );
END;
$$;

-- Add a safer policy for admin_roles
CREATE POLICY "admin_roles_select_policy" 
ON public.admin_roles
FOR SELECT
TO authenticated
USING (public.is_admin_or_self(user_id));

CREATE POLICY "admin_roles_insert_policy"
ON public.admin_roles
FOR INSERT
TO authenticated
WITH CHECK (public.is_admin_or_self(user_id));

CREATE POLICY "admin_roles_update_policy"
ON public.admin_roles
FOR UPDATE
TO authenticated
USING (public.is_admin_or_self(user_id));

CREATE POLICY "admin_roles_delete_policy"
ON public.admin_roles
FOR DELETE
TO authenticated
USING (public.is_admin_or_self(user_id));
