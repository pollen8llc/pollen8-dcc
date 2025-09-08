-- Create nmn8 table for organizer nominations
CREATE TABLE public.nmn8 (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  organizer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  contact_id UUID NOT NULL REFERENCES public.rms_contacts(id) ON DELETE CASCADE,
  groups JSONB NOT NULL DEFAULT '{}',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  -- Ensure unique nominations per organizer-contact pair
  UNIQUE(organizer_id, contact_id)
);

-- Enable RLS
ALTER TABLE public.nmn8 ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Organizers can manage their own nominations" 
ON public.nmn8 
FOR ALL 
USING (organizer_id = auth.uid());

-- Create updated_at trigger
CREATE TRIGGER update_nmn8_updated_at
  BEFORE UPDATE ON public.nmn8
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Update record_invite_use function to properly set invited_by
CREATE OR REPLACE FUNCTION public.record_invite_use(invite_code text, user_id uuid)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
DECLARE
  invite_record public.invites%ROWTYPE;
BEGIN
  -- Get the invite
  SELECT * INTO invite_record
  FROM public.invites
  WHERE code = invite_code
    AND is_active = true
    AND (expires_at IS NULL OR expires_at > now())
    AND (max_uses IS NULL OR used_count < max_uses);
  
  IF invite_record IS NULL THEN
    RAISE EXCEPTION 'Invalid or expired invite code';
  END IF;
  
  -- Update the usage count
  UPDATE public.invites
  SET used_count = used_count + 1
  WHERE id = invite_record.id;
  
  -- Create connection record
  INSERT INTO public.user_connections (
    inviter_id, invitee_id, invite_id, community_id
  )
  VALUES (
    invite_record.creator_id, user_id, invite_record.id, invite_record.community_id
  )
  ON CONFLICT (inviter_id, invitee_id) DO NOTHING;
  
  -- Update user profile to record who invited them (the creator, not the invitee)
  UPDATE public.profiles
  SET invited_by = invite_record.creator_id
  WHERE id = user_id;
  
  RETURN invite_record.id;
END;
$function$;