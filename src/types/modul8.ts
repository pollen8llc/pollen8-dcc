
export interface ServiceRequest {
  id: string;
  title: string;
  description?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled' | 'negotiating' | 'agreed' | 'declined';
  requester_id: string;
  provider_id?: string;
  service_provider_id?: string;
  created_at: string;
  updated_at: string;
  timeline?: string;
  budget_range?: {
    min?: number;
    max?: number;
    currency?: string;
  };
  milestones?: string[];
  project_progress?: number;
  organizer?: Organizer;
  service_provider?: ServiceProvider;
  organizer_id?: string;
  domain_page?: number;
  engagement_status?: string;
}

export interface ServiceProvider {
  id: string;
  user_id: string;
  business_name: string;
  description?: string;
  logo_url?: string;
  services?: any[];
  pricing_range?: any;
  portfolio_links?: string[];
  tags?: string[];
  tagline?: string;
  domain_specializations?: number[];
  created_at: string;
  updated_at: string;
}

export interface Organizer {
  id: string;
  user_id: string;
  organization_name: string;
  description?: string;
  logo_url?: string;
  focus_areas?: string[];
  created_at: string;
  updated_at: string;
}

export interface Proposal {
  id: string;
  service_request_id: string;
  from_user_id: string;
  proposal_type: 'initial' | 'counter';
  quote_amount?: number;
  timeline?: string;
  scope_details?: string;
  terms?: string;
  status: 'pending' | 'accepted' | 'rejected' | 'countered';
  created_at: string;
  service_provider?: ServiceProvider;
}

export interface ProposalThread {
  id: string;
  service_request_id: string;
  service_provider_id: string;
  organizer_id: string;
  status: 'active' | 'closed';
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

export interface ProjectDetails {
  id: string;
  service_request_id: string;
  name: string;
  description: string;
  status: 'active' | 'completed' | 'on_hold';
  progress: number;
  created_at: string;
  updated_at: string;
}

export interface ProjectRevision {
  id: string;
  service_request_id: string;
  revision_type: string;
  description: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  updated_at: string;
}

export interface ProjectCompletion {
  id: string;
  service_request_id: string;
  status: 'submitted' | 'confirmed';
  completion_notes?: string;
  submitted_at: string;
  confirmed_at?: string;
}

export interface ProjectRating {
  id: string;
  service_request_id: string;
  rating: number;
  feedback?: string;
  created_at: string;
}

export interface NegotiationStatus {
  id: string;
  service_request_id: string;
  current_status: string;
  previous_status?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface ActivityLogEntry {
  id: string;
  service_request_id: string;
  action: string;
  description: string;
  user_id: string;
  created_at: string;
  activity_type: string;
  activity_data?: any;
}

export interface CrossPlatformNotification {
  id: string;
  recipient_id: string;
  sender_id: string;
  service_request_id: string;
  notification_type: string;
  title: string;
  message: string;
  platform_context: 'modul8' | 'labr8';
  read_at?: string;
  created_at: string;
}

export interface ProjectComment {
  id: string;
  service_request_id: string;
  user_id: string;
  comment_type: 'comment' | 'status_update';
  content: string;
  metadata?: any;
  attachments?: any[];
  created_at: string;
  updated_at: string;
}

export const DOMAIN_PAGES = [
  { id: 1, name: 'Web Development' },
  { id: 2, name: 'Mobile App Development' },
  { id: 3, name: 'Design & Branding' },
  { id: 4, name: 'Digital Marketing' },
  { id: 5, name: 'Content Creation' }
];

export const DOMAIN_PAGES_MAP = {
  1: 'Web Development',
  2: 'Mobile App Development',
  3: 'Design & Branding',
  4: 'Digital Marketing',
  5: 'Content Creation'
} as const;
