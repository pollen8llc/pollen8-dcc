-- Knowledge Base Schema Fixes and Enhancements
-- This migration implements all the missing columns, constraints, indexes, functions and triggers

-- Add missing columns to knowledge_articles table
ALTER TABLE knowledge_articles ADD COLUMN IF NOT EXISTS vote_count INTEGER DEFAULT 0;
ALTER TABLE knowledge_articles ADD COLUMN IF NOT EXISTS comment_count INTEGER DEFAULT 0;
ALTER TABLE knowledge_articles ADD COLUMN IF NOT EXISTS is_answered BOOLEAN DEFAULT false;
ALTER TABLE knowledge_articles ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false;
ALTER TABLE knowledge_articles ADD COLUMN IF NOT EXISTS has_accepted_answer BOOLEAN DEFAULT false;
ALTER TABLE knowledge_articles ADD COLUMN IF NOT EXISTS subtitle TEXT;
ALTER TABLE knowledge_articles ADD COLUMN IF NOT EXISTS source TEXT;
ALTER TABLE knowledge_articles ADD COLUMN IF NOT EXISTS options JSONB;
ALTER TABLE knowledge_articles ADD COLUMN IF NOT EXISTS archived_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE knowledge_articles ADD COLUMN IF NOT EXISTS archived_by UUID;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_knowledge_articles_author_id ON knowledge_articles(author_id);
CREATE INDEX IF NOT EXISTS idx_knowledge_articles_published ON knowledge_articles(is_published);
CREATE INDEX IF NOT EXISTS idx_knowledge_articles_content_type ON knowledge_articles(content_type);
CREATE INDEX IF NOT EXISTS idx_knowledge_articles_tags ON knowledge_articles USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_knowledge_comments_article_id ON knowledge_comments(article_id);
CREATE INDEX IF NOT EXISTS idx_knowledge_comments_author_id ON knowledge_comments(author_id);
CREATE INDEX IF NOT EXISTS idx_knowledge_votes_article_id ON knowledge_votes(article_id);
CREATE INDEX IF NOT EXISTS idx_knowledge_votes_comment_id ON knowledge_votes(comment_id);
CREATE INDEX IF NOT EXISTS idx_knowledge_votes_user_id ON knowledge_votes(user_id);

-- Add missing columns to knowledge_comments table
ALTER TABLE knowledge_comments ADD COLUMN IF NOT EXISTS parent_comment_id UUID REFERENCES knowledge_comments(id) ON DELETE CASCADE;
ALTER TABLE knowledge_comments ADD COLUMN IF NOT EXISTS reply_count INTEGER DEFAULT 0;

-- Drop existing policies to recreate them properly
DROP POLICY IF EXISTS "Authors can manage their articles" ON knowledge_articles;
DROP POLICY IF EXISTS "Published articles are viewable by everyone" ON knowledge_articles;
DROP POLICY IF EXISTS "Authors can manage their comments" ON knowledge_comments;
DROP POLICY IF EXISTS "Comments are viewable by everyone" ON knowledge_comments;
DROP POLICY IF EXISTS "Users can create comments" ON knowledge_comments;

-- Create comprehensive RLS policies for knowledge_articles
CREATE POLICY "Authors can view their own articles" ON knowledge_articles
  FOR SELECT USING (author_id = auth.uid());

CREATE POLICY "Published articles are viewable by everyone" ON knowledge_articles
  FOR SELECT USING (is_published = true OR author_id = auth.uid());

CREATE POLICY "Admins can view all articles" ON knowledge_articles
  FOR SELECT USING (has_role(auth.uid(), 'ADMIN'));

CREATE POLICY "Authenticated users can create articles" ON knowledge_articles
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL AND author_id = auth.uid());

CREATE POLICY "Authors can update their articles" ON knowledge_articles
  FOR UPDATE USING (author_id = auth.uid() OR has_role(auth.uid(), 'ADMIN'));

CREATE POLICY "Authors can delete their articles" ON knowledge_articles
  FOR DELETE USING (author_id = auth.uid() OR has_role(auth.uid(), 'ADMIN'));

-- Create comprehensive RLS policies for knowledge_comments  
CREATE POLICY "Comments are viewable by everyone" ON knowledge_comments
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create comments" ON knowledge_comments
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL AND author_id = auth.uid());

CREATE POLICY "Authors can update their comments" ON knowledge_comments
  FOR UPDATE USING (author_id = auth.uid() OR has_role(auth.uid(), 'ADMIN'));

CREATE POLICY "Authors can delete their comments" ON knowledge_comments
  FOR DELETE USING (author_id = auth.uid() OR has_role(auth.uid(), 'ADMIN'));

-- Create function to update article vote count
CREATE OR REPLACE FUNCTION update_article_vote_count(article_uuid UUID)
RETURNS void AS $$
BEGIN
  UPDATE knowledge_articles 
  SET vote_count = (
    SELECT COALESCE(SUM(CASE 
      WHEN vote_type = 'upvote' THEN 1 
      WHEN vote_type = 'downvote' THEN -1 
      ELSE 0 
    END), 0)
    FROM knowledge_votes 
    WHERE article_id = article_uuid
  )
  WHERE id = article_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to update comment vote count (for future use)
