
-- Function to increment a community's member count
CREATE OR REPLACE FUNCTION public.increment_member_count(p_community_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.communities
  SET member_count = COALESCE(member_count, 0) + 1
  WHERE id = p_community_id;
END;
$$;

-- Function to decrement a community's member count
CREATE OR REPLACE FUNCTION public.decrement_member_count(p_community_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.communities
  SET member_count = GREATEST(COALESCE(member_count, 1) - 1, 0)
  WHERE id = p_community_id;
END;
$$;
