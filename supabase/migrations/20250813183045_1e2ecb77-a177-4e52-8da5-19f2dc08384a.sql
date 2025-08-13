-- Add reply functionality to knowledge_comments table
ALTER TABLE public.knowledge_comments 
ADD COLUMN parent_comment_id UUID REFERENCES public.knowledge_comments(id) ON DELETE CASCADE,
ADD COLUMN reply_count INTEGER NOT NULL DEFAULT 0;

-- Create index for better performance on parent_comment_id queries
CREATE INDEX idx_knowledge_comments_parent_id ON public.knowledge_comments(parent_comment_id);

-- Create knowledge_comment_mentions table for user tagging
CREATE TABLE public.knowledge_comment_mentions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  comment_id UUID NOT NULL REFERENCES public.knowledge_comments(id) ON DELETE CASCADE,
  mentioned_user_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create index for better performance
CREATE INDEX idx_comment_mentions_comment_id ON public.knowledge_comment_mentions(comment_id);
CREATE INDEX idx_comment_mentions_user_id ON public.knowledge_comment_mentions(mentioned_user_id);

-- Enable RLS on the new table
ALTER TABLE public.knowledge_comment_mentions ENABLE ROW LEVEL SECURITY;

-- RLS policies for knowledge_comment_mentions
CREATE POLICY "Anyone can view mentions" 
ON public.knowledge_comment_mentions 
FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can create mentions" 
ON public.knowledge_comment_mentions 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.knowledge_comments 
    WHERE id = comment_id AND user_id = auth.uid()
  )
);

-- Function to update reply count when replies are added/removed
CREATE OR REPLACE FUNCTION public.update_comment_reply_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' AND NEW.parent_comment_id IS NOT NULL THEN
    UPDATE public.knowledge_comments 
    SET reply_count = reply_count + 1 
    WHERE id = NEW.parent_comment_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' AND OLD.parent_comment_id IS NOT NULL THEN
    UPDATE public.knowledge_comments 
    SET reply_count = reply_count - 1 
    WHERE id = OLD.parent_comment_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for reply count updates
CREATE TRIGGER update_comment_reply_count_trigger
  AFTER INSERT OR DELETE ON public.knowledge_comments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_comment_reply_count();