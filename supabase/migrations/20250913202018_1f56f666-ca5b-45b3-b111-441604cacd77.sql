-- Add missing columns to modul8_service_providers to align with app code
ALTER TABLE public.modul8_service_providers
  ADD COLUMN IF NOT EXISTS tagline text,
  ADD COLUMN IF NOT EXISTS tags text[] DEFAULT ARRAY[]::text[],
  ADD COLUMN IF NOT EXISTS pricing_range jsonb DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS domain_specializations integer[] DEFAULT ARRAY[]::integer[];

-- Create GIN index for efficient domain specialization filtering
CREATE INDEX IF NOT EXISTS idx_msp_domain_specializations 
  ON public.modul8_service_providers USING GIN (domain_specializations);

-- Optional: index on tags if used later
CREATE INDEX IF NOT EXISTS idx_msp_tags 
  ON public.modul8_service_providers USING GIN (tags);

-- Ensure updated_at is maintained automatically
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'trg_msp_updated_at'
  ) THEN
    CREATE TRIGGER trg_msp_updated_at
    BEFORE UPDATE ON public.modul8_service_providers
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();
  END IF;
END $$;