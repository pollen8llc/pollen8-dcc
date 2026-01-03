-- Create table for tracking individual step instances with unique IDs
CREATE TABLE public.rms_actv8_step_instances (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actv8_contact_id UUID NOT NULL REFERENCES public.rms_actv8_contacts(id) ON DELETE CASCADE,
  step_id TEXT NOT NULL,
  step_index INTEGER NOT NULL,
  path_id UUID NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  outreach_id UUID REFERENCES public.rms_outreach(id) ON DELETE SET NULL,
  days_to_complete INTEGER,
  interaction_outcome TEXT,
  rapport_progress TEXT,
  notes TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  user_id UUID NOT NULL,
  UNIQUE(actv8_contact_id, step_id, path_id)
);

-- Enable RLS
ALTER TABLE public.rms_actv8_step_instances ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Users can view their own step instances"
  ON public.rms_actv8_step_instances FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own step instances"
  ON public.rms_actv8_step_instances FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own step instances"
  ON public.rms_actv8_step_instances FOR UPDATE
  USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own step instances"
  ON public.rms_actv8_step_instances FOR DELETE
  USING (user_id = auth.uid());

-- Index for faster lookups
CREATE INDEX idx_step_instances_actv8_contact ON public.rms_actv8_step_instances(actv8_contact_id);
CREATE INDEX idx_step_instances_path ON public.rms_actv8_step_instances(path_id);
CREATE INDEX idx_step_instances_status ON public.rms_actv8_step_instances(status);