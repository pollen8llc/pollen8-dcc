-- Fix RLS recursive loop between communities and community_members tables

-- Drop problematic policies on community_members table
DROP POLICY IF EXISTS "Community owners can manage membership" ON public.community_members;
DROP POLICY IF EXISTS "Members can view community membership" ON public.community_members;

-- Recreate community owners policy for INSERT, UPDATE, DELETE only (not SELECT to avoid recursion)
CREATE POLICY "Community owners can manage membership" 
ON public.community_members 
FOR INSERT 
WITH CHECK (
    (EXISTS (SELECT 1 FROM communities c WHERE c.id = community_members.community_id AND c.owner_id = auth.uid())) 
    OR has_role(auth.uid(), 'ADMIN')
);

CREATE POLICY "Community owners can update membership" 
ON public.community_members 
FOR UPDATE 
USING (
    (EXISTS (SELECT 1 FROM communities c WHERE c.id = community_members.community_id AND c.owner_id = auth.uid())) 
    OR has_role(auth.uid(), 'ADMIN')
);

CREATE POLICY "Community owners can delete membership" 
ON public.community_members 
FOR DELETE 
USING (
    (EXISTS (SELECT 1 FROM communities c WHERE c.id = community_members.community_id AND c.owner_id = auth.uid())) 
    OR has_role(auth.uid(), 'ADMIN')
);

-- Add separate SELECT policy for admins only (no community owner check to avoid recursion)
CREATE POLICY "Admins can view all community membership" 
ON public.community_members 
FOR SELECT 
USING (has_role(auth.uid(), 'ADMIN'));

-- Keep the existing policy for users to view their own membership
-- This should already exist: "Users can view their own membership"