-- Update the handle_profile_update trigger function to sync both profile completion fields
CREATE OR REPLACE FUNCTION public.handle_profile_update()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
    NEW.updated_at = NOW();
    
    -- Update profile completeness based on platform requirements
    NEW.is_profile_complete = (
        NEW.first_name IS NOT NULL AND 
        NEW.last_name IS NOT NULL AND 
        NEW.bio IS NOT NULL AND 
        length(trim(NEW.bio)) > 10 AND
        NEW.location IS NOT NULL
    );
    
    -- Sync profile_complete with is_profile_complete
    NEW.profile_complete = NEW.is_profile_complete;
    
    -- Update full_name
    NEW.full_name = trim(concat(NEW.first_name, ' ', NEW.last_name));
    
    -- Cache the user's highest role
    IF NEW.role IS NULL THEN
        NEW.role = public.get_highest_role(NEW.user_id);
    END IF;
    
    RETURN NEW;
END;
$function$;

-- Create trigger for profiles table to ensure profile completion is always computed
DROP TRIGGER IF EXISTS profiles_handle_profile_update ON public.profiles;
CREATE TRIGGER profiles_handle_profile_update
    BEFORE INSERT OR UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_profile_update();

-- Backfill existing rows to sync is_profile_complete and profile_complete
UPDATE public.profiles 
SET 
    is_profile_complete = (
        first_name IS NOT NULL AND 
        last_name IS NOT NULL AND 
        bio IS NOT NULL AND 
        length(trim(bio)) > 10 AND
        location IS NOT NULL
    ),
    profile_complete = (
        first_name IS NOT NULL AND 
        last_name IS NOT NULL AND 
        bio IS NOT NULL AND 
        length(trim(bio)) > 10 AND
        location IS NOT NULL
    ),
    updated_at = NOW()
WHERE is_profile_complete IS DISTINCT FROM profile_complete 
   OR is_profile_complete IS NULL 
   OR profile_complete IS NULL;

-- Drop the duplicate create_community function (keep the one with more parameters)
DROP FUNCTION IF EXISTS public.create_community(text, text, text, text, text, text, boolean, text[], text[]);