-- Add notes column to rms_outreach table for outreach-specific notes
ALTER TABLE rms_outreach ADD COLUMN IF NOT EXISTS notes TEXT;