-- Migration: Change target_audience column from text[] to jsonb
-- This allows storing structured audience data with options and importance values

-- Backup existing data first (if any exists)
DO $$
BEGIN
  -- Only create backup if there's data
  IF EXISTS (SELECT 1 FROM communities WHERE target_audience IS NOT NULL AND array_length(target_audience, 1) > 0) THEN
    CREATE TABLE IF NOT EXISTS communities_target_audience_backup AS 
    SELECT id, target_audience, updated_at FROM communities WHERE target_audience IS NOT NULL;
  END IF;
END $$;

-- Change column type from text[] to jsonb
ALTER TABLE communities 
ALTER COLUMN target_audience DROP DEFAULT;

ALTER TABLE communities 
ALTER COLUMN target_audience TYPE jsonb 
USING CASE 
  WHEN target_audience IS NULL THEN '[]'::jsonb
  ELSE '[]'::jsonb
END;

-- Set default value
ALTER TABLE communities 
ALTER COLUMN target_audience SET DEFAULT '[]'::jsonb;

-- Add comment explaining the structure
COMMENT ON COLUMN communities.target_audience IS 'JSONB array of objects with structure: [{id: string, option: string, importance: number}]. Example: [{"id":"age","option":"18-24","importance":45}]';