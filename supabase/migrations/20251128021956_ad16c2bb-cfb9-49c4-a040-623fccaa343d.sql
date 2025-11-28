-- Add invited_by column to rms_contacts table for explicit invite lineage tracking
ALTER TABLE public.rms_contacts 
ADD COLUMN invited_by uuid REFERENCES auth.users(id);

-- Update use_invite_link function to set invited_by and create notification
CREATE OR REPLACE FUNCTION public.use_invite_link(
  p_invite_code text,
  p_visitor_name text,
  p_visitor_email text,
  p_visitor_phone text DEFAULT NULL::text,
  p_visitor_tags text[] DEFAULT NULL::text[]
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
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
    INSERT INTO rms_contact_categories (user_id, name, color)
    VALUES (v_invite_record.creator_id, 'ORGANIC', '#10b981')
    RETURNING id INTO v_category_id;
  END IF;
  
  -- Create contact in creator's rms_contacts with invited_by tracking
  INSERT INTO rms_contacts (
    user_id,
    name,
    email,
    phone,
    tags,
    category_id,
    source,
    invited_by
  ) VALUES (
    v_invite_record.creator_id,
    p_visitor_name,
    p_visitor_email,
    p_visitor_phone,
    p_visitor_tags,
    v_category_id,
    'invite_link',
    v_invite_record.creator_id
  )
  RETURNING id INTO v_contact_id;
  
  -- Create notification for invite creator
  INSERT INTO cross_platform_notifications (
    user_id,
    notification_type,
    title,
    message,
    metadata
  ) VALUES (
    v_invite_record.creator_id,
    'invite_contact',
    'New Contact from Invite Link',
    p_visitor_name || ' submitted their info via your invite link',
    jsonb_build_object(
      'contact_id', v_contact_id,
      'contact_name', p_visitor_name,
      'contact_email', p_visitor_email,
      'invite_code', p_invite_code,
      'invite_id', v_invite_record.id
    )
  );
  
  -- Increment invite usage count
  UPDATE public.invites
  SET used_count = used_count + 1,
      updated_at = now()
  WHERE id = v_invite_record.id;
  
  -- Increment rel8_contacts iota
  PERFORM public.increment_iota_metric(v_invite_record.creator_id, 'rel8_contacts', 1);
  
  RETURN v_contact_id;
END;
$function$;