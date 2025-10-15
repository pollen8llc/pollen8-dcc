-- Create trigger to automatically track interests in lexicon when profiles are updated
CREATE OR REPLACE FUNCTION public.track_profile_interests()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
    interest_text TEXT;
BEGIN
    -- If interests array has changed
    IF (TG_OP = 'INSERT' OR (TG_OP = 'UPDATE' AND OLD.interests IS DISTINCT FROM NEW.interests)) THEN
        -- Track each interest in the lexicon
        IF NEW.interests IS NOT NULL AND array_length(NEW.interests, 1) > 0 THEN
            FOREACH interest_text IN ARRAY NEW.interests
            LOOP
                PERFORM public.update_lexicon_usage(
                    interest_text,
                    'interest',
                    'profiles',
                    NEW.id,
                    'interests',
                    NEW.user_id
                );
            END LOOP;
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$;

-- Create trigger on profiles table
DROP TRIGGER IF EXISTS track_interests_on_profile_update ON public.profiles;
CREATE TRIGGER track_interests_on_profile_update
    AFTER INSERT OR UPDATE OF interests ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.track_profile_interests();

-- Add similar tracking for skills
CREATE OR REPLACE FUNCTION public.track_profile_skills()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
    skill_text TEXT;
BEGIN
    -- If skills array has changed
    IF (TG_OP = 'INSERT' OR (TG_OP = 'UPDATE' AND OLD.skills IS DISTINCT FROM NEW.skills)) THEN
        -- Track each skill in the lexicon
        IF NEW.skills IS NOT NULL AND array_length(NEW.skills, 1) > 0 THEN
            FOREACH skill_text IN ARRAY NEW.skills
            LOOP
                PERFORM public.update_lexicon_usage(
                    skill_text,
                    'skill',
                    'profiles',
                    NEW.id,
                    'skills',
                    NEW.user_id
                );
            END LOOP;
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$;

-- Create trigger for skills
DROP TRIGGER IF EXISTS track_skills_on_profile_update ON public.profiles;
CREATE TRIGGER track_skills_on_profile_update
    AFTER INSERT OR UPDATE OF skills ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.track_profile_skills();