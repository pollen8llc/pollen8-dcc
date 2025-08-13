-- Make mentioned_user_id nullable since we're switching to username-based mentions
ALTER TABLE public.knowledge_comment_mentions ALTER COLUMN mentioned_user_id DROP NOT NULL;