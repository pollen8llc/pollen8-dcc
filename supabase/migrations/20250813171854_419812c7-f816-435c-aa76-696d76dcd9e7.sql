-- Create a function to safely get REL8T contact metrics
CREATE OR REPLACE FUNCTION public.get_rel8t_metrics()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  total_contacts INTEGER := 0;
  active_triggers INTEGER := 0;
  emails_sent INTEGER := 0;
  pending_emails INTEGER := 0;
BEGIN
  -- Get total contacts count
  BEGIN
    SELECT COUNT(*) INTO total_contacts FROM public.rms_contacts;
  EXCEPTION WHEN OTHERS THEN
    total_contacts := 0;
  END;
  
  -- Get active triggers count (contact groups)
  BEGIN
    SELECT COUNT(*) INTO active_triggers 
    FROM public.rms_contact_groups 
    WHERE is_active = true;
  EXCEPTION WHEN OTHERS THEN
    active_triggers := 0;
  END;
  
  -- Get emails sent count
  BEGIN
    SELECT COUNT(*) INTO emails_sent 
    FROM public.rms_outreach_contacts 
    WHERE status = 'sent';
  EXCEPTION WHEN OTHERS THEN
    emails_sent := 0;
  END;
  
  -- Get pending emails count
  BEGIN
    SELECT COUNT(*) INTO pending_emails 
    FROM public.rms_outreach_contacts 
    WHERE status = 'pending';
  EXCEPTION WHEN OTHERS THEN
    pending_emails := 0;
  END;
  
  RETURN jsonb_build_object(
    'totalContacts', total_contacts,
    'activeTriggers', active_triggers,
    'emailsSent', emails_sent,
    'pendingEmails', pending_emails
  );
END;
$$;