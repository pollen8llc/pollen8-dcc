-- Create junction table for trigger-contact relationships
CREATE TABLE public.rms_trigger_contacts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  trigger_id UUID NOT NULL REFERENCES public.rms_triggers(id) ON DELETE CASCADE,
  contact_id UUID NOT NULL REFERENCES public.rms_contacts(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  UNIQUE(trigger_id, contact_id)
);

-- Enable RLS
ALTER TABLE public.rms_trigger_contacts ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can only access their own trigger-contact links
CREATE POLICY "Users can manage their trigger contacts"
ON public.rms_trigger_contacts
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.rms_triggers 
    WHERE rms_triggers.id = rms_trigger_contacts.trigger_id 
    AND rms_triggers.user_id = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.rms_triggers 
    WHERE rms_triggers.id = rms_trigger_contacts.trigger_id 
    AND rms_triggers.user_id = auth.uid()
  )
);

-- Create index for performance
CREATE INDEX idx_rms_trigger_contacts_trigger_id ON public.rms_trigger_contacts(trigger_id);
CREATE INDEX idx_rms_trigger_contacts_contact_id ON public.rms_trigger_contacts(contact_id);