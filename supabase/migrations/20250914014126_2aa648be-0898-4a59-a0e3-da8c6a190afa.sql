-- Create locations table for standardized location data
CREATE TABLE public.locations (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('country', 'state', 'city', 'region', 'remote', 'international')),
    parent_location_id UUID REFERENCES public.locations(id),
    latitude NUMERIC,
    longitude NUMERIC,
    country_code TEXT,
    state_code TEXT,
    city_name TEXT,
    formatted_address TEXT NOT NULL,
    aliases TEXT[] DEFAULT ARRAY[]::TEXT[],
    source TEXT DEFAULT 'manual',
    is_active BOOLEAN DEFAULT true,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE(name, type, parent_location_id)
);

-- Enable RLS
ALTER TABLE public.locations ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Anyone can view active locations" ON public.locations
    FOR SELECT USING (is_active = true);

CREATE POLICY "Authenticated users can create locations" ON public.locations
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can manage locations" ON public.locations
    FOR ALL USING (has_role(auth.uid(), 'ADMIN'));

-- Add trigger for updated_at
CREATE TRIGGER update_locations_updated_at
    BEFORE UPDATE ON public.locations
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for performance
CREATE INDEX idx_locations_type ON public.locations(type);
CREATE INDEX idx_locations_parent ON public.locations(parent_location_id);
CREATE INDEX idx_locations_country ON public.locations(country_code);
CREATE INDEX idx_locations_name_search ON public.locations USING gin(to_tsvector('english', name));

-- Create function to populate US states from US Atlas data
CREATE OR REPLACE FUNCTION public.populate_us_states_from_atlas()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    usa_id UUID;
    state_count INTEGER := 0;
BEGIN
    -- Create USA country entry
    INSERT INTO public.locations (name, type, formatted_address, country_code, source)
    VALUES ('United States', 'country', 'United States', 'US', 'us_atlas')
    ON CONFLICT (name, type, parent_location_id) DO NOTHING
    RETURNING id INTO usa_id;
    
    IF usa_id IS NULL THEN
        SELECT id INTO usa_id FROM public.locations 
        WHERE name = 'United States' AND type = 'country';
    END IF;
    
    -- Insert US States
    INSERT INTO public.locations (name, type, parent_location_id, formatted_address, country_code, state_code, source)
    VALUES 
    ('Alabama', 'state', usa_id, 'Alabama, United States', 'US', 'AL', 'us_atlas'),
    ('Alaska', 'state', usa_id, 'Alaska, United States', 'US', 'AK', 'us_atlas'),
    ('Arizona', 'state', usa_id, 'Arizona, United States', 'US', 'AZ', 'us_atlas'),
    ('Arkansas', 'state', usa_id, 'Arkansas, United States', 'US', 'AR', 'us_atlas'),
    ('California', 'state', usa_id, 'California, United States', 'US', 'CA', 'us_atlas'),
    ('Colorado', 'state', usa_id, 'Colorado, United States', 'US', 'CO', 'us_atlas'),
    ('Connecticut', 'state', usa_id, 'Connecticut, United States', 'US', 'CT', 'us_atlas'),
    ('Delaware', 'state', usa_id, 'Delaware, United States', 'US', 'DE', 'us_atlas'),
    ('Florida', 'state', usa_id, 'Florida, United States', 'US', 'FL', 'us_atlas'),
    ('Georgia', 'state', usa_id, 'Georgia, United States', 'US', 'GA', 'us_atlas'),
    ('Hawaii', 'state', usa_id, 'Hawaii, United States', 'US', 'HI', 'us_atlas'),
    ('Idaho', 'state', usa_id, 'Idaho, United States', 'US', 'ID', 'us_atlas'),
    ('Illinois', 'state', usa_id, 'Illinois, United States', 'US', 'IL', 'us_atlas'),
    ('Indiana', 'state', usa_id, 'Indiana, United States', 'US', 'IN', 'us_atlas'),
    ('Iowa', 'state', usa_id, 'Iowa, United States', 'US', 'IA', 'us_atlas'),
    ('Kansas', 'state', usa_id, 'Kansas, United States', 'US', 'KS', 'us_atlas'),
    ('Kentucky', 'state', usa_id, 'Kentucky, United States', 'US', 'KY', 'us_atlas'),
    ('Louisiana', 'state', usa_id, 'Louisiana, United States', 'US', 'LA', 'us_atlas'),
    ('Maine', 'state', usa_id, 'Maine, United States', 'US', 'ME', 'us_atlas'),
    ('Maryland', 'state', usa_id, 'Maryland, United States', 'US', 'MD', 'us_atlas'),
    ('Massachusetts', 'state', usa_id, 'Massachusetts, United States', 'US', 'MA', 'us_atlas'),
    ('Michigan', 'state', usa_id, 'Michigan, United States', 'US', 'MI', 'us_atlas'),
    ('Minnesota', 'state', usa_id, 'Minnesota, United States', 'US', 'MN', 'us_atlas'),
    ('Mississippi', 'state', usa_id, 'Mississippi, United States', 'US', 'MS', 'us_atlas'),
    ('Missouri', 'state', usa_id, 'Missouri, United States', 'US', 'MO', 'us_atlas'),
    ('Montana', 'state', usa_id, 'Montana, United States', 'US', 'MT', 'us_atlas'),
    ('Nebraska', 'state', usa_id, 'Nebraska, United States', 'US', 'NE', 'us_atlas'),
    ('Nevada', 'state', usa_id, 'Nevada, United States', 'US', 'NV', 'us_atlas'),
    ('New Hampshire', 'state', usa_id, 'New Hampshire, United States', 'US', 'NH', 'us_atlas'),
    ('New Jersey', 'state', usa_id, 'New Jersey, United States', 'US', 'NJ', 'us_atlas'),
    ('New Mexico', 'state', usa_id, 'New Mexico, United States', 'US', 'NM', 'us_atlas'),
    ('New York', 'state', usa_id, 'New York, United States', 'US', 'NY', 'us_atlas'),
    ('North Carolina', 'state', usa_id, 'North Carolina, United States', 'US', 'NC', 'us_atlas'),
    ('North Dakota', 'state', usa_id, 'North Dakota, United States', 'US', 'ND', 'us_atlas'),
    ('Ohio', 'state', usa_id, 'Ohio, United States', 'US', 'OH', 'us_atlas'),
    ('Oklahoma', 'state', usa_id, 'Oklahoma, United States', 'US', 'OK', 'us_atlas'),
    ('Oregon', 'state', usa_id, 'Oregon, United States', 'US', 'OR', 'us_atlas'),
    ('Pennsylvania', 'state', usa_id, 'Pennsylvania, United States', 'US', 'PA', 'us_atlas'),
    ('Rhode Island', 'state', usa_id, 'Rhode Island, United States', 'US', 'RI', 'us_atlas'),
    ('South Carolina', 'state', usa_id, 'South Carolina, United States', 'US', 'SC', 'us_atlas'),
    ('South Dakota', 'state', usa_id, 'South Dakota, United States', 'US', 'SD', 'us_atlas'),
    ('Tennessee', 'state', usa_id, 'Tennessee, United States', 'US', 'TN', 'us_atlas'),
    ('Texas', 'state', usa_id, 'Texas, United States', 'US', 'TX', 'us_atlas'),
    ('Utah', 'state', usa_id, 'Utah, United States', 'US', 'UT', 'us_atlas'),
    ('Vermont', 'state', usa_id, 'Vermont, United States', 'US', 'VT', 'us_atlas'),
    ('Virginia', 'state', usa_id, 'Virginia, United States', 'US', 'VA', 'us_atlas'),
    ('Washington', 'state', usa_id, 'Washington, United States', 'US', 'WA', 'us_atlas'),
    ('West Virginia', 'state', usa_id, 'West Virginia, United States', 'US', 'WV', 'us_atlas'),
    ('Wisconsin', 'state', usa_id, 'Wisconsin, United States', 'US', 'WI', 'us_atlas'),
    ('Wyoming', 'state', usa_id, 'Wyoming, United States', 'US', 'WY', 'us_atlas'),
    ('Washington D.C.', 'state', usa_id, 'Washington D.C., United States', 'US', 'DC', 'us_atlas')
    ON CONFLICT (name, type, parent_location_id) DO NOTHING;
    
    -- Add special location options
    INSERT INTO public.locations (name, type, formatted_address, source)
    VALUES 
    ('Remote/Online', 'remote', 'Remote/Online', 'system'),
    ('International', 'international', 'International', 'system')
    ON CONFLICT (name, type, parent_location_id) DO NOTHING;
    
    GET DIAGNOSTICS state_count = ROW_COUNT;
    RETURN state_count;
