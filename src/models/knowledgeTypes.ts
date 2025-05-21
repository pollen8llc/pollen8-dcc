
export enum ContentType {
  QUESTION = "QUESTION",
  ARTICLE = "ARTICLE",
  QUOTE = "QUOTE",
  POLL = "POLL"
}

export interface KnowledgeAuthor {
  id: string;
  name: string;
  avatar_url?: string;
  role?: string;
}

export interface KnowledgeArticle {
  id: string;
  title: string;
  content: string;
  content_type: ContentType;
  user_id: string;
  created_at: string;
  updated_at: string;
  tags?: string[];
  vote_count?: number;
  user_vote?: 'up' | 'down' | null;
  view_count: number;
  comment_count?: number;
  is_answered?: boolean;
  is_featured?: boolean;
  author?: KnowledgeAuthor;
}

export interface KnowledgeComment {
  id: string;
  article_id: string;
  user_id: string;
  content: string;
  created_at: string;
  updated_at: string;
  is_accepted?: boolean;
  vote_count?: number;
  user_vote?: 'up' | 'down' | null;
  author?: KnowledgeAuthor;
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
  vote_type: 'up' | 'down';
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
  query?: string;
  tag?: string | null;
  type?: string;
  sort?: string;
  limit?: number;
}
