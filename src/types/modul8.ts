
export interface ServiceProvider {
  id: string;
  user_id: string;
  business_name: string;
  logo_url?: string;
  tagline?: string;
  description?: string;
  services: string[];
  tags: string[];
  pricing_range: {
    min?: number;
    max?: number;
    currency?: string;
  };
  portfolio_links: string[];
  created_at: string;
  updated_at: string;
}

export interface Organizer {
  id: string;
  user_id: string;
  organization_name: string;
  logo_url?: string;
  description?: string;
  focus_areas: string[];
  created_at: string;
  updated_at: string;
}

export interface ServiceRequest {
  id: string;
  organizer_id: string;
  service_provider_id?: string;
  domain_page: number;
  title: string;
  description?: string;
  budget_range: {
    min?: number;
    max?: number;
    currency?: string;
  };
  timeline?: string;
  milestones: string[];
  status: 'pending' | 'negotiating' | 'agreed' | 'completed' | 'cancelled';
  engagement_status: 'none' | 'negotiating' | 'affiliated';
  created_at: string;
  updated_at: string;
  service_provider?: ServiceProvider;
  organizer?: Organizer;
}

export interface Proposal {
  id: string;
  service_request_id: string;
  from_user_id: string;
  proposal_type: 'initial' | 'counter' | 'revision';
  quote_amount?: number;
  timeline?: string;
  scope_details?: string;
  terms?: string;
  status: 'pending' | 'accepted' | 'rejected' | 'countered';
  created_at: string;
}

export interface Deal {
  id: string;
  service_request_id: string;
  organizer_id: string;
  service_provider_id: string;
  final_amount: number;
  deal_terms: any;
  deel_contract_url?: string;
  status: 'pending' | 'signed' | 'completed' | 'cancelled';
  created_at: string;
  completed_at?: string;
}

// Database insert/update types
export interface CreateServiceProviderData {
  user_id: string;
  business_name: string;
  logo_url?: string;
  tagline?: string;
  description?: string;
  services?: string[];
  tags?: string[];
  pricing_range?: {
    min?: number;
    max?: number;
    currency?: string;
  };
  portfolio_links?: string[];
}

export interface CreateOrganizerData {
  user_id: string;
  organization_name: string;
  logo_url?: string;
  description?: string;
  focus_areas?: string[];
}

export interface CreateServiceRequestData {
  organizer_id: string;
  domain_page: number;
  title: string;
  description?: string;
  budget_range?: {
    min?: number;
    max?: number;
    currency?: string;
  };
  timeline?: string;
  milestones?: string[];
}

export interface CreateProposalData {
  service_request_id: string;
  from_user_id: string;
  proposal_type: 'initial' | 'counter' | 'revision';
  quote_amount?: number;
  timeline?: string;
  scope_details?: string;
  terms?: string;
}

export interface CreateDealData {
  service_request_id: string;
  organizer_id: string;
  service_provider_id: string;
  final_amount: number;
  deal_terms: any;
  deel_contract_url?: string;
}

export const DOMAIN_PAGES = [
  { id: 1, title: 'Fundraising & Sponsorship', description: 'Grant writing, donor management, sponsorship acquisition' },
  { id: 2, title: 'Event Production & Logistics', description: 'Event planning, venue management, logistics coordination' },
  { id: 3, title: 'Legal & Compliance', description: 'Legal services, compliance management, contract review' },
  { id: 4, title: 'Marketing & Communications', description: 'Brand development, content creation, PR campaigns' },
  { id: 5, title: 'Technology & Digital Infrastructure', description: 'Website development, CRM setup, digital tools' },
  { id: 6, title: 'Vendor & Marketplace Management', description: 'Vendor relations, marketplace development, supply chain' },
  { id: 7, title: 'Partnership Development & Collaboration', description: 'Strategic partnerships, collaboration frameworks' },
  { id: 8, title: 'Community Engagement & Relationship Management', description: 'Member engagement, relationship building, community growth' }
];
