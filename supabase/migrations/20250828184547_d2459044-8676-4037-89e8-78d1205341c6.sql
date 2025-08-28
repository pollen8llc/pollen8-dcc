
-- 1) Remove any problematic validation that touches auth.users

-- Try to drop legacy triggers (names may vary across environments)
DROP TRIGGER IF EXISTS trg_validate_community_owner ON public.communities;
DROP TRIGGER IF EXISTS validate_community_owner_trigger ON public.communities;

-- Drop the function that queried auth.users, if it exists
DROP FUNCTION IF EXISTS public.validate_community_owner();

-- 2) Ensure a safe BEFORE INSERT trigger sets owner_id from auth.uid()

-- Remove any previous owner-setting triggers to avoid duplicates
DROP TRIGGER IF EXISTS set_owner_before_insert ON public.communities;

-- Recreate the BEFORE INSERT trigger using the existing SECURITY DEFINER function
-- Note: public.set_community_owner() already exists per your DB functions
CREATE TRIGGER set_owner_before_insert
BEFORE INSERT ON public.communities
FOR EACH ROW
EXECUTE FUNCTION public.set_community_owner();

-- 3) Re-attach validation/standardization triggers that do NOT query restricted tables

-- Validate format (online | IRL | hybrid)
DROP TRIGGER IF EXISTS validate_format_before_ins_upd ON public.communities;
CREATE TRIGGER validate_format_before_ins_upd
BEFORE INSERT OR UPDATE ON public.communities
FOR EACH ROW
EXECUTE FUNCTION public.validate_community_format();

-- Validate type (in allowed list)
DROP TRIGGER IF EXISTS validate_type_before_ins_upd ON public.communities;
CREATE TRIGGER validate_type_before_ins_upd
BEFORE INSERT OR UPDATE ON public.communities
FOR EACH ROW
EXECUTE FUNCTION public.validate_community_type();

-- Standardize target_audience to array
DROP TRIGGER IF EXISTS standardize_target_audience_before_ins_upd ON public.communities;
CREATE TRIGGER standardize_target_audience_before_ins_upd
BEFORE INSERT OR UPDATE ON public.communities
FOR EACH ROW
EXECUTE FUNCTION public.standardize_target_audience();

-- Keep updated_at in sync on updates
DROP TRIGGER IF EXISTS communities_set_updated_at ON public.communities;
CREATE TRIGGER communities_set_updated_at
BEFORE UPDATE ON public.communities
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- 4) Keep RLS as-is. Reminder:
-- INSERT policy: WITH CHECK (auth.uid() = owner_id)
-- This will pass because the BEFORE INSERT trigger sets owner_id before RLS evaluation.
