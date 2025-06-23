
export interface ServiceProvider {
  id: string;
  user_id: string;
  business_name: string;
  tagline?: string;
  description?: string;
  services: string[];
  tags?: string[];
  pricing_range?: {
    min?: number;
    max?: number;
    currency: string;
  };
  portfolio_links?: string[];
  logo_url?: string;
  domain_specializations?: number[];
  created_at: string;
  updated_at: string;
}

export interface Organizer {
  id: string;
  user_id: string;
  organization_name: string;
  description?: string;
  focus_areas?: string[];
  logo_url?: string;
  created_at: string;
  updated_at: string;
}

export interface ServiceRequest {
  id: string;
  organizer_id: string;
  service_provider_id?: string;
  title: string;
  description?: string;
  budget_range?: {
    min?: number;
    max?: number;
    currency: string;
  };
  timeline?: string;
  milestones?: string[];
  status: 'pending' | 'negotiating' | 'agreed' | 'in_progress' | 'completed' | 'cancelled' | 'declined';
  engagement_status: 'none' | 'pending' | 'negotiating' | 'affiliated' | 'active' | 'completed';
  domain_page: number;
  project_progress?: number;
  created_at: string;
  updated_at: string;
  organizer?: Organizer;
  service_provider?: ServiceProvider;
}

export interface Proposal {
  id: string;
  service_request_id: string;
  from_user_id: string;
  proposal_type: 'initial' | 'counter' | 'revision';
  quote_amount?: number;
  timeline?: string;
  scope_details?: string; // URL to scope document
  terms?: string; // URL to terms document
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
  service_provider?: ServiceProvider;
}

export interface ProposalThread {
  id: string;
  service_request_id: string;
  organizer_id: string;
  service_provider_id: string;
  status: 'active' | 'closed';
  created_at: string;
  updated_at: string;
}

export interface ProposalVersion {
  id: string;
  thread_id: string;
  proposal_id: string;
  version_number: number;
  created_by: string;
  quote_amount?: number;
  timeline?: string;
  scope_details?: string; // URL to scope document
  terms?: string; // URL to terms document
  change_notes?: string;
  created_at: string;
}

// Create types
export interface CreateServiceProviderData {
  user_id: string;
  business_name: string;
  tagline?: string;
  description?: string;
  services?: string[];
  tags?: string[];
  pricing_range?: {
    min?: number;
    max?: number;
    currency: string;
  };
  portfolio_links?: string[];
  logo_url?: string;
  domain_specializations?: number[];
}

export interface CreateOrganizerData {
  user_id: string;
  organization_name: string;
  description?: string;
  focus_areas?: string[];
  logo_url?: string;
}

export interface CreateServiceRequestData {
  organizer_id: string;
  title: string;
  description?: string;
  budget_range?: {
    min?: number;
    max?: number;
    currency: string;
  };
  timeline?: string;
  milestones?: string[];
  domain_page: number;
}

export interface CreateProposalData {
  service_request_id: string;
  from_user_id: string;
  proposal_type: 'initial' | 'counter' | 'revision';
  quote_amount?: number;
  timeline?: string;
  scope_details?: string; // URL to scope document
  terms?: string; // URL to terms document
}
