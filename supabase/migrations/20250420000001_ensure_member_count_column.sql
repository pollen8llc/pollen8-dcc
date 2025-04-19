
-- Make sure the communities table has a member_count column
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'communities' 
    AND column_name = 'member_count'
  ) THEN
    ALTER TABLE public.communities 
    ADD COLUMN member_count INTEGER DEFAULT 0;
  END IF;
END $$;
