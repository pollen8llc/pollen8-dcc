
-- Delete outreach-related data first (child tables)
DELETE FROM rms_outreach_contacts;
DELETE FROM rms_outreach;

-- Delete actv8-related data (respecting foreign key order)
DELETE FROM rms_actv8_step_instances;
DELETE FROM rms_actv8_path_instances;
DELETE FROM rms_actv8_interactions;
DELETE FROM rms_actv8_contacts;
