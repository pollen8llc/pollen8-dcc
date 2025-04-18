
-- Create a security definer function to safely get user memberships
CREATE OR REPLACE FUNCTION public.get_user_memberships(user_id UUID)
RETURNS TABLE (
  community_id UUID,
  role TEXT
)
LANGUAGE SQL
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT community_id, role
  FROM public.community_members
  WHERE user_id = user_id;
$$;

-- Grant execution permission to authenticated users
GRANT EXECUTE ON FUNCTION public.get_user_memberships TO authenticated;
