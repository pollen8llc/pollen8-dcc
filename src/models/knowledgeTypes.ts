
export interface KnowledgeArticle {
  id: string;
  title: string;
  content: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  view_count: number;
  is_answered: boolean;
  tags: string[];
  author?: {
    name: string;
    avatar_url: string;
  };
  vote_count?: number;
  user_vote?: number | null;
}

export interface KnowledgeComment {
  id: string;
  article_id: string;
  user_id: string;
  content: string;
  created_at: string;
  updated_at: string;
  is_accepted: boolean;
  author?: {
    name: string;
    avatar_url: string;
  };
  vote_count?: number;
  user_vote?: number | null;
}

export interface KnowledgeTag {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
}

export interface KnowledgeVote {
  id: string;
  user_id: string;
  article_id?: string;
  comment_id?: string;
  vote_type: number;
  created_at: string;
}

export type VoteType = 'upvote' | 'downvote' | 'none';
