-- Add services column to match TypeScript interfaces
ALTER TABLE public.modul8_service_providers 
ADD COLUMN services text[] DEFAULT ARRAY[]::text[];

-- Create GIN index for services array for better performance
CREATE INDEX IF NOT EXISTS idx_modul8_service_providers_services 
ON public.modul8_service_providers USING GIN(services);

-- Update existing records to sync services_offered to services
UPDATE public.modul8_service_providers 
SET services = COALESCE(services_offered, ARRAY[]::text[])
WHERE services IS NULL;