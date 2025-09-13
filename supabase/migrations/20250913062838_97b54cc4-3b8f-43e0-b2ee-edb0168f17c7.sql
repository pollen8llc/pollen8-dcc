-- Add invited_by column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN invited_by uuid REFERENCES auth.users(id);

-- Create nmn8_settings table for managing groups and categories
CREATE TABLE public.nmn8_settings (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  organizer_id uuid NOT NULL,
  setting_type text NOT NULL CHECK (setting_type IN ('group', 'category')),
  name text NOT NULL,
  description text,
  color text DEFAULT '#3B82F6',
  is_active boolean DEFAULT true,
  sort_order integer DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(organizer_id, setting_type, name)
);

-- Enable RLS on nmn8_settings
ALTER TABLE public.nmn8_settings ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for nmn8_settings
CREATE POLICY "Organizers can manage their settings" 
ON public.nmn8_settings 
FOR ALL 
USING (organizer_id = auth.uid());

-- Add foreign key constraints to nmn8_nominations for better data integrity
ALTER TABLE public.nmn8_nominations 
ADD CONSTRAINT fk_nmn8_nominations_contact 
FOREIGN KEY (contact_id) REFERENCES public.rms_contacts(id) ON DELETE CASCADE;

ALTER TABLE public.nmn8_nominations 
ADD CONSTRAINT fk_nmn8_nominations_organizer 
FOREIGN KEY (organizer_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- Insert default groups for existing users
INSERT INTO public.nmn8_settings (organizer_id, setting_type, name, description, color, sort_order)
SELECT DISTINCT 
  organizer_id,
  'group',
  unnest(ARRAY['Ambassador', 'Volunteer', 'Supporter', 'Moderator']),
  unnest(ARRAY[
    'Community ambassadors and leaders',
    'Active volunteers helping with events',
    'Supporters and advocates',
    'Content and community moderators'
  ]),
  unnest(ARRAY['#10B981', '#3B82F6', '#F59E0B', '#8B5CF6']),
  unnest(ARRAY[1, 2, 3, 4])
FROM public.nmn8_nominations
ON CONFLICT (organizer_id, setting_type, name) DO NOTHING;

-- Create trigger for updated_at on nmn8_settings
CREATE TRIGGER update_nmn8_settings_updated_at
BEFORE UPDATE ON public.nmn8_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();