-- Add outreach channel columns to rms_outreach for relationship wizard tasks
ALTER TABLE rms_outreach 
ADD COLUMN IF NOT EXISTS outreach_channel text,
ADD COLUMN IF NOT EXISTS channel_details jsonb DEFAULT '{}'::jsonb;

COMMENT ON COLUMN rms_outreach.outreach_channel IS 'Follow-up method: text, call, email, dm, meeting, irl';
COMMENT ON COLUMN rms_outreach.channel_details IS 'Channel-specific contact details in JSON format for outreach tasks';