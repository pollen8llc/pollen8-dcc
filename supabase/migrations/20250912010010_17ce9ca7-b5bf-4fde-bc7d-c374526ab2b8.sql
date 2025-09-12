-- Add missing knowledge system tables
CREATE TABLE public.knowledge_saved_articles (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    article_id UUID NOT NULL,
    saved_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(user_id, article_id)
);

CREATE TABLE public.knowledge_comment_mentions (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    comment_id UUID NOT NULL,
    mentioned_user_id UUID NOT NULL,
    mentioned_username TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.knowledge_saved_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.knowledge_comment_mentions ENABLE ROW LEVEL SECURITY;

-- RLS policies for saved articles
CREATE POLICY "Users can manage their own saved articles" 
ON public.knowledge_saved_articles FOR ALL 
USING (user_id = auth.uid());

-- RLS policies for comment mentions
CREATE POLICY "Users can view mentions" 
ON public.knowledge_comment_mentions FOR SELECT 
USING (true);

CREATE POLICY "Users can create mentions" 
ON public.knowledge_comment_mentions FOR INSERT 
WITH CHECK (true);

-- Add foreign key constraints
ALTER TABLE public.knowledge_comments 
ADD CONSTRAINT knowledge_comments_article_id_fkey 
FOREIGN KEY (article_id) REFERENCES public.knowledge_articles(id) ON DELETE CASCADE;

ALTER TABLE public.knowledge_comments 
ADD CONSTRAINT knowledge_comments_author_id_fkey 
FOREIGN KEY (author_id) REFERENCES public.profiles(user_id) ON DELETE CASCADE;

ALTER TABLE public.knowledge_votes 
ADD CONSTRAINT knowledge_votes_comment_id_fkey 
FOREIGN KEY (comment_id) REFERENCES public.knowledge_comments(id) ON DELETE CASCADE;

ALTER TABLE public.knowledge_votes 
ADD CONSTRAINT knowledge_votes_article_id_fkey 
FOREIGN KEY (article_id) REFERENCES public.knowledge_articles(id) ON DELETE CASCADE;

ALTER TABLE public.knowledge_votes 
ADD CONSTRAINT knowledge_votes_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES public.profiles(user_id) ON DELETE CASCADE;

ALTER TABLE public.knowledge_saved_articles 
ADD CONSTRAINT knowledge_saved_articles_article_id_fkey 
FOREIGN KEY (article_id) REFERENCES public.knowledge_articles(id) ON DELETE CASCADE;

ALTER TABLE public.knowledge_saved_articles 
ADD CONSTRAINT knowledge_saved_articles_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES public.profiles(user_id) ON DELETE CASCADE;

ALTER TABLE public.knowledge_comment_mentions 
ADD CONSTRAINT knowledge_comment_mentions_comment_id_fkey 
FOREIGN KEY (comment_id) REFERENCES public.knowledge_comments(id) ON DELETE CASCADE;

ALTER TABLE public.knowledge_comment_mentions 
ADD CONSTRAINT knowledge_comment_mentions_mentioned_user_id_fkey 
FOREIGN KEY (mentioned_user_id) REFERENCES public.profiles(user_id) ON DELETE CASCADE;