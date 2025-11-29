-- Add new contact fields for comprehensive profile management
ALTER TABLE public.rms_contacts
ADD COLUMN IF NOT EXISTS preferred_name text,
ADD COLUMN IF NOT EXISTS next_followup_date timestamp with time zone,
ADD COLUMN IF NOT EXISTS rapport_status text DEFAULT 'yellow' CHECK (rapport_status IN ('red', 'yellow', 'green')),
ADD COLUMN IF NOT EXISTS preferred_channel text,
ADD COLUMN IF NOT EXISTS birthday date,
ADD COLUMN IF NOT EXISTS anniversary date,
ADD COLUMN IF NOT EXISTS anniversary_type text,
ADD COLUMN IF NOT EXISTS upcoming_event text,
ADD COLUMN IF NOT EXISTS upcoming_event_date timestamp with time zone,
ADD COLUMN IF NOT EXISTS professional_goals text,
ADD COLUMN IF NOT EXISTS how_we_met text,
ADD COLUMN IF NOT EXISTS events_attended text[];

-- Add comment for documentation
COMMENT ON COLUMN public.rms_contacts.preferred_name IS 'Preferred name or pronunciation';
COMMENT ON COLUMN public.rms_contacts.next_followup_date IS 'Next scheduled follow-up date';
COMMENT ON COLUMN public.rms_contacts.rapport_status IS 'Relationship strength: red (cold), yellow (warm), green (strong)';
COMMENT ON COLUMN public.rms_contacts.preferred_channel IS 'Preferred communication channel (email, phone, text, etc.)';
COMMENT ON COLUMN public.rms_contacts.birthday IS 'Contact birthday';
COMMENT ON COLUMN public.rms_contacts.anniversary IS 'Work, community, or personal milestone anniversary';
COMMENT ON COLUMN public.rms_contacts.anniversary_type IS 'Type of anniversary (work, community, personal)';
COMMENT ON COLUMN public.rms_contacts.upcoming_event IS 'Important upcoming event (conference, launch, meetup)';
COMMENT ON COLUMN public.rms_contacts.upcoming_event_date IS 'Date of upcoming event';
COMMENT ON COLUMN public.rms_contacts.professional_goals IS 'Current professional goals or focus areas';
COMMENT ON COLUMN public.rms_contacts.how_we_met IS 'How you met / shared context';
COMMENT ON COLUMN public.rms_contacts.events_attended IS 'List of events this contact attends';