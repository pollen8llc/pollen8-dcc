-- Drop and recreate get_poll_counts function with proper permissions
DROP FUNCTION IF EXISTS public.get_poll_counts(uuid);

-- Create the function with SECURITY DEFINER to bypass RLS
CREATE OR REPLACE FUNCTION public.get_poll_counts(poll_id uuid)
RETURNS TABLE(option_index integer, count bigint)
LANGUAGE sql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT
    option_index,
    COUNT(*)::bigint as count
  FROM public.poll_responses
  WHERE poll_id = get_poll_counts.poll_id
  GROUP BY option_index
  ORDER BY option_index
$$;

-- Grant execute permissions to all roles
GRANT EXECUTE ON FUNCTION public.get_poll_counts(uuid) TO anon, authenticated, public;

-- Also grant usage on the public schema if needed
GRANT USAGE ON SCHEMA public TO anon, authenticated;