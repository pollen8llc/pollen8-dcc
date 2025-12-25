-- Create the rms_actv8_contacts table for managing active relationship development
CREATE TABLE public.rms_actv8_contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  contact_id UUID NOT NULL REFERENCES public.rms_contacts(id) ON DELETE CASCADE,
  
  -- Development Path Fields
  development_path_id TEXT NOT NULL,
  current_step_index INTEGER DEFAULT 0,
  completed_steps TEXT[] DEFAULT ARRAY[]::TEXT[],
  
  -- Strategy/Intention Fields
  intention_id TEXT,
  intention_notes TEXT,
  
  -- Relationship Metadata
  connection_strength TEXT DEFAULT 'thin',
  relationship_type TEXT,
  warmth_level TEXT DEFAULT 'neutral',
  
  -- Status & Timestamps
  status TEXT DEFAULT 'active',
  activated_at TIMESTAMPTZ DEFAULT now(),
  path_started_at TIMESTAMPTZ DEFAULT now(),
  last_touchpoint_at TIMESTAMPTZ,
  target_completion_date DATE,
  
  -- Tracking
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  
  -- Prevent duplicate active entries for same contact per user
  CONSTRAINT unique_active_contact UNIQUE(user_id, contact_id)
);

-- Enable Row Level Security
ALTER TABLE public.rms_actv8_contacts ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own actv8 contacts"
  ON public.rms_actv8_contacts FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own actv8 contacts"
  ON public.rms_actv8_contacts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own actv8 contacts"
  ON public.rms_actv8_contacts FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own actv8 contacts"
  ON public.rms_actv8_contacts FOR DELETE
  USING (auth.uid() = user_id);

-- Indexes for performance
CREATE INDEX idx_actv8_contacts_user_id ON public.rms_actv8_contacts(user_id);
CREATE INDEX idx_actv8_contacts_status ON public.rms_actv8_contacts(user_id, status);
CREATE INDEX idx_actv8_contacts_contact_id ON public.rms_actv8_contacts(contact_id);

-- Trigger for auto-updating updated_at
CREATE TRIGGER update_rms_actv8_contacts_updated_at
  BEFORE UPDATE ON public.rms_actv8_contacts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();