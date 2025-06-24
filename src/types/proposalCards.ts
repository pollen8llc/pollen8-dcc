
export interface ProposalCard {
  id: string;
  request_id: string;
  submitted_by: string;
  response_to_card_id?: string;
  card_number: number;
  status: 'pending' | 'accepted' | 'rejected' | 'countered' | 'cancelled';
  notes?: string;
  scope_link?: string;
  terms_link?: string;
  asset_links: string[];
  is_locked: boolean;
  created_at: string;
  updated_at: string;
  responded_at?: string;
  responded_by?: string;
}

export interface ProposalCardResponse {
  id: string;
  card_id: string;
  response_type: 'accept' | 'reject' | 'counter' | 'cancel';
  responded_by: string;
  response_notes?: string;
  created_at: string;
}

export interface RequestComment {
  id: string;
  request_id: string;
  user_id: string;
  content: string;
  attachment_links: string[];
  created_at: string;
  updated_at: string;
}

export interface CreateProposalCardData {
  request_id: string;
  response_to_card_id?: string;
  notes?: string;
  scope_link?: string;
  terms_link?: string;
  asset_links?: string[];
}

export interface CreateProposalResponseData {
  card_id: string;
  response_type: 'accept' | 'reject' | 'counter' | 'cancel';
  response_notes?: string;
}

export interface CreateCommentData {
  request_id: string;
  content: string;
  attachment_links?: string[];
}
