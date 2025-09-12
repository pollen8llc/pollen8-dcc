-- Create nmn8 (nomin8) related tables

-- Create nominations table
CREATE TABLE public.nmn8_nominations (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    organizer_id UUID NOT NULL,
    contact_id UUID NOT NULL,
    groups JSONB NOT NULL DEFAULT '{}',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create group configurations table
CREATE TABLE public.nmn8_group_configs (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    organizer_id UUID NOT NULL,
    name TEXT NOT NULL,
    color TEXT NOT NULL DEFAULT '#3B82F6',
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create nomin8 profiles table (extended profile data for nominations)
CREATE TABLE public.nmn8_profiles (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    contact_id UUID NOT NULL,
    organizer_id UUID NOT NULL,
    classification TEXT NOT NULL DEFAULT 'Volunteer',
    community_engagement INTEGER NOT NULL DEFAULT 0,
    events_attended INTEGER NOT NULL DEFAULT 0,
    interests TEXT[] DEFAULT '{}',
    last_active TIMESTAMP WITH TIME ZONE DEFAULT now(),
    notes TEXT,
    social_media JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(contact_id, organizer_id)
);

-- Enable Row Level Security
ALTER TABLE public.nmn8_nominations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.nmn8_group_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.nmn8_profiles ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for nominations
CREATE POLICY "Organizers can manage their nominations"
    ON public.nmn8_nominations
    FOR ALL
    USING (organizer_id = auth.uid());

-- Create RLS policies for group configs
CREATE POLICY "Organizers can manage their group configs"
    ON public.nmn8_group_configs
    FOR ALL
    USING (organizer_id = auth.uid());

-- Create RLS policies for profiles
CREATE POLICY "Organizers can manage their nomin8 profiles"
    ON public.nmn8_profiles
    FOR ALL
    USING (organizer_id = auth.uid());

-- Create updated_at triggers
CREATE TRIGGER update_nmn8_nominations_updated_at
    BEFORE UPDATE ON public.nmn8_nominations
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_nmn8_group_configs_updated_at
    BEFORE UPDATE ON public.nmn8_group_configs
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_nmn8_profiles_updated_at
    BEFORE UPDATE ON public.nmn8_profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_nmn8_nominations_organizer_id ON public.nmn8_nominations(organizer_id);
CREATE INDEX idx_nmn8_nominations_contact_id ON public.nmn8_nominations(contact_id);
CREATE INDEX idx_nmn8_group_configs_organizer_id ON public.nmn8_group_configs(organizer_id);
CREATE INDEX idx_nmn8_profiles_organizer_id ON public.nmn8_profiles(organizer_id);
CREATE INDEX idx_nmn8_profiles_contact_id ON public.nmn8_profiles(contact_id);