-- Fix rms_contacts schema to match service interface expectations

-- Add missing columns
ALTER TABLE public.rms_contacts 
ADD COLUMN IF NOT EXISTS location text,
ADD COLUMN IF NOT EXISTS last_contact_date timestamp with time zone;

-- Rename columns to match service interface
ALTER TABLE public.rms_contacts 
RENAME COLUMN company TO organization;

ALTER TABLE public.rms_contacts 
RENAME COLUMN position TO role;