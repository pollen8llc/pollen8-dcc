-- Create path instances table to track each "run" of a development path
CREATE TABLE public.rms_actv8_path_instances (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  actv8_contact_id UUID NOT NULL REFERENCES public.rms_actv8_contacts(id) ON DELETE CASCADE,
  path_id TEXT NOT NULL,
  started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  ended_at TIMESTAMP WITH TIME ZONE,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add current_path_instance_id to actv8_contacts
ALTER TABLE public.rms_actv8_contacts 
ADD COLUMN current_path_instance_id UUID REFERENCES public.rms_actv8_path_instances(id);

-- Add path_instance_id to outreach table
ALTER TABLE public.rms_outreach 
ADD COLUMN path_instance_id UUID REFERENCES public.rms_actv8_path_instances(id);

-- Add path_instance_id to step instances
ALTER TABLE public.rms_actv8_step_instances 
ADD COLUMN path_instance_id UUID REFERENCES public.rms_actv8_path_instances(id);

-- Enable RLS on path instances
ALTER TABLE public.rms_actv8_path_instances ENABLE ROW LEVEL SECURITY;

-- RLS policies for path instances
CREATE POLICY "Users can view their own path instances"
ON public.rms_actv8_path_instances
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own path instances"
ON public.rms_actv8_path_instances
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own path instances"
ON public.rms_actv8_path_instances
FOR UPDATE
USING (auth.uid() = user_id);

-- Create index for efficient lookups
CREATE INDEX idx_path_instances_actv8_contact ON public.rms_actv8_path_instances(actv8_contact_id);
CREATE INDEX idx_path_instances_status ON public.rms_actv8_path_instances(status);
CREATE INDEX idx_outreach_path_instance ON public.rms_outreach(path_instance_id);
CREATE INDEX idx_step_instances_path_instance ON public.rms_actv8_step_instances(path_instance_id);