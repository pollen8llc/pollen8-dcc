
-- 1) Wire the submission pipeline: process community submissions automatically
DROP TRIGGER IF EXISTS tr_process_community_submission ON public.community_data_distribution;

CREATE TRIGGER tr_process_community_submission
AFTER INSERT ON public.community_data_distribution
FOR EACH ROW
EXECUTE FUNCTION public.process_community_submission();


-- 2) Add validation and housekeeping triggers on communities

-- Ensure type values are valid
DROP TRIGGER IF EXISTS tr_communities_validate_type ON public.communities;
CREATE TRIGGER tr_communities_validate_type
BEFORE INSERT OR UPDATE ON public.communities
FOR EACH ROW
EXECUTE FUNCTION public.validate_community_type();

-- Ensure format values are valid
DROP TRIGGER IF EXISTS tr_communities_validate_format ON public.communities;
CREATE TRIGGER tr_communities_validate_format
BEFORE INSERT OR UPDATE ON public.communities
FOR EACH ROW
EXECUTE FUNCTION public.validate_community_format();

-- Normalize target_audience into a proper text[] array
DROP TRIGGER IF EXISTS tr_communities_standardize_target_audience ON public.communities;
CREATE TRIGGER tr_communities_standardize_target_audience
BEFORE INSERT OR UPDATE ON public.communities
FOR EACH ROW
EXECUTE FUNCTION public.standardize_target_audience();

-- Keep updated_at fresh on updates
DROP TRIGGER IF EXISTS tr_communities_update_timestamp ON public.communities;
CREATE TRIGGER tr_communities_update_timestamp
BEFORE UPDATE ON public.communities
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Ensure owner_id is set to current user and initialize member_count
DROP TRIGGER IF EXISTS tr_communities_set_owner ON public.communities;
CREATE TRIGGER tr_communities_set_owner
BEFORE INSERT ON public.communities
FOR EACH ROW
EXECUTE FUNCTION public.community_creator_check();

-- Audit log entry on creation
DROP TRIGGER IF EXISTS tr_log_community_creation ON public.communities;
CREATE TRIGGER tr_log_community_creation
AFTER INSERT ON public.communities
FOR EACH ROW
EXECUTE FUNCTION public.log_community_creation();
