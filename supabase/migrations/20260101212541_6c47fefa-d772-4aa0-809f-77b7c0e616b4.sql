-- Add structured_notes JSONB column to rms_outreach
ALTER TABLE rms_outreach 
ADD COLUMN IF NOT EXISTS structured_notes JSONB DEFAULT '{}';