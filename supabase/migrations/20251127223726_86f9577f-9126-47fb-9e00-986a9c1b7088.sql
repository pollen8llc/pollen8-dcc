-- Function to check if a user has completed REL8 setup requirements
CREATE OR REPLACE FUNCTION public.check_rel8_completion(p_user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  has_contact boolean;
  has_category boolean;
  has_trigger boolean;
  has_outreach boolean;
  is_complete boolean;
BEGIN
  -- Check for at least 1 contact
  SELECT EXISTS(SELECT 1 FROM rms_contacts WHERE user_id = p_user_id LIMIT 1) INTO has_contact;
  
  -- Check for at least 1 category
  SELECT EXISTS(SELECT 1 FROM rms_contact_categories WHERE user_id = p_user_id LIMIT 1) INTO has_category;
  
  -- Check for at least 1 trigger
  SELECT EXISTS(SELECT 1 FROM rms_triggers WHERE user_id = p_user_id LIMIT 1) INTO has_trigger;
  
  -- Check for at least 1 outreach task
  SELECT EXISTS(SELECT 1 FROM rms_outreach WHERE user_id = p_user_id LIMIT 1) INTO has_outreach;
  
  is_complete := has_contact AND has_category AND has_trigger AND has_outreach;
  
  -- Update profile if newly complete (only set to true, never back to false)
  IF is_complete THEN
    UPDATE profiles SET rel8_complete = true WHERE user_id = p_user_id AND (rel8_complete IS NULL OR rel8_complete = false);
  END IF;
  
  RETURN is_complete;
END;
$$;

-- Trigger function to check completion after insert
CREATE OR REPLACE FUNCTION public.trigger_check_rel8_completion()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  PERFORM check_rel8_completion(NEW.user_id);
  RETURN NEW;
END;
$$;

-- Add triggers to each table
DROP TRIGGER IF EXISTS check_rel8_on_contact_insert ON rms_contacts;
CREATE TRIGGER check_rel8_on_contact_insert
  AFTER INSERT ON rms_contacts
  FOR EACH ROW EXECUTE FUNCTION trigger_check_rel8_completion();

DROP TRIGGER IF EXISTS check_rel8_on_category_insert ON rms_contact_categories;
CREATE TRIGGER check_rel8_on_category_insert
  AFTER INSERT ON rms_contact_categories
  FOR EACH ROW EXECUTE FUNCTION trigger_check_rel8_completion();

DROP TRIGGER IF EXISTS check_rel8_on_trigger_insert ON rms_triggers;
CREATE TRIGGER check_rel8_on_trigger_insert
  AFTER INSERT ON rms_triggers
  FOR EACH ROW EXECUTE FUNCTION trigger_check_rel8_completion();

DROP TRIGGER IF EXISTS check_rel8_on_outreach_insert ON rms_outreach;
CREATE TRIGGER check_rel8_on_outreach_insert
  AFTER INSERT ON rms_outreach
  FOR EACH ROW EXECUTE FUNCTION trigger_check_rel8_completion();