-- Phase 1: Add calendar sync columns to rms_outreach table
ALTER TABLE rms_outreach 
ADD COLUMN IF NOT EXISTS ics_uid TEXT,
ADD COLUMN IF NOT EXISTS sequence INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS calendar_sync_enabled BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS last_calendar_update TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS raw_ics TEXT;

-- Create index on ics_uid for fast lookups
CREATE INDEX IF NOT EXISTS idx_rms_outreach_ics_uid ON rms_outreach(ics_uid);

-- Phase 1: Create audit log table for calendar sync events
CREATE TABLE IF NOT EXISTS rms_outreach_sync_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  outreach_id UUID NOT NULL REFERENCES rms_outreach(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  sync_type TEXT NOT NULL, -- 'update', 'cancel', 'reschedule', 'create'
  changes JSONB, -- Store what changed (old vs new values)
  raw_ics TEXT, -- Store the full ICS content that triggered the sync
  email_from TEXT, -- Email sender
  email_subject TEXT, -- Email subject line
  sequence INTEGER, -- ICS SEQUENCE number
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries by outreach_id
CREATE INDEX IF NOT EXISTS idx_rms_outreach_sync_log_outreach_id ON rms_outreach_sync_log(outreach_id);

-- Create index for faster queries by user_id
CREATE INDEX IF NOT EXISTS idx_rms_outreach_sync_log_user_id ON rms_outreach_sync_log(user_id);

-- Enable RLS
ALTER TABLE rms_outreach_sync_log ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can view their own sync logs
CREATE POLICY "Users can view their own sync logs"
ON rms_outreach_sync_log
FOR SELECT
USING (user_id = auth.uid());

-- RLS Policy: System can insert sync logs
CREATE POLICY "System can insert sync logs"
ON rms_outreach_sync_log
FOR INSERT
WITH CHECK (true);