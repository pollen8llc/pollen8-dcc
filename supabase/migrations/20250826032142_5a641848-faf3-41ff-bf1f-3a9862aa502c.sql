-- 1) Drop all triggers on public.community_data_distribution to prevent unintended side-effects
DO $$
DECLARE r RECORD;
BEGIN
  FOR r IN
    SELECT tgname
    FROM pg_trigger
    WHERE tgrelid = 'public.community_data_distribution'::regclass
      AND NOT tgisinternal
  LOOP
    EXECUTE format('DROP TRIGGER IF EXISTS %I ON public.community_data_distribution;', r.tgname);
  END LOOP;
END;
$$;

-- 2) Clean up duplicate communities, keeping the earliest created_at per (owner_id, lower(name))
WITH ranked AS (
  SELECT id,
         ROW_NUMBER() OVER (
           PARTITION BY owner_id, lower(name)
           ORDER BY created_at ASC
         ) AS rn
  FROM public.communities
  WHERE owner_id IS NOT NULL
)
DELETE FROM public.communities c
USING ranked r
WHERE c.id = r.id AND r.rn > 1;

-- 3) Add unique index to prevent future duplicates on (owner_id, lower(name))
CREATE UNIQUE INDEX IF NOT EXISTS idx_communities_owner_lower_name
  ON public.communities (owner_id, lower(name));

-- 4) Useful performance indexes
CREATE INDEX IF NOT EXISTS idx_communities_owner_id ON public.communities (owner_id);
CREATE INDEX IF NOT EXISTS idx_communities_is_public_created_at ON public.communities (is_public, created_at DESC);