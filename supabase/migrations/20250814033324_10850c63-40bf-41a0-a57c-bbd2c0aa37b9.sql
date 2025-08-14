-- Create tables for Luma integration
CREATE TABLE public.luma_integrations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  access_token TEXT NOT NULL,
  refresh_token TEXT,
  token_expires_at TIMESTAMP WITH TIME ZONE,
  luma_user_id TEXT,
  luma_username TEXT,
  connected_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  last_sync_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Create table for Luma import history
CREATE TABLE public.luma_import_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  integration_id UUID NOT NULL REFERENCES public.luma_integrations(id) ON DELETE CASCADE,
  event_id TEXT NOT NULL,
  event_name TEXT NOT NULL,
  contacts_imported INTEGER NOT NULL DEFAULT 0,
  duplicates_found INTEGER NOT NULL DEFAULT 0,
  errors_count INTEGER NOT NULL DEFAULT 0,
  import_status TEXT NOT NULL DEFAULT 'completed',
  import_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Luma-specific fields to contacts
ALTER TABLE public.rms_contacts 
ADD COLUMN luma_event_id TEXT,
ADD COLUMN luma_attendee_id TEXT,
ADD COLUMN luma_import_date TIMESTAMP WITH TIME ZONE;

-- Enable RLS
ALTER TABLE public.luma_integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.luma_import_history ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for luma_integrations
CREATE POLICY "Users can manage their own Luma integrations"
ON public.luma_integrations
FOR ALL
USING (auth.uid() = user_id);

-- Create RLS policies for luma_import_history  
CREATE POLICY "Users can view their own import history"
ON public.luma_import_history
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own import history"
ON public.luma_import_history
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Create updated_at trigger for luma_integrations
CREATE TRIGGER update_luma_integrations_updated_at
  BEFORE UPDATE ON public.luma_integrations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for performance
CREATE INDEX idx_luma_integrations_user_id ON public.luma_integrations(user_id);
CREATE INDEX idx_luma_import_history_user_id ON public.luma_import_history(user_id);
CREATE INDEX idx_rms_contacts_luma_event ON public.rms_contacts(luma_event_id) WHERE luma_event_id IS NOT NULL;