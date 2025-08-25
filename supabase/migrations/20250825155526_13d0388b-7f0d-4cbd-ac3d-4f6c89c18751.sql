-- Fix the database trigger to prevent multiple community creations
-- This ensures that each submission only creates one community

-- First, let's update the trigger to be more robust
CREATE OR REPLACE FUNCTION public.process_community_submission()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  new_community_id UUID;
  submission_data JSONB;
  error_msg TEXT;
BEGIN
  -- Only process if status is changing to processing and was pending
  IF NEW.status = 'processing' AND OLD.status = 'pending' THEN
    BEGIN
      -- Extract submission data
      submission_data := NEW.submission_data;
      
      -- Validate required fields
      IF submission_data->>'name' IS NULL OR submission_data->>'description' IS NULL THEN
        RAISE EXCEPTION 'Missing required fields: name and description are required';
      END IF;
      
      -- Ensure user has a profile
      INSERT INTO public.profiles (
        id, user_id, email, first_name, last_name, created_at, updated_at
      )
      SELECT 
        NEW.submitter_id, 
        NEW.submitter_id,
        au.email,
        COALESCE(au.raw_user_meta_data->>'first_name', ''),
        COALESCE(au.raw_user_meta_data->>'last_name', ''),
        NOW(),
        NOW()
      FROM auth.users au 
      WHERE au.id = NEW.submitter_id
      ON CONFLICT (id) DO NOTHING;
      
      -- Create the community record
      INSERT INTO public.communities (
        name,
        description,
        type,
        location,
        is_public,
        website,
        target_audience,
        social_media,
        vision,
        format,
        community_size,
        event_frequency,
        communication_platforms,
        owner_id,
        created_at,
        updated_at
      ) VALUES (
        submission_data->>'name',
        submission_data->>'description',
        COALESCE(submission_data->>'type', 'tech'),
        COALESCE(submission_data->>'location', 'Remote'),
        COALESCE((submission_data->>'isPublic')::boolean, true),
        submission_data->>'website',
        COALESCE(
          CASE 
            WHEN submission_data->'targetAudience' IS NOT NULL THEN 
              ARRAY(SELECT jsonb_array_elements_text(submission_data->'targetAudience'))
            ELSE ARRAY[]::text[]
          END,
          ARRAY[]::text[]
        ),
        COALESCE(submission_data->'socialMedia', '{}'::jsonb),
        submission_data->>'bio',
        COALESCE(submission_data->>'format', 'hybrid'),
        COALESCE(submission_data->>'community_size', '1-10'),
        COALESCE(submission_data->>'event_frequency', 'monthly'),
        COALESCE(submission_data->'communicationPlatforms', '{}'::jsonb),
        NEW.submitter_id,
        NOW(),
        NOW()
      ) RETURNING id INTO new_community_id;
      
      -- Update submission status to completed
      UPDATE public.community_data_distribution
      SET 
        status = 'completed',
        community_id = new_community_id,
        processed_at = NOW()
      WHERE id = NEW.id;
      
      -- Log successful creation
      PERFORM log_audit_action(
        'community_created_via_distribution',
        NEW.submitter_id,
        NULL,
        jsonb_build_object(
          'community_id', new_community_id,
          'submission_id', NEW.id,
          'community_name', submission_data->>'name'
        )
      );
      
    EXCEPTION WHEN OTHERS THEN
      -- Log the error
      GET STACKED DIAGNOSTICS error_msg = MESSAGE_TEXT;
      
      UPDATE public.community_data_distribution
      SET 
        status = 'failed',
        error_message = error_msg,
        processed_at = NOW()
      WHERE id = NEW.id;
      
      -- Log the failure
      PERFORM log_audit_action(
        'community_creation_failed',
        NEW.submitter_id,
        NULL,
        jsonb_build_object(
          'submission_id', NEW.id,
          'error', error_msg,
          'submission_data', submission_data
        )
      );
    END;
  END IF;
  
  RETURN NEW;
END;
$function$;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS tr_process_community_submission ON public.community_data_distribution;

-- Create new trigger that only fires on status updates (not inserts)
CREATE TRIGGER tr_process_community_submission_update
  AFTER UPDATE OF status ON public.community_data_distribution
  FOR EACH ROW
  EXECUTE FUNCTION public.process_community_submission();

-- Create a simpler trigger for initial processing
CREATE OR REPLACE FUNCTION public.trigger_community_processing()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  -- Set status to processing immediately after insert
  IF NEW.status = 'pending' THEN
    UPDATE public.community_data_distribution
    SET status = 'processing'
    WHERE id = NEW.id;
  END IF;
  
  RETURN NEW;
END;
$function$;

-- Create trigger for initial processing
CREATE TRIGGER tr_trigger_community_processing
  AFTER INSERT ON public.community_data_distribution
  FOR EACH ROW
  EXECUTE FUNCTION public.trigger_community_processing();