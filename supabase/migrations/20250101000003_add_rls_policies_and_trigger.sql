-- Add RLS policies for community_data_distribution table
-- Wire up the trigger for automatic processing

-- Create RLS policies for community_data_distribution table
CREATE POLICY "Users can insert their own community submissions"
ON public.community_data_distribution
FOR INSERT
WITH CHECK (auth.uid() = submitter_id);

CREATE POLICY "Users can view their own community submissions"
ON public.community_data_distribution
FOR SELECT
USING (auth.uid() = submitter_id);

CREATE POLICY "Users can update their own community submissions"
ON public.community_data_distribution
FOR UPDATE
USING (auth.uid() = submitter_id);

CREATE POLICY "Admins can manage all community submissions"
ON public.community_data_distribution
USING (
    EXISTS (
        SELECT 1 FROM public.admin_roles 
        WHERE user_id = auth.uid() AND role = 'ADMIN'
    )
);

-- Wire the submission pipeline: process community submissions automatically
DROP TRIGGER IF EXISTS tr_process_community_submission ON public.community_data_distribution;

CREATE TRIGGER tr_process_community_submission
AFTER INSERT ON public.community_data_distribution
FOR EACH ROW
EXECUTE FUNCTION public.process_community_submission();
