-- Fix use_invite_link function to remove non-existent description column
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
    -- FIXED: Removed description column that doesn't exist in schema
    INSERT INTO rms_contact_categories (user_id, name, color)
    VALUES (v_invite_record.creator_id, 'ORGANIC', '#10b981')
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