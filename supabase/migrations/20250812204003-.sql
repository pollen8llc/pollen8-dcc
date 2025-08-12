-- Grant execute permissions for get_poll_counts function to anonymous and authenticated users
GRANT EXECUTE ON FUNCTION get_poll_counts(uuid) TO anon, authenticated;