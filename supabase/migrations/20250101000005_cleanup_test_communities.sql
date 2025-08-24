-- Clean up any test communities that don't have proper owner_id values
-- This will remove communities that were created for testing purposes

-- Delete communities without owner_id (these are likely test data)
DELETE FROM public.communities 
WHERE owner_id IS NULL OR owner_id = '';

-- Delete communities with test names (common test patterns)
DELETE FROM public.communities 
WHERE name ILIKE '%test%' 
   OR name ILIKE '%demo%' 
   OR name ILIKE '%example%'
   OR name ILIKE '%sample%';

-- Delete communities created more than 30 days ago that have no members (likely abandoned test data)
DELETE FROM public.communities 
WHERE created_at < NOW() - INTERVAL '30 days'
  AND (member_count IS NULL OR member_count = '0' OR member_count = '1');

-- Log the cleanup
INSERT INTO public.audit_logs (
    action,
    performed_by,
    details
) VALUES (
    'cleanup_test_communities',
    'system',
    jsonb_build_object(
        'timestamp', NOW(),
        'description', 'Cleaned up test communities without proper owner_id or with test names'
    )
);
