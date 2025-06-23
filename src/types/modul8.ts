
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
  status: 'pending' | 'negotiating' | 'agreed' | 'in_progress' | 'completed' | 'cancelled' | 'declined' | 'revision_requested' | 'pending_review' | 'pending_completion';
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

// Project-related interfaces
export interface ProjectRevision {
  id: string;
  service_request_id: string;
  organizer_id: string;
  service_provider_id: string;
  revision_type: 'requested' | 'response';
  description: string;
  status: 'pending' | 'addressed' | 'closed';
  attachments?: string[];
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
  status: 'submitted' | 'confirmed' | 'rejected';
  submitted_at: string;
  confirmed_at?: string;
  confirmed_by?: string;
}

export interface ProjectRating {
  id: string;
  service_request_id: string;
  organizer_id: string;
  service_provider_id: string;
  completion_id: string;
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
  status: 'pending' | 'in_progress' | 'completed';
  order_index: number;
  created_at: string;
  updated_at: string;
  completed_at?: string;
}

export interface ProjectComment {
  id: string;
  service_request_id: string;
  user_id: string;
  content: string;
  comment_type: 'comment' | 'status_update' | 'milestone_update';
  metadata?: Record<string, any>;
  attachments?: string[];
  created_at: string;
  updated_at: string;
}

// Domain pages constant
export const DOMAIN_PAGES = {
  1: { name: 'Technology & Development', description: 'Software development, web design, mobile apps' },
  2: { name: 'Design & Creative', description: 'Graphic design, branding, content creation' },
  3: { name: 'Marketing & Strategy', description: 'Digital marketing, SEO, business strategy' },
  4: { name: 'Content & Writing', description: 'Copywriting, blogging, technical writing' },
  5: { name: 'Business & Operations', description: 'Consulting, project management, operations' },
  6: { name: 'Data & Analytics', description: 'Data analysis, research, business intelligence' }
};

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

export interface CreateProposalThreadData {
  service_request_id: string;
  organizer_id: string;
  service_provider_id: string;
}

export interface CreateProposalVersionData {
  thread_id: string;
  proposal_id: string;
  version_number: number;
  created_by: string;
  quote_amount?: number;
  timeline?: string;
  scope_details?: string;
  terms?: string;
  change_notes?: string;
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
  organizer_id: string;
  service_provider_id: string;
  completion_id: string;
  rating: number;
  feedback?: string;
}

export interface CreateProjectMilestoneData {
  service_request_id: string;
  title: string;
  description?: string;
  due_date?: string;
  order_index: number;
}

export interface CreateProjectCommentData {
  service_request_id: string;
  user_id: string;
  content: string;
  comment_type: 'comment' | 'status_update' | 'milestone_update';
  metadata?: Record<string, any>;
  attachments?: string[];
}
