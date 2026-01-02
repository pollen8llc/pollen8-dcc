-- Add tier and ordering columns to rms_actv8_paths
ALTER TABLE public.rms_actv8_paths 
ADD COLUMN IF NOT EXISTS tier INTEGER DEFAULT 1,
ADD COLUMN IF NOT EXISTS tier_order INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS is_required BOOLEAN DEFAULT false;

-- Add path progression tracking to rms_actv8_contacts
ALTER TABLE public.rms_actv8_contacts 
ADD COLUMN IF NOT EXISTS path_tier INTEGER DEFAULT 1,
ADD COLUMN IF NOT EXISTS path_history JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS skipped_paths JSONB DEFAULT '[]'::jsonb;

-- Update existing paths with tier assignments
-- Tier 1: Build Rapport (required foundation)
UPDATE public.rms_actv8_paths 
SET tier = 1, tier_order = 0, is_required = true 
WHERE id = 'build_rapport';

-- Tier 2: Strengthen Bond, Reconnect
UPDATE public.rms_actv8_paths 
SET tier = 2, tier_order = 0 
WHERE id = 'strengthen_bond';

UPDATE public.rms_actv8_paths 
SET tier = 2, tier_order = 1 
WHERE id = 'reconnect';

-- Tier 3: Professional Growth, Event Networking
UPDATE public.rms_actv8_paths 
SET tier = 3, tier_order = 0 
WHERE id = 'professional_growth';

UPDATE public.rms_actv8_paths 
SET tier = 3, tier_order = 1 
WHERE id = 'event_networking';

-- Tier 4: New Connection and others
UPDATE public.rms_actv8_paths 
SET tier = 4, tier_order = 0 
WHERE id = 'new_connection';

-- Set default tier 4 for any unassigned paths
UPDATE public.rms_actv8_paths 
SET tier = 4, tier_order = 99 
WHERE tier IS NULL OR tier = 1 AND id != 'build_rapport';

-- Create index for efficient tier queries
CREATE INDEX IF NOT EXISTS idx_actv8_paths_tier ON public.rms_actv8_paths(tier, tier_order);
CREATE INDEX IF NOT EXISTS idx_actv8_contacts_path_tier ON public.rms_actv8_contacts(path_tier);