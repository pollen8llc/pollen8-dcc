-- Add calendar integration fields to rms_triggers
ALTER TABLE rms_triggers 
ADD COLUMN IF NOT EXISTS system_email TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS ics_file_url TEXT,
ADD COLUMN IF NOT EXISTS calendar_event_uid TEXT UNIQUE;

-- Add ICS attachment tracking to rms_email_notifications
ALTER TABLE rms_email_notifications
ADD COLUMN IF NOT EXISTS has_ics_attachment BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS notification_type TEXT DEFAULT 'reminder',
ADD COLUMN IF NOT EXISTS ics_data TEXT;

-- Create index on system_email for faster lookups
CREATE INDEX IF NOT EXISTS idx_rms_triggers_system_email ON rms_triggers(system_email);

-- Create index on calendar_event_uid for faster lookups
CREATE INDEX IF NOT EXISTS idx_rms_triggers_calendar_event_uid ON rms_triggers(calendar_event_uid);

-- Add comment for documentation
COMMENT ON COLUMN rms_triggers.system_email IS 'Unique system email for calendar update handling (e.g., notifications-abc123@ecosystembuilder.app)';
COMMENT ON COLUMN rms_triggers.calendar_event_uid IS 'Unique identifier for the calendar event in ICS format';
COMMENT ON COLUMN rms_triggers.ics_file_url IS 'URL or storage reference to the ICS calendar file';
COMMENT ON COLUMN rms_email_notifications.notification_type IS 'Type of notification: creation, reminder, update, cancellation';