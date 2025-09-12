-- Fix RMS tables schema discrepancies for REL8 triggers, categories, and outreach

-- Add missing columns to rms_outreach table
ALTER TABLE public.rms_outreach 
ADD COLUMN IF NOT EXISTS priority text DEFAULT 'medium',
ADD COLUMN IF NOT EXISTS due_date timestamp with time zone,
ADD COLUMN IF NOT EXISTS description text;

-- Backfill existing data
UPDATE public.rms_outreach 
SET 
    due_date = scheduled_at,
    description = message
WHERE due_date IS NULL OR description IS NULL;

-- Create index for better performance on due_date queries
CREATE INDEX IF NOT EXISTS idx_rms_outreach_due_date ON public.rms_outreach(due_date);
CREATE INDEX IF NOT EXISTS idx_rms_outreach_status ON public.rms_outreach(status);
CREATE INDEX IF NOT EXISTS idx_rms_triggers_next_execution ON public.rms_triggers(next_execution_at);

-- Add constraint on priority (without IF NOT EXISTS since it's not supported)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.constraint_column_usage 
        WHERE constraint_name = 'rms_outreach_priority_check' 
        AND table_name = 'rms_outreach'
    ) THEN
        ALTER TABLE public.rms_outreach 
        ADD CONSTRAINT rms_outreach_priority_check 
        CHECK (priority IN ('low', 'medium', 'high'));
    END IF;
END $$;