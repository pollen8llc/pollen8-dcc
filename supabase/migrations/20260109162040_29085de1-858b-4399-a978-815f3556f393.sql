-- Add path_id column to rms_outreach to track which development path an outreach belongs to
ALTER TABLE rms_outreach ADD COLUMN path_id text;