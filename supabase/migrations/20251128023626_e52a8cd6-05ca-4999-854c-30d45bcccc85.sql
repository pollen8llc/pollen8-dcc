-- Drop the existing status check constraint
ALTER TABLE public.rms_contacts 
DROP CONSTRAINT IF EXISTS rms_contacts_status_check;

-- Add updated constraint that includes 'pending' status
ALTER TABLE public.rms_contacts 
ADD CONSTRAINT rms_contacts_status_check 
CHECK (status = ANY (ARRAY['active'::text, 'inactive'::text, 'pending'::text]));