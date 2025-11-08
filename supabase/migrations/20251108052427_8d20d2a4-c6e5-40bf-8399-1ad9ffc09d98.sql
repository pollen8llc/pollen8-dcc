-- Create invites table
CREATE TABLE public.invites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  code TEXT NOT NULL UNIQUE,
  link_id TEXT NOT NULL UNIQUE,
  max_uses INTEGER,
  used_count INTEGER NOT NULL DEFAULT 0,
  expires_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add indexes for performance
CREATE INDEX idx_invites_creator_id ON public.invites(creator_id);
CREATE INDEX idx_invites_code ON public.invites(code) WHERE is_active = true;
CREATE INDEX idx_invites_link_id ON public.invites(link_id) WHERE is_active = true;

-- Enable RLS
ALTER TABLE public.invites ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can manage their own invites"
ON public.invites
FOR ALL
USING (creator_id = auth.uid());

CREATE POLICY "Anyone can view active invites"
ON public.invites
FOR SELECT
USING (is_active = true);

-- Function to generate unique invite codes
CREATE OR REPLACE FUNCTION public.generate_unique_invite_code()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  code TEXT;
  code_exists BOOLEAN;
BEGIN
  LOOP
    code := upper(substring(md5(random()::text) from 1 for 8));
    SELECT EXISTS(SELECT 1 FROM public.invites WHERE code = code) INTO code_exists;
    EXIT WHEN NOT code_exists;
  END LOOP;
  RETURN code;
END;
$$;

-- Function to use invite link and create contact
CREATE OR REPLACE FUNCTION public.use_invite_link(
  p_invite_code TEXT,
  p_visitor_name TEXT,
  p_visitor_email TEXT,
  p_visitor_phone TEXT DEFAULT NULL,
  p_visitor_tags TEXT[] DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_invite_record public.invites;
  v_contact_id UUID;
  v_category_id UUID;
BEGIN
  -- Get and validate invite
  SELECT * INTO v_invite_record
  FROM public.invites
  WHERE code = p_invite_code
    AND is_active = true
    AND (expires_at IS NULL OR expires_at > now())
    AND (max_uses IS NULL OR used_count < max_uses);
  
  IF v_invite_record IS NULL THEN
    RAISE EXCEPTION 'Invalid or expired invite code';
  END IF;
  
  -- Get or create ORGANIC category for this user
  SELECT id INTO v_category_id
  FROM rms_contact_categories
  WHERE user_id = v_invite_record.creator_id
    AND name = 'ORGANIC';
  
  IF v_category_id IS NULL THEN
    INSERT INTO rms_contact_categories (user_id, name, description, color)
    VALUES (v_invite_record.creator_id, 'ORGANIC', 'Contacts from invite links', '#10b981')
    RETURNING id INTO v_category_id;
  END IF;
  
  -- Create contact in creator's rms_contacts
  INSERT INTO rms_contacts (
    user_id,
    name,
    email,
    phone,
    tags,
    category_id,
    source
  ) VALUES (
    v_invite_record.creator_id,
    p_visitor_name,
    p_visitor_email,
    p_visitor_phone,
    p_visitor_tags,
    v_category_id,
    'invite_link'
  )
  RETURNING id INTO v_contact_id;
  
  -- Increment invite usage count
  UPDATE public.invites
  SET used_count = used_count + 1,
      updated_at = now()
  WHERE id = v_invite_record.id;
  
  -- Increment rel8_contacts iota
  PERFORM public.increment_iota_metric(v_invite_record.creator_id, 'rel8_contacts', 1);
  
  RETURN v_contact_id;
END;
$$;

-- Trigger to update updated_at
CREATE TRIGGER update_invites_updated_at
BEFORE UPDATE ON public.invites
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();