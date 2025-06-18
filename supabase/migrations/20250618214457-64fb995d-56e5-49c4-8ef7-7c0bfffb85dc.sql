
-- Step 1: Clear all LAB-R8 and Modul8 related data while preserving table structures

-- Clear cross-platform data first (has foreign key dependencies)
DELETE FROM public.cross_platform_notifications;
DELETE FROM public.cross_platform_activity_log;

-- Clear proposal and negotiation data
DELETE FROM public.modul8_proposal_versions;
DELETE FROM public.modul8_proposal_threads;
DELETE FROM public.modul8_proposals;
DELETE FROM public.modul8_negotiation_status;

-- Clear project management data
DELETE FROM public.modul8_project_ratings;
DELETE FROM public.modul8_project_completions;
DELETE FROM public.modul8_project_revisions;
DELETE FROM public.modul8_project_milestones;
DELETE FROM public.modul8_project_comments;

-- Clear service request related data
DELETE FROM public.modul8_service_request_comments;
DELETE FROM public.modul8_status_changes;
DELETE FROM public.modul8_service_requests;

-- Clear deals and engagement data
DELETE FROM public.modul8_deals;
DELETE FROM public.modul8_engagements;

-- Clear notifications
DELETE FROM public.modul8_notifications;

-- Clear organizers and service providers (main entities)
DELETE FROM public.modul8_organizers;
DELETE FROM public.modul8_service_providers;
