-- Fix remaining function search_path security issue
CREATE OR REPLACE FUNCTION public.process_community_submission()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    community_record RECORD;
    profile_record RECORD;
    submission_data JSONB;
    community_id UUID;
    error_msg TEXT;
BEGIN
    -- Set status to processing
    UPDATE public.community_data_distribution
    SET status = 'processing'
    WHERE id = NEW.id;

    -- Extract submission data
    submission_data := NEW.submission_data;

    -- Ensure submitter has a profile
    SELECT * INTO profile_record
    FROM public.profiles
    WHERE user_id = NEW.submitter_id;

    IF NOT FOUND THEN
        -- Create a basic profile if it doesn't exist
        INSERT INTO public.profiles (user_id, full_name, email)
        VALUES (NEW.submitter_id, 'Community Creator', 'creator@example.com');
    END IF;

    -- Create the community
    INSERT INTO public.communities (
        name,
        description,
        owner_id
    ) VALUES (
        submission_data->>'name',
        submission_data->>'description',
        NEW.submitter_id
    ) RETURNING * INTO community_record;

    community_id := community_record.id;

    -- Update submission status to completed
    UPDATE public.community_data_distribution
    SET 
        status = 'completed',
        community_id = community_id,
        processed_at = NOW()
    WHERE id = NEW.id;

    RETURN NEW;

EXCEPTION
    WHEN OTHERS THEN
        -- Log the error
        error_msg := SQLERRM;
        
        -- Update submission status to failed
        UPDATE public.community_data_distribution
        SET 
            status = 'failed',
            error_message = error_msg,
            processed_at = NOW()
        WHERE id = NEW.id;

        RETURN NEW;
END;
$$;