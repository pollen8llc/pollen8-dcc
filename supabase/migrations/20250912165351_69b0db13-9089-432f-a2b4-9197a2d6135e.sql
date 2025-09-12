-- Add missing foreign key constraints for rms_outreach_contacts

-- Add foreign key constraint from rms_outreach_contacts.outreach_id to rms_outreach.id
ALTER TABLE public.rms_outreach_contacts 
ADD CONSTRAINT fk_outreach_contacts_outreach_id 
FOREIGN KEY (outreach_id) REFERENCES public.rms_outreach(id) ON DELETE CASCADE;

-- Add foreign key constraint from rms_outreach_contacts.contact_id to rms_contacts.id  
ALTER TABLE public.rms_outreach_contacts 
ADD CONSTRAINT fk_outreach_contacts_contact_id 
FOREIGN KEY (contact_id) REFERENCES public.rms_contacts(id) ON DELETE CASCADE;

-- Add indexes for better performance on foreign key columns
CREATE INDEX IF NOT EXISTS idx_rms_outreach_contacts_outreach_id ON public.rms_outreach_contacts(outreach_id);
CREATE INDEX IF NOT EXISTS idx_rms_outreach_contacts_contact_id ON public.rms_outreach_contacts(contact_id);