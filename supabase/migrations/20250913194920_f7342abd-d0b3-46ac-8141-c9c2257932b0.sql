-- Add missing description column to modul8_organizers table
ALTER TABLE public.modul8_organizers 
ADD COLUMN description text;