END;
$$;

-- Function to search locations with autocomplete
CREATE OR REPLACE FUNCTION public.search_locations(
    search_query TEXT,
    location_type TEXT DEFAULT NULL,
    limit_count INTEGER DEFAULT 10
)
RETURNS TABLE(
    id UUID,
    name TEXT,
    type TEXT,
    formatted_address TEXT,
    country_code TEXT,
    state_code TEXT,
    parent_name TEXT
) 
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
    SELECT 
        l.id,
        l.name,
        l.type,
        l.formatted_address,
        l.country_code,
        l.state_code,
        p.name as parent_name
    FROM public.locations l
    LEFT JOIN public.locations p ON p.id = l.parent_location_id
    WHERE 
        l.is_active = true
        AND (location_type IS NULL OR l.type = location_type)
        AND (
            l.name ILIKE '%' || search_query || '%' 
            OR l.formatted_address ILIKE '%' || search_query || '%'
            OR search_query = ANY(l.aliases)
        )
    ORDER BY 
        CASE 
            WHEN l.name ILIKE search_query || '%' THEN 1
            WHEN l.name ILIKE '%' || search_query || '%' THEN 2
            ELSE 3
        END,
        l.name ASC
    LIMIT limit_count;
$$;

-- Update lexicon usage for location tracking
CREATE OR REPLACE FUNCTION public.track_location_usage(location_name TEXT, user_id UUID, source_table TEXT, source_record_id UUID)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    location_lexicon_id UUID;
BEGIN
    -- Track in lexicon system
    SELECT public.update_lexicon_usage(
        location_name, 
        'location', 
        source_table, 
        source_record_id, 
        'location', 
        user_id
    ) INTO location_lexicon_id;
    
    RETURN location_lexicon_id;
END;
$$;