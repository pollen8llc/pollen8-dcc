-- Fix community display issues

-- 1. Backfill NULL is_public values to true
UPDATE public.communities 
SET is_public = true 
WHERE is_public IS NULL;

-- 2. Make is_public NOT NULL with default true
ALTER TABLE public.communities 
ALTER COLUMN is_public SET NOT NULL,
ALTER COLUMN is_public SET DEFAULT true;

-- 3. Add policy for owners to view their own communities regardless of is_public status
DROP POLICY IF EXISTS "Owners can view their communities" ON public.communities;
CREATE POLICY "Owners can view their communities" 
ON public.communities 
FOR SELECT 
USING (owner_id = auth.uid());

-- 4. Attach the add_creator_as_member trigger to communities table
DROP TRIGGER IF EXISTS trigger_add_creator_as_member ON public.communities;
CREATE TRIGGER trigger_add_creator_as_member
    AFTER INSERT ON public.communities
    FOR EACH ROW
    EXECUTE FUNCTION public.add_creator_as_member();