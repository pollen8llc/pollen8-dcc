-- Add outreach channel columns to rms_triggers table
ALTER TABLE rms_triggers 
ADD COLUMN IF NOT EXISTS outreach_channel text,
ADD COLUMN IF NOT EXISTS channel_details jsonb DEFAULT '{}'::jsonb;

COMMENT ON COLUMN rms_triggers.outreach_channel IS 'Follow-up method: text, call, email, dm, meeting, irl';
COMMENT ON COLUMN rms_triggers.channel_details IS 'Channel-specific contact details in JSON format';