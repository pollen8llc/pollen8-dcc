-- Add missing columns for calendar sync functionality

-- Add calendar_event_sequence to rms_outreach if not exists
ALTER TABLE rms_outreach 
ADD COLUMN IF NOT EXISTS calendar_event_sequence INTEGER DEFAULT 0;

-- Add email_source to rms_outreach_sync_log if not exists
ALTER TABLE rms_outreach_sync_log 
ADD COLUMN IF NOT EXISTS email_source TEXT;