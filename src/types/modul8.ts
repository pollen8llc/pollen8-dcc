
// Placeholder types for modul8 service types
export interface ServiceProvider {
  id: string;
  business_name: string;
  logo_url?: string;
  user_id: string;
}

export interface ServiceRequest {
  id: string;
  title: string;
  description: string;
  status: string;
  created_at: string;
  organizer_id: string;
  service_provider?: ServiceProvider;
}

export interface Proposal {
  id: string;
  service_request_id: string;
  service_provider_id: string;
  quote_amount?: number;
  timeline?: string;
  scope_details?: string;
  terms?: string;
  status: string;
  created_at: string;
  service_provider?: ServiceProvider;
}

export interface ContractData {
  clientName: string;
  providerName: string;
  projectTitle: string;
  projectDescription: string;
  amount: number;
  timeline: string;
  milestones: string[];
  terms: string;
}
