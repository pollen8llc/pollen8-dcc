-- Add contacts_notified_at field to track when contacts were notified
ALTER TABLE rms_outreach 
ADD COLUMN IF NOT EXISTS contacts_notified_at TIMESTAMP WITH TIME ZONE;