
import { supabase } from "@/integrations/supabase/client";
import { 
  ServiceProvider, 
  Organizer, 
  ServiceRequest, 
  Proposal, 
  Deal,
  CreateServiceProviderData,
  CreateOrganizerData,
  CreateServiceRequestData,
  CreateProposalData,
  CreateDealData
} from "@/types/modul8";

// Helper function to transform database records to our types
const transformServiceProvider = (data: any): ServiceProvider => ({
  ...data,
  services: Array.isArray(data.services) ? data.services : [],
  tags: Array.isArray(data.tags) ? data.tags : [],
  pricing_range: typeof data.pricing_range === 'object' && data.pricing_range 
    ? data.pricing_range 
    : { min: undefined, max: undefined, currency: 'USD' },
  portfolio_links: Array.isArray(data.portfolio_links) ? data.portfolio_links : []
});

const transformServiceRequest = (data: any): ServiceRequest => ({
  ...data,
  budget_range: typeof data.budget_range === 'object' && data.budget_range 
    ? data.budget_range 
    : { min: undefined, max: undefined, currency: 'USD' },
  milestones: Array.isArray(data.milestones) ? data.milestones : [],
  service_provider: data.service_provider ? transformServiceProvider(data.service_provider) : undefined,
  organizer: data.organizer || undefined
});

// Service Provider Services
export const createServiceProvider = async (data: CreateServiceProviderData) => {
  const { data: result, error } = await supabase
    .from('modul8_service_providers')
    .insert({
      user_id: data.user_id,
      business_name: data.business_name,
      logo_url: data.logo_url,
      tagline: data.tagline,
      description: data.description,
      services: data.services || [],
      tags: data.tags || [],
      pricing_range: data.pricing_range || {},
      portfolio_links: data.portfolio_links || []
    })
    .select()
    .single();
  
  if (error) throw error;
  return transformServiceProvider(result);
};

export const getServiceProviders = async () => {
  const { data, error } = await supabase
    .from('modul8_service_providers')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data?.map(transformServiceProvider) || [];
};

export const getUserServiceProvider = async (userId: string) => {
  const { data, error } = await supabase
    .from('modul8_service_providers')
    .select('*')
    .eq('user_id', userId)
    .single();
  
  if (error && error.code !== 'PGRST116') throw error;
  return data ? transformServiceProvider(data) : null;
};

// Organizer Services
export const createOrganizer = async (data: CreateOrganizerData) => {
  const { data: result, error } = await supabase
    .from('modul8_organizers')
    .insert({
      user_id: data.user_id,
      organization_name: data.organization_name,
      logo_url: data.logo_url,
      description: data.description,
      focus_areas: data.focus_areas || []
    })
    .select()
    .single();
  
  if (error) throw error;
  return result as Organizer;
};

export const getOrganizers = async () => {
  const { data, error } = await supabase
    .from('modul8_organizers')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data as Organizer[];
};

export const getUserOrganizer = async (userId: string) => {
  const { data, error } = await supabase
    .from('modul8_organizers')
    .select('*')
    .eq('user_id', userId)
    .single();
  
  if (error && error.code !== 'PGRST116') throw error;
  return data as Organizer | null;
};

// Service Request Services
export const createServiceRequest = async (data: CreateServiceRequestData) => {
  const { data: result, error } = await supabase
    .from('modul8_service_requests')
    .insert({
      organizer_id: data.organizer_id,
      domain_page: data.domain_page,
      title: data.title,
      description: data.description,
      budget_range: data.budget_range || {},
      timeline: data.timeline,
      milestones: data.milestones || []
    })
    .select()
    .single();
  
  if (error) throw error;
  return transformServiceRequest(result);
};

export const getServiceRequests = async (filters?: {
  domain_page?: number;
  status?: string;
  engagement_status?: string;
}) => {
  let query = supabase
    .from('modul8_service_requests')
    .select(`
      *,
      service_provider:modul8_service_providers(*),
      organizer:modul8_organizers(*)
    `)
    .order('created_at', { ascending: false });

  if (filters?.domain_page) {
    query = query.eq('domain_page', filters.domain_page);
  }
  if (filters?.status) {
    query = query.eq('status', filters.status);
  }
  if (filters?.engagement_status) {
    query = query.eq('engagement_status', filters.engagement_status);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data?.map(transformServiceRequest) || [];
};

export const getOrganizerServiceRequests = async (organizerId: string) => {
  const { data, error } = await supabase
    .from('modul8_service_requests')
    .select(`
      *,
      service_provider:modul8_service_providers(*),
      organizer:modul8_organizers(*)
    `)
    .eq('organizer_id', organizerId)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data?.map(transformServiceRequest) || [];
};

export const updateServiceRequest = async (id: string, data: Partial<ServiceRequest>) => {
  const updateData: any = { ...data };
  delete updateData.id;
  delete updateData.created_at;
  delete updateData.service_provider;
  delete updateData.organizer;

  const { data: result, error } = await supabase
    .from('modul8_service_requests')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return transformServiceRequest(result);
};

// Proposal Services
export const createProposal = async (data: CreateProposalData) => {
  const { data: result, error } = await supabase
    .from('modul8_proposals')
    .insert({
      service_request_id: data.service_request_id,
      from_user_id: data.from_user_id,
      proposal_type: data.proposal_type,
      quote_amount: data.quote_amount,
      timeline: data.timeline,
      scope_details: data.scope_details,
      terms: data.terms
    })
    .select()
    .single();
  
  if (error) throw error;
  return result as Proposal;
};

export const getRequestProposals = async (serviceRequestId: string) => {
  const { data, error } = await supabase
    .from('modul8_proposals')
    .select('*')
    .eq('service_request_id', serviceRequestId)
    .order('created_at', { ascending: true });
  
  if (error) throw error;
  return data as Proposal[];
};

// Deal Services
export const createDeal = async (data: CreateDealData) => {
  const { data: result, error } = await supabase
    .from('modul8_deals')
    .insert({
      service_request_id: data.service_request_id,
      organizer_id: data.organizer_id,
      service_provider_id: data.service_provider_id,
      final_amount: data.final_amount,
      deal_terms: data.deal_terms,
      deel_contract_url: data.deel_contract_url
    })
    .select()
    .single();
  
  if (error) throw error;
  return result as Deal;
};

export const getDeals = async () => {
  const { data, error } = await supabase
    .from('modul8_deals')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data as Deal[];
};
