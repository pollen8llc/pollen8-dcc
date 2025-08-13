-- Update the get_rel8t_metrics function to fix column issues and use correct tables
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
    RAISE WARNING 'Error getting contact count: %', SQLERRM;
    total_contacts := 0;
  END;
  
  -- Get contact groups count (removed is_active filter since column doesn't exist)
  BEGIN
    SELECT COUNT(*) INTO active_triggers 
    FROM public.rms_contact_groups;
  EXCEPTION WHEN OTHERS THEN
    RAISE WARNING 'Error getting contact groups count: %', SQLERRM;
    active_triggers := 0;
  END;
  
  -- Get emails sent count from rms_email_notifications
  BEGIN
    SELECT COUNT(*) INTO emails_sent 
    FROM public.rms_email_notifications 
    WHERE status = 'sent';
  EXCEPTION WHEN OTHERS THEN
    RAISE WARNING 'Error getting emails sent count: %', SQLERRM;
    emails_sent := 0;
  END;
  
  -- Get pending emails count from rms_email_notifications  
  BEGIN
    SELECT COUNT(*) INTO pending_emails 
    FROM public.rms_email_notifications 
    WHERE status = 'pending';
  EXCEPTION WHEN OTHERS THEN
    RAISE WARNING 'Error getting pending emails count: %', SQLERRM;
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