CREATE OR REPLACE FUNCTION update_comment_vote_count(comment_uuid UUID)
RETURNS integer AS $$
DECLARE
  vote_total integer;
BEGIN
  SELECT COALESCE(SUM(CASE 
    WHEN vote_type = 'upvote' THEN 1 
    WHEN vote_type = 'downvote' THEN -1 
    ELSE 0 
  END), 0)
  INTO vote_total
  FROM knowledge_votes 
  WHERE comment_id = comment_uuid;
  
  RETURN vote_total;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to update comment count on articles
CREATE OR REPLACE FUNCTION update_article_comment_count()
RETURNS trigger AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE knowledge_articles 
    SET comment_count = comment_count + 1 
    WHERE id = NEW.article_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE knowledge_articles 
    SET comment_count = GREATEST(comment_count - 1, 0)
    WHERE id = OLD.article_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to update vote counts when votes change
CREATE OR REPLACE FUNCTION update_vote_counts()
RETURNS trigger AS $$
BEGIN
  IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' OR TG_OP = 'DELETE' THEN
    -- Update article vote count if this is an article vote
    IF (TG_OP = 'DELETE' AND OLD.article_id IS NOT NULL) OR 
       (TG_OP != 'DELETE' AND NEW.article_id IS NOT NULL) THEN
      PERFORM update_article_vote_count(COALESCE(NEW.article_id, OLD.article_id));
    END IF;
  END IF;
  
  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  ELSE
    RETURN NEW;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create triggers for automatic count updates
DROP TRIGGER IF EXISTS update_article_comment_count_trigger ON knowledge_comments;
CREATE TRIGGER update_article_comment_count_trigger
  AFTER INSERT OR DELETE ON knowledge_comments
  FOR EACH ROW EXECUTE FUNCTION update_article_comment_count();

DROP TRIGGER IF EXISTS update_vote_counts_trigger ON knowledge_votes;
CREATE TRIGGER update_vote_counts_trigger
  AFTER INSERT OR UPDATE OR DELETE ON knowledge_votes
  FOR EACH ROW EXECUTE FUNCTION update_vote_counts();

-- Create function to get articles with enhanced data
CREATE OR REPLACE FUNCTION get_knowledge_articles(
  p_search_query TEXT DEFAULT NULL,
  p_tag TEXT DEFAULT NULL,
  p_content_type TEXT DEFAULT NULL,
  p_sort_by TEXT DEFAULT 'created_at',
  p_limit INTEGER DEFAULT 20,
  p_offset INTEGER DEFAULT 0,
  p_user_id UUID DEFAULT NULL
)
RETURNS TABLE(
  id UUID,
  title TEXT,
  subtitle TEXT,
  content TEXT,
  content_type TEXT,
  author_id UUID,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE,
  tags TEXT[],
  vote_count INTEGER,
  view_count INTEGER,
  comment_count INTEGER,
  is_answered BOOLEAN,
  is_featured BOOLEAN,
  is_published BOOLEAN,
  author_name TEXT,
  author_avatar_url TEXT,
  user_vote TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    ka.id,
    ka.title,
    ka.subtitle,
    ka.content,
    ka.content_type,
    ka.author_id,
    ka.created_at,
    ka.updated_at,
    ka.tags,
    ka.vote_count,
    ka.view_count,
    ka.comment_count,
    ka.is_answered,
    ka.is_featured,
    ka.is_published,
    COALESCE(p.full_name, p.first_name || ' ' || p.last_name, 'Anonymous') as author_name,
    p.avatar_url as author_avatar_url,
    kv.vote_type as user_vote
  FROM knowledge_articles ka
  LEFT JOIN profiles p ON p.user_id = ka.author_id
  LEFT JOIN knowledge_votes kv ON kv.article_id = ka.id AND kv.user_id = p_user_id
  WHERE 
    (ka.is_published = true OR ka.author_id = p_user_id OR has_role(p_user_id, 'ADMIN'))
    AND (p_search_query IS NULL OR 
         ka.title ILIKE '%' || p_search_query || '%' OR 
         ka.content ILIKE '%' || p_search_query || '%')
    AND (p_tag IS NULL OR p_tag = ANY(ka.tags))
    AND (p_content_type IS NULL OR ka.content_type = p_content_type)
    AND ka.archived_at IS NULL
  ORDER BY 
    CASE 
      WHEN p_sort_by = 'created_at' THEN ka.created_at
      WHEN p_sort_by = 'updated_at' THEN ka.updated_at
      ELSE ka.created_at
    END DESC,
    CASE 
      WHEN p_sort_by = 'votes' THEN ka.vote_count
      WHEN p_sort_by = 'views' THEN ka.view_count
      ELSE 0
    END DESC
  LIMIT p_limit OFFSET p_offset;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;