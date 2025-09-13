-- Add missing logo_url column to modul8_organizers table
ALTER TABLE public.modul8_organizers 
ADD COLUMN logo_url text;

-- Add missing logo_url column to modul8_service_providers table  
ALTER TABLE public.modul8_service_providers 
ADD COLUMN logo_url text;

-- Add unique constraint to ensure one organizer per user
ALTER TABLE public.modul8_organizers 
ADD CONSTRAINT modul8_organizers_user_id_unique UNIQUE (user_id);