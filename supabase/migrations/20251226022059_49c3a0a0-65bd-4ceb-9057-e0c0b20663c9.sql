-- Add actv8 linkage columns to rms_outreach table
ALTER TABLE rms_outreach 
ADD COLUMN IF NOT EXISTS actv8_contact_id uuid REFERENCES rms_actv8_contacts(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS actv8_step_index integer;

-- Create index for efficient lookups of actv8-linked outreach
CREATE INDEX IF NOT EXISTS idx_outreach_actv8_contact ON rms_outreach(actv8_contact_id) WHERE actv8_contact_id IS NOT NULL;

-- Add comment explaining the columns
COMMENT ON COLUMN rms_outreach.actv8_contact_id IS 'Links outreach to an Actv8 contact for step progress tracking';
COMMENT ON COLUMN rms_outreach.actv8_step_index IS 'The development path step index this outreach is tracking';