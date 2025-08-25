
-- 1) Deduplicate by keeping the earliest created_at for the same (owner_id, lower(name))
WITH duplicates AS (
  SELECT
    id,
    ROW_NUMBER() OVER (PARTITION BY owner_id, lower(name) ORDER BY created_at ASC) AS rn
  FROM public.communities
)
DELETE FROM public.communities c
USING duplicates d
WHERE c.id = d.id
  AND d.rn > 1;

-- 2) Add a unique index to prevent duplicates in the future
-- Note: expression index requires parentheses around lower(name)
CREATE UNIQUE INDEX IF NOT EXISTS communities_owner_lower_name_uidx
  ON public.communities (owner_id, (lower(name)));

-- 3) Add a performance index for dashboard lists
CREATE INDEX IF NOT EXISTS communities_owner_id_idx
  ON public.communities (owner_id);
