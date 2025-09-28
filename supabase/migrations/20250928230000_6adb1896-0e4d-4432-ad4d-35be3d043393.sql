-- Create iotas table to track user metrics
CREATE TABLE public.iotas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES profiles(user_id) ON DELETE CASCADE,
  rel8_contacts INTEGER NOT NULL DEFAULT 0,
  cultiv8_posts INTEGER NOT NULL DEFAULT 0,
  eco8_communities INTEGER NOT NULL DEFAULT 0,
  total_network_value INTEGER GENERATED ALWAYS AS (rel8_contacts + cultiv8_posts + eco8_communities) STORED,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable RLS on iotas table
ALTER TABLE public.iotas ENABLE ROW LEVEL SECURITY;

-- Add network_value column to profiles table 
ALTER TABLE public.profiles ADD COLUMN network_value INTEGER NOT NULL DEFAULT 0;

-- Create RLS policies for iotas table
CREATE POLICY "Users can view their own iotas" 
ON public.iotas 
FOR SELECT 
USING (user_id = auth.uid());

CREATE POLICY "Users can update their own iotas" 
ON public.iotas 
FOR UPDATE 
USING (user_id = auth.uid());

CREATE POLICY "System can insert iotas" 
ON public.iotas 
FOR INSERT 
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can view all iotas" 
ON public.iotas 
FOR ALL 
USING (has_role(auth.uid(), 'ADMIN'));

-- Create function to update network value
CREATE OR REPLACE FUNCTION public.update_network_value(p_user_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Update network_value in profiles from iotas total
  UPDATE public.profiles 
  SET network_value = COALESCE((
    SELECT total_network_value 
    FROM public.iotas 
    WHERE user_id = p_user_id
  ), 0)
  WHERE user_id = p_user_id;
END;
$$;

-- Create trigger to automatically update network_value when iotas change
CREATE OR REPLACE FUNCTION public.sync_network_value()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  -- Update the profiles table network_value when iotas change
  UPDATE public.profiles 
  SET network_value = NEW.total_network_value
  WHERE user_id = NEW.user_id;
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER sync_network_value_trigger
  AFTER INSERT OR UPDATE ON public.iotas
  FOR EACH ROW
  EXECUTE FUNCTION public.sync_network_value();

-- Create function to get or create iotas record
CREATE OR REPLACE FUNCTION public.get_or_create_iotas(p_user_id UUID)
RETURNS public.iotas
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result public.iotas;
BEGIN
  -- Try to get existing record
  SELECT * INTO result FROM public.iotas WHERE user_id = p_user_id;
  
  -- If not found, create new record
  IF NOT FOUND THEN
    INSERT INTO public.iotas (user_id) VALUES (p_user_id) RETURNING * INTO result;
  END IF;
  
  RETURN result;
END;
$$;

-- Create function to increment specific metric
CREATE OR REPLACE FUNCTION public.increment_iota_metric(
  p_user_id UUID, 
  p_metric_type TEXT, 
  p_increment INTEGER DEFAULT 1
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Ensure iotas record exists
  PERFORM public.get_or_create_iotas(p_user_id);
  
  -- Update the specific metric
  CASE p_metric_type
    WHEN 'rel8_contacts' THEN
      UPDATE public.iotas 
      SET rel8_contacts = rel8_contacts + p_increment, updated_at = now()
      WHERE user_id = p_user_id;
    WHEN 'cultiv8_posts' THEN
      UPDATE public.iotas 
      SET cultiv8_posts = cultiv8_posts + p_increment, updated_at = now()
      WHERE user_id = p_user_id;
    WHEN 'eco8_communities' THEN
      UPDATE public.iotas 
      SET eco8_communities = eco8_communities + p_increment, updated_at = now()
      WHERE user_id = p_user_id;
    ELSE
      RAISE EXCEPTION 'Invalid metric type: %', p_metric_type;
  END CASE;
  
  RETURN TRUE;
END;
$$;