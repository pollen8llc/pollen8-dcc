-- Fix community creation RLS policies
-- Drop the restrictive policy that only allows ADMIN/ORGANIZER
DROP POLICY IF EXISTS "Admins and organizers can create communities" ON public.communities;

-- Update the authenticated user policy to be more permissive
DROP POLICY IF EXISTS "Authenticated users can create communities" ON public.communities;

-- Create a new policy that allows any authenticated user to create communities they own
CREATE POLICY "Authenticated users can create communities" ON public.communities
  FOR INSERT WITH CHECK (
    auth.uid() IS NOT NULL AND auth.uid() = owner_id
  );

-- Ensure the owner_id is set properly by adding a trigger
CREATE OR REPLACE FUNCTION public.set_community_owner()
RETURNS TRIGGER AS $$
BEGIN
  -- Set owner_id to current user if not specified
  IF NEW.owner_id IS NULL THEN
    NEW.owner_id := auth.uid();
  END IF;
  
  -- Ensure owner_id matches current user for security
  IF NEW.owner_id != auth.uid() THEN
    RAISE EXCEPTION 'Cannot create community for another user';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically set owner_id
DROP TRIGGER IF EXISTS set_community_owner_trigger ON public.communities;
CREATE TRIGGER set_community_owner_trigger
  BEFORE INSERT ON public.communities
  FOR EACH ROW
  EXECUTE FUNCTION public.set_community_owner();