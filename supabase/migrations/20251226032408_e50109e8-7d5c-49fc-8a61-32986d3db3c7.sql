-- Link existing outreach to Actv8 contact for Richard Burton
UPDATE rms_outreach 
SET actv8_contact_id = 'c616e187-8b67-4a69-8cf3-afc963a6030a',
    actv8_step_index = 0,
    updated_at = now()
WHERE id = 'bc4cbb35-bd00-4078-9af7-b9b78e9234aa';