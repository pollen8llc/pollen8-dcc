
export interface KnowledgeArticle {
  id: string;
  created_at: string;
  title: string;
  content: string;
  content_type: ContentType;
  user_id: string;
  view_count: number;
  like_count: number;
  is_pinned: boolean;
  is_answered: boolean;
  tags: string[];
  comment_count?: number;
  author?: {
    id: string;
    name: string;
    avatar_url: string;
    is_admin?: boolean;
  };
  comments?: KnowledgeComment[];
  vote_count?: number;
  user_vote?: number | null;
  is_featured?: boolean;
  subtitle?: string;
  source?: string;
  options?: string[];
}

export interface KnowledgeComment {
  id: string;
  created_at: string;
  article_id: string;
  user_id: string;
  content: string;
  is_accepted: boolean;
  author?: {
    id: string;
    name: string;
    avatar_url: string;
  };
  vote_count?: number;
  user_vote?: number | null;
  article?: {
    id: string;
    title: string;
    content_type: ContentType;
  };
}

export enum ContentType {
  ARTICLE = 'ARTICLE',
  QUESTION = 'QUESTION',
  POLL = 'POLL'
}

export interface KnowledgeTag {
  id: string;
  name: string;
  description?: string;
  count?: number;
}

export interface KnowledgeQueryOptions {
  tag?: string;
  type?: string;
  searchQuery?: string;
  limit?: number;
  userId?: string;
}

export interface KnowledgeBookmark {
  id: string;
  user_id: string;
  article_id: string;
  saved_at: string;
  article?: KnowledgeArticle;
}
