
export enum ContentType {
  QUESTION = "QUESTION",
  ARTICLE = "ARTICLE",
  QUOTE = "QUOTE",
  POLL = "POLL"
}

export type VoteType = 'upvote' | 'downvote' | 'none';

export interface KnowledgeAuthor {
  id: string;
  name: string; // Make name required but provide default in transformations
  first_name?: string;
  last_name?: string;
  avatar_url?: string;
  role?: string;
  is_admin?: boolean;
}

export interface KnowledgeArticle {
  id: string;
  title: string;
  content: string;
  content_type: ContentType;
  author_id: string;
  created_at: string;
  updated_at: string;
  tags?: string[];
  vote_count: number;
  user_vote?: number | null;
  view_count: number;
  comment_count: number;
  is_answered?: boolean;
  is_featured?: boolean;
  is_published?: boolean;
  author?: KnowledgeAuthor;
  subtitle?: string;
  source?: string;
  options?: any;
  category?: string;
  archived_at?: string | null;
  archived_by?: string | null;
}

export interface KnowledgeComment {
  id: string;
  article_id: string;
  user_id: string;
  content: string;
  created_at: string;
  updated_at: string;
  is_accepted?: boolean;
  author?: KnowledgeAuthor;
  parent_comment_id?: string | null;
  reply_count?: number;
  replies?: KnowledgeComment[];
  mentions?: KnowledgeCommentMention[];
}

export interface KnowledgeCommentMention {
  id: string;
  comment_id: string;
  mentioned_user_id: string;
  created_at: string;
}

export interface KnowledgeTag {
  id: string;
  name: string;
  description?: string;
  count?: number;
}

export interface KnowledgeVote {
  id: string;
  user_id: string;
  article_id?: string;
  comment_id?: string;
  vote_type: number;
  created_at: string;
}

export interface PollOption {
  id: string;
  poll_id: string;
  option_text: string;
  vote_count: number;
  user_voted?: boolean;
}

export interface KnowledgeQueryOptions {
  searchQuery?: string;
  tag?: string | null;
  type?: string;
  sort?: string;
  limit?: number;
}
