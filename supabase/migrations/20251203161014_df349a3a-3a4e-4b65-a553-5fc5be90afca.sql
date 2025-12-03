-- Create google_integrations table for storing OAuth tokens
CREATE TABLE public.google_integrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  access_token TEXT NOT NULL,
  refresh_token TEXT,
  token_expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  google_user_id TEXT,
  google_email TEXT,
  connected_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  last_sync_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE public.google_integrations ENABLE ROW LEVEL SECURITY;

-- RLS policies for google_integrations
CREATE POLICY "Users can view own google integration" 
  ON public.google_integrations FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own google integration" 
  ON public.google_integrations FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own google integration" 
  ON public.google_integrations FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own google integration" 
  ON public.google_integrations FOR DELETE 
  USING (auth.uid() = user_id);

-- Create google_import_history table for tracking imports
CREATE TABLE public.google_import_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  integration_id UUID REFERENCES public.google_integrations(id) ON DELETE CASCADE,
  contacts_imported INTEGER DEFAULT 0,
  duplicates_found INTEGER DEFAULT 0,
  errors_count INTEGER DEFAULT 0,
  import_status TEXT DEFAULT 'pending',
  import_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.google_import_history ENABLE ROW LEVEL SECURITY;

-- RLS policies for google_import_history
CREATE POLICY "Users can view own google import history" 
  ON public.google_import_history FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own google import history" 
  ON public.google_import_history FOR INSERT 
  WITH CHECK (auth.uid() = user_id);