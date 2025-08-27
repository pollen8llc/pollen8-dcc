
-- 1) Remove any triggers that might validate owner_id by reading auth.users
DROP TRIGGER IF EXISTS validate_community_owner_trigger ON public.communities;
DROP TRIGGER IF EXISTS community_owner_validate_trigger ON public.communities;
DROP TRIGGER IF EXISTS community_owner_trigger ON public.communities;
DROP TRIGGER IF EXISTS community_creator_check_trigger ON public.communities;

-- 2) Drop the problematic function if present
DROP FUNCTION IF EXISTS public.validate_community_owner();

-- 3) Ensure a safe, minimal SECURITY DEFINER trigger to set/validate owner_id without touching auth.users
CREATE OR REPLACE FUNCTION public.set_community_owner()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  -- Default owner to current user if not provided
  IF NEW.owner_id IS NULL THEN
    NEW.owner_id := auth.uid();
  END IF;

  -- Prevent creating communities on behalf of another user
  IF NEW.owner_id IS DISTINCT FROM auth.uid() THEN
    RAISE EXCEPTION 'Cannot create community for another user';
  END IF;

  RETURN NEW;
END;
$function$;

-- Reattach the single owner trigger
DROP TRIGGER IF EXISTS set_community_owner_trigger ON public.communities;
CREATE TRIGGER set_community_owner_trigger
  BEFORE INSERT ON public.communities
  FOR EACH ROW
  EXECUTE FUNCTION public.set_community_owner();

-- 4) Ensure INSERT policy is correct for authenticated users
DROP POLICY IF EXISTS "Authenticated users can create communities" ON public.communities;

CREATE POLICY "Authenticated users can create communities"
  ON public.communities
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = owner_id);
