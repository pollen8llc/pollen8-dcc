-- Enable RLS on communities table and add appropriate policies
-- This ensures users can only access communities they own or public communities

-- Enable RLS on communities table
ALTER TABLE public.communities ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view public communities
CREATE POLICY "Users can view public communities"
ON public.communities
FOR SELECT
USING (is_public = true);

-- Policy: Users can view their own communities (public or private)
CREATE POLICY "Users can view their own communities"
ON public.communities
FOR SELECT
USING (owner_id = auth.uid());

-- Policy: Users can insert their own communities
CREATE POLICY "Users can insert their own communities"
ON public.communities
FOR INSERT
WITH CHECK (owner_id = auth.uid());

-- Policy: Users can update their own communities
CREATE POLICY "Users can update their own communities"
ON public.communities
FOR UPDATE
USING (owner_id = auth.uid());

-- Policy: Users can delete their own communities
CREATE POLICY "Users can delete their own communities"
ON public.communities
FOR DELETE
USING (owner_id = auth.uid());

-- Policy: Admins can manage all communities
CREATE POLICY "Admins can manage all communities"
ON public.communities
USING (
    EXISTS (
        SELECT 1 FROM public.admin_roles 
        WHERE user_id = auth.uid() AND role = 'ADMIN'
    )
);
