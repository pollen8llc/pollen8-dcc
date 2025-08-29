-- Update the format validation to be more permissive and handle potential format issues
DROP TRIGGER IF EXISTS validate_community_format_trigger ON communities;
DROP FUNCTION IF EXISTS validate_community_format();

-- Create a more robust format validation function
CREATE OR REPLACE FUNCTION public.validate_community_format()
RETURNS TRIGGER AS $$
BEGIN
  -- Normalize format values and validate
  IF NEW.format IS NOT NULL THEN
    -- Convert to lowercase for comparison
    NEW.format := LOWER(TRIM(NEW.format));
    
    -- Validate against allowed values
    IF NEW.format NOT IN ('online', 'irl', 'hybrid') THEN
      RAISE EXCEPTION 'Invalid format "%" - must be one of: online, irl, hybrid', NEW.format;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Recreate the trigger
CREATE TRIGGER validate_community_format_trigger
  BEFORE INSERT OR UPDATE ON public.communities
  FOR EACH ROW
  EXECUTE FUNCTION public.validate_community_format();