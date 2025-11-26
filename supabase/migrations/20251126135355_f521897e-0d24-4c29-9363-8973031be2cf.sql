-- Update existing outreach records to use 'pending' status
UPDATE rms_outreach 
SET status = 'pending' 
WHERE status IN ('active', 'scheduled');

-- Change the default value for new records to 'pending'
ALTER TABLE rms_outreach 
ALTER COLUMN status SET DEFAULT 'pending';