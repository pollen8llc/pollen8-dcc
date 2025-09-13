-- Update RLS policies to allow proper joins between nmn8_nominations and rms_contacts

-- Drop existing RLS policy for rms_contacts if it's too restrictive
DROP POLICY IF EXISTS "Users can manage their own contacts" ON public.rms_contacts;

-- Create updated RLS policies for rms_contacts
-- Users can manage their own contacts
CREATE POLICY "Users can manage their own contacts" 
ON public.rms_contacts 
FOR ALL 
USING (user_id = auth.uid());

-- Allow reading contacts that are nominated by current user
CREATE POLICY "Users can view contacts they have nominated" 
ON public.rms_contacts 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.nmn8_nominations 
    WHERE nmn8_nominations.contact_id = rms_contacts.id 
    AND nmn8_nominations.organizer_id = auth.uid()
  )
);