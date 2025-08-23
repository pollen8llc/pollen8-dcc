-- Create the process_community_submission function
-- This function processes community submissions from the community_data_distribution table

CREATE OR REPLACE FUNCTION public.process_community_submission()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
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
        type,
        location,
        is_public,
        website,
        target_audience,
        social_media,
        vision,
        format,
        communication_platforms,
        owner_id,
        member_count
    ) VALUES (
        submission_data->>'name',
        submission_data->>'description',
        submission_data->>'type',
        submission_data->>'location',
        COALESCE((submission_data->>'isPublic')::boolean, true),
        submission_data->>'website',
        CASE 
            WHEN submission_data->'targetAudience' IS NOT NULL 
            THEN ARRAY(SELECT jsonb_array_elements_text(submission_data->'targetAudience'))
            ELSE NULL
        END,
        submission_data->'socialMedia',
        submission_data->>'bio',
        submission_data->>'format',
        submission_data->'communicationPlatforms',
        NEW.submitter_id,
        '1'  -- Start with 1 member (the creator)
    ) RETURNING * INTO community_record;

    community_id := community_record.id;

    -- Update submission status to completed
    UPDATE public.community_data_distribution
    SET 
        status = 'completed',
        community_id = community_id,
        processed_at = NOW()
    WHERE id = NEW.id;

    -- Log the community creation
    INSERT INTO public.audit_logs (
        action,
        performed_by,
        details
    ) VALUES (
        'community_created',
        NEW.submitter_id,
        jsonb_build_object(
            'community_id', community_id,
            'community_name', submission_data->>'name',
            'submission_id', NEW.id
        )
    );

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

        -- Log the error
        INSERT INTO public.audit_logs (
            action,
            performed_by,
            details
        ) VALUES (
            'community_creation_failed',
            NEW.submitter_id,
            jsonb_build_object(
                'submission_id', NEW.id,
                'error', error_msg,
                'submission_data', submission_data
            )
        );

        RETURN NEW;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.process_community_submission() TO authenticated;
