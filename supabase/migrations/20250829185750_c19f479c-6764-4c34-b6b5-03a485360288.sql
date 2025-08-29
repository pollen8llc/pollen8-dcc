-- Drop all triggers that depend on validate_community_format function
DROP TRIGGER IF EXISTS validate_format_trigger ON communities;
DROP TRIGGER IF EXISTS tr_communities_validate_format ON communities; 
DROP TRIGGER IF EXISTS validate_format_before_ins_upd ON communities;
DROP TRIGGER IF EXISTS validate_community_format_trigger ON communities;

-- Now drop the function
DROP FUNCTION IF EXISTS validate_community_format() CASCADE;

-- Create a more robust format validation function that normalizes values
CREATE OR REPLACE FUNCTION public.validate_community_format()
RETURNS TRIGGER AS $$
BEGIN
  -- Normalize format values and validate
  IF NEW.format IS NOT NULL THEN
    -- Convert to lowercase and trim for comparison
    NEW.format := LOWER(TRIM(NEW.format));
    
    -- Validate against allowed values (now all lowercase)
    IF NEW.format NOT IN ('online', 'irl', 'hybrid') THEN
      RAISE EXCEPTION 'Invalid format "%" - must be one of: online, irl, hybrid', NEW.format;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a single trigger for format validation
CREATE TRIGGER validate_community_format_trigger
  BEFORE INSERT OR UPDATE ON public.communities
  FOR EACH ROW
  EXECUTE FUNCTION public.validate_community_format();