-- Fix the add_creator_as_member trigger to handle duplicate entries
CREATE OR REPLACE FUNCTION public.add_creator_as_member()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
    -- Add the community creator as an admin member, ignore if already exists
    INSERT INTO public.community_members (community_id, user_id, role, status)
    VALUES (NEW.id, NEW.owner_id, 'admin', 'active')
    ON CONFLICT (community_id, user_id) DO NOTHING;
    
    RETURN NEW;
END;
$function$;