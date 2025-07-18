export interface ProposalCard {
  id: string;
  request_id: string;
  submitted_by: string;
  response_to_card_id?: string;
  card_number: number;
  status: 'pending' | 'accepted' | 'rejected' | 'countered' | 'cancelled' | 'final_confirmation' | 'agreement';
  notes?: string;
  scope_link?: string;
  terms_link?: string;
  asset_links: string[];
  negotiated_title?: string;
  negotiated_description?: string;
  negotiated_budget_range?: {
    min?: number;
    max?: number;
    currency: string;
  };
  negotiated_timeline?: string;
  is_locked: boolean;
  created_at: string;
  updated_at: string;
  responded_at?: string;
  responded_by?: string;
  deel_contract_url?: string;
}

export interface CreateProposalCardData {
  request_id: string;
  notes?: string;
  scope_link?: string;
  terms_link?: string;
  asset_links?: string[];
  response_to_card_id?: string;
  negotiated_title?: string;
  negotiated_description?: string;
  negotiated_budget_range?: {
    min?: number;
    max?: number;
    currency: string;
  };
  negotiated_timeline?: string;
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
