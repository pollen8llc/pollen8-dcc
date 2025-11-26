-- Add system_email column to rms_outreach table for calendar sync
ALTER TABLE rms_outreach 
ADD COLUMN system_email TEXT;