-- Add module completion columns to profiles table
ALTER TABLE public.profiles 
ADD COLUMN rel8_complete boolean DEFAULT false,
ADD COLUMN eco8_complete boolean DEFAULT false,
ADD COLUMN modul8_complete boolean DEFAULT false,
ADD COLUMN labr8_complete boolean DEFAULT false;