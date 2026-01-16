-- Add relationship_level column to store the explicit level (1-4) from assessment
ALTER TABLE public.rms_actv8_contacts 
ADD COLUMN IF NOT EXISTS relationship_level INTEGER DEFAULT 1;

-- Add a comment for documentation
COMMENT ON COLUMN public.rms_actv8_contacts.relationship_level 
IS 'Relationship level (1-4) selected during assessment: 1=Just Met, 2=Building Rapport, 3=Established, 4=Close Bond';