-- Fix generate_unique_invite_code function to avoid ambiguous column reference
CREATE OR REPLACE FUNCTION public.generate_unique_invite_code()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_code TEXT;
  code_exists BOOLEAN;
BEGIN
  LOOP
    v_code := upper(substring(md5(random()::text) from 1 for 8));
    SELECT EXISTS(SELECT 1 FROM public.invites i WHERE i.code = v_code) INTO code_exists;
    EXIT WHEN NOT code_exists;
  END LOOP;
  RETURN v_code;
END;
$$;

-- Drop existing broad policy
DROP POLICY IF EXISTS "Users can manage their own invites" ON public.invites;

-- Create specific policies for better security
CREATE POLICY "Users can insert their own invites"
ON public.invites
FOR INSERT
TO authenticated
WITH CHECK (creator_id = auth.uid());

CREATE POLICY "Users can update their own invites"
ON public.invites
FOR UPDATE
TO authenticated
USING (creator_id = auth.uid())
WITH CHECK (creator_id = auth.uid());

CREATE POLICY "Users can delete their own invites"
ON public.invites
FOR DELETE
TO authenticated
USING (creator_id = auth.uid());

CREATE POLICY "Users can view their own invites"
ON public.invites
FOR SELECT
TO authenticated
USING (creator_id = auth.uid());

-- Drop the old public view policy if it exists
DROP POLICY IF EXISTS "Anyone can view active invites" ON public.invites;

-- Create a more restrictive public policy for valid invites only
CREATE POLICY "Anyone can view valid active invites"
ON public.invites
FOR SELECT
TO public
USING (
  is_active = true
  AND (expires_at IS NULL OR expires_at > now())
  AND (max_uses IS NULL OR used_count < max_uses)
);