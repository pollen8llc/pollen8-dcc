-- Make development_path_id nullable to support contacts without a selected path
ALTER TABLE rms_actv8_contacts 
ALTER COLUMN development_path_id DROP NOT NULL;