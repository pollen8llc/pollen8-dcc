-- Add missing columns expected by the app
ALTER TABLE IF EXISTS public.knowledge_tags
ADD COLUMN IF NOT EXISTS count INTEGER NOT NULL DEFAULT 0;

ALTER TABLE IF EXISTS public.rms_contacts
ADD COLUMN IF NOT EXISTS tags TEXT[] NULL,
ADD COLUMN IF NOT EXISTS source TEXT NULL;