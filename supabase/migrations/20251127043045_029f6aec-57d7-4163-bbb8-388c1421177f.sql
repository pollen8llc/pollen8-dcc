-- Add trigger_id column to rms_outreach table to link outreach tasks with triggers
ALTER TABLE rms_outreach 
ADD COLUMN trigger_id uuid REFERENCES rms_triggers(id) ON DELETE SET NULL;

-- Create index for faster lookups when finding outreach tasks by trigger
CREATE INDEX idx_rms_outreach_trigger_id ON rms_outreach(trigger_id);

COMMENT ON COLUMN rms_outreach.trigger_id IS 'Links outreach task to the trigger that created it, enabling automatic recurrence scheduling';