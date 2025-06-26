
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
    currency: string;
  };
  portfolio_links: string[];
  domain_specializations: number[];
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
    currency: string;
  };
  timeline?: string;
  milestones: string[];
  status: 'pending' | 'negotiating' | 'agreed' | 'in_progress' | 'pending_review' | 'revision_requested' | 'pending_completion' | 'completed' | 'cancelled' | 'closed' | 'assigned' | 'declined';
  engagement_status: 'none' | 'negotiating' | 'affiliated';
  project_progress?: number;
  is_agreement_locked?: boolean;
  created_at: string;
  updated_at: string;
  service_provider?: ServiceProvider;
  organizer?: Organizer;
}

export interface ProposalThread {
  id: string;
  service_request_id: string;
  organizer_id: string;
  service_provider_id: string;
  status: 'active' | 'closed' | 'completed';
  created_at: string;
  updated_at: string;
}

export interface ProposalVersion {
  id: string;
  thread_id: string;
  proposal_id: string;
  version_number: number;
  quote_amount?: number;
  timeline?: string;
  scope_details?: string;
  terms?: string;
  change_notes?: string;
  created_by: string;
  created_at: string;
}

export interface ProjectComment {
  id: string;
  service_request_id: string;
  user_id: string;
  comment_type: 'comment' | 'status_update' | 'deliverable' | 'milestone';
  content: string;
  attachments: string[];
  metadata: any;
  created_at: string;
  updated_at: string;
}

export interface ProjectRevision {
  id: string;
  service_request_id: string;
  organizer_id: string;
  service_provider_id: string;
  revision_type: 'requested' | 'response';
  description: string;
  attachments: string[];
  status: 'pending' | 'addressed' | 'accepted';
  created_at: string;
  updated_at: string;
}

export interface ProjectCompletion {
  id: string;
  service_request_id: string;
  service_provider_id: string;
  organizer_id: string;
  completion_notes?: string;
  deliverables: string[];
  submitted_at: string;
  confirmed_at?: string;
  confirmed_by?: string;
  status: 'submitted' | 'confirmed' | 'rejected';
}

export interface ProjectRating {
  id: string;
  service_request_id: string;
  completion_id: string;
  organizer_id: string;
  service_provider_id: string;
  rating: number;
  feedback?: string;
  created_at: string;
}

export interface ProjectMilestone {
  id: string;
  service_request_id: string;
  title: string;
  description?: string;
  due_date?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'overdue';
  completed_at?: string;
  order_index: number;
  created_at: string;
  updated_at: string;
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
  status: 'pending' | 'accepted' | 'rejected' | 'submitted' | 'countered';
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

export interface Notification {
  id: string;
  user_id: string;
  type: 'service_request' | 'proposal_update' | 'deal_locked';
  title: string;
  message: string;
  data: any;
  read_at?: string;
  created_at: string;
}

export interface Engagement {
  id: string;
  organizer_id: string;
  service_provider_id: string;
  service_request_id?: string;
  engagement_type: 'view_profile' | 'engage' | 'proposal_sent';
  created_at: string;
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
  domain_specializations?: number[];
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

export interface CreateProjectRevisionData {
  service_request_id: string;
  organizer_id: string;
  service_provider_id: string;
  revision_type: 'requested' | 'response';
  description: string;
  attachments?: string[];
}

export interface CreateProjectCompletionData {
  service_request_id: string;
  service_provider_id: string;
  organizer_id: string;
  completion_notes?: string;
  deliverables?: string[];
}

export interface CreateProjectRatingData {
  service_request_id: string;
  completion_id: string;
  organizer_id: string;
  service_provider_id: string;
  rating: number;
  feedback?: string;
}

export interface CreateProjectMilestoneData {
  service_request_id: string;
  title: string;
  description?: string;
  due_date?: string;
  order_index?: number;
}

export interface CreateProposalThreadData {
  service_request_id: string;
  organizer_id: string;
  service_provider_id: string;
}

export interface CreateProposalVersionData {
  thread_id: string;
  proposal_id: string;
  version_number: number;
  quote_amount?: number;
  timeline?: string;
  scope_details?: string;
  terms?: string;
  change_notes?: string;
  created_by: string;
}

export interface CreateProjectCommentData {
  service_request_id: string;
  user_id: string;
  comment_type: 'comment' | 'status_update' | 'deliverable' | 'milestone';
  content: string;
  attachments?: string[];
  metadata?: any;
}

export interface CreateServiceRequestCommentData {
  service_request_id: string;
  user_id: string;
  comment_type: 'general' | 'status_change' | 'system_notification';
  content: string;
  metadata?: any;
}

export interface CreateStatusChangeData {
  service_request_id: string;
  user_id: string;
  from_status?: string;
  to_status: string;
  reason?: string;
}

export interface ServiceRequestComment {
  id: string;
  service_request_id: string;
  user_id: string;
  comment_type: 'general' | 'status_change' | 'system_notification';
  content: string;
  metadata: any;
  created_at: string;
  updated_at: string;
}

export interface StatusChange {
  id: string;
  service_request_id: string;
  user_id: string;
  from_status?: string;
  to_status: string;
  reason?: string;
  created_at: string;
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
