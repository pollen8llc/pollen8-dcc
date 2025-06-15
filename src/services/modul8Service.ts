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
      portfolio_links: data.portfolio_links || [],
      domain_specializations: data.domain_specializations || []
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

// Add new function to get service provider by ID
export const getServiceProviderById = async (providerId: string) => {
  const { data, error } = await supabase
    .from('modul8_service_providers')
    .select('*')
    .eq('id', providerId)
    .single();
  
  if (error && error.code !== 'PGRST116') throw error;
  return data ? transformServiceProvider(data) : null;
};

// Enhanced service request retrieval with domain filtering
export const getServiceRequestsByDomain = async (domainId: number) => {
  const { data, error } = await supabase
    .from('modul8_service_requests')
    .select(`
      *,
      service_provider:modul8_service_providers(*),
      organizer:modul8_organizers(*)
    `)
    .eq('domain_page', domainId)
    .eq('status', 'pending')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data?.map(transformServiceRequest) || [];
};

// Get service providers by domain
export const getServiceProvidersByDomain = async (domainId: number) => {
  const { data, error } = await supabase
    .from('modul8_service_providers')
    .select('*')
    .contains('domain_specializations', [domainId])
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data?.map(transformServiceProvider) || [];
};

// Create engagement tracking
export const createEngagement = async (data: {
  organizer_id: string;
  service_provider_id: string;
  service_request_id?: string;
  engagement_type: 'view_profile' | 'engage' | 'proposal_sent';
}) => {
  const { data: result, error } = await supabase
    .from('modul8_engagements')
    .insert(data)
    .select()
    .single();
  
  if (error) throw error;
  return result;
};

// Create notification
export const createNotification = async (data: {
  user_id: string;
  type: 'service_request' | 'proposal_update' | 'deal_locked';
  title: string;
  message: string;
  data?: any;
}) => {
  const { data: result, error } = await supabase
    .from('modul8_notifications')
    .insert({
      user_id: data.user_id,
      type: data.type,
      title: data.title,
      message: data.message,
      data: data.data || {}
    })
    .select()
    .single();
  
  if (error) throw error;
  return result;
};

// Get user notifications
export const getUserNotifications = async (userId: string) => {
  const { data, error } = await supabase
    .from('modul8_notifications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data;
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

// Service Request Services - Updated to support direct provider assignment
export const createServiceRequest = async (data: CreateServiceRequestData & {
  service_provider_id?: string;
  status?: string;
  engagement_status?: string;
}) => {
  const { data: result, error } = await supabase
    .from('modul8_service_requests')
    .insert({
      organizer_id: data.organizer_id,
      domain_page: data.domain_page,
      title: data.title,
      description: data.description,
      budget_range: data.budget_range || {},
      timeline: data.timeline,
      milestones: data.milestones || [],
      service_provider_id: data.service_provider_id || null,
      status: data.status || 'pending',
      engagement_status: data.engagement_status || 'none'
    })
    .select()
    .single();
  
  if (error) throw error;
  return transformServiceRequest(result);
};

// Get service requests assigned to a specific provider
export const getProviderServiceRequests = async (providerId: string) => {
  const { data, error } = await supabase
    .from('modul8_service_requests')
    .select(`
      *,
      service_provider:modul8_service_providers(*),
      organizer:modul8_organizers(*)
    `)
    .eq('service_provider_id', providerId)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data?.map(transformServiceRequest) || [];
};

// Get available service requests for a provider (by domain specialization)
export const getAvailableServiceRequestsForProvider = async (providerId: string) => {
  // First get the provider's domain specializations
  const { data: provider, error: providerError } = await supabase
    .from('modul8_service_providers')
    .select('domain_specializations')
    .eq('id', providerId)
    .single();
  
  if (providerError) throw providerError;
  
  if (!provider?.domain_specializations || provider.domain_specializations.length === 0) {
    return [];
  }

  const { data, error } = await supabase
    .from('modul8_service_requests')
    .select(`
      *,
      service_provider:modul8_service_providers(*),
      organizer:modul8_organizers(*)
    `)
    .in('domain_page', provider.domain_specializations)
    .is('service_provider_id', null)
    .eq('status', 'pending')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data?.map(transformServiceRequest) || [];
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

// Fixed assign service provider to use the correct user ID mapping
export const assignServiceProvider = async (serviceRequestId: string, proposalId: string) => {
  // Get the proposal to find the service provider user
  const { data: proposal, error: proposalError } = await supabase
    .from('modul8_proposals')
    .select('from_user_id')
    .eq('id', proposalId)
    .single();
  
  if (proposalError) throw proposalError;
  if (!proposal) throw new Error('Proposal not found');

  // Get the service provider record from the user ID
  const { data: serviceProvider, error: providerError } = await supabase
    .from('modul8_service_providers')
    .select('id')
    .eq('user_id', proposal.from_user_id)
    .single();
  
  if (providerError) throw providerError;
  if (!serviceProvider) throw new Error('Service provider not found for this user');

  // Update the service request with the service provider assignment
  const { data: result, error } = await supabase
    .from('modul8_service_requests')
    .update({
      service_provider_id: serviceProvider.id,
      engagement_status: 'affiliated',
      status: 'assigned'
    })
    .eq('id', serviceRequestId)
    .select(`
      *,
      service_provider:modul8_service_providers(*),
      organizer:modul8_organizers(*)
    `)
    .single();
  
  if (error) throw error;

  // Update the proposal status to accepted
  await supabase
    .from('modul8_proposals')
    .update({ status: 'accepted' })
    .eq('id', proposalId);

  return transformServiceRequest(result);
};

// Close a service request (set status to cancelled)
export const closeServiceRequest = async (id: string) => {
  const { data: result, error } = await supabase
    .from('modul8_service_requests')
    .update({ status: 'cancelled' })
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return transformServiceRequest(result);
};

// Delete a service request completely
export const deleteServiceRequest = async (id: string) => {
  const { error } = await supabase
    .from('modul8_service_requests')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
  return true;
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

// Enhanced proposal retrieval with proper typing
export const getRequestProposals = async (serviceRequestId: string) => {
  const { data, error } = await supabase
    .from('modul8_proposals')
    .select(`
      id,
      service_request_id,
      from_user_id,
      proposal_type,
      quote_amount,
      timeline,
      scope_details,
      terms,
      status,
      created_at,
      service_provider:modul8_service_providers!inner(
        id,
        user_id,
        business_name,
        logo_url,
        tagline
      )
    `)
    .eq('service_request_id', serviceRequestId)
    .order('created_at', { ascending: true });
  
  if (error) throw error;
  
  // Transform the data to match our Proposal type with service provider info
  return (data || []).map(item => ({
    ...item,
    proposal_type: item.proposal_type as 'initial' | 'counter' | 'revision',
    status: item.status as 'pending' | 'accepted' | 'rejected' | 'submitted' | 'countered',
    service_provider: Array.isArray(item.service_provider) 
      ? item.service_provider[0] 
      : item.service_provider
  }));
};

// Enhanced proposal acceptance function
export const acceptProposal = async (proposalId: string, serviceRequestId: string) => {
  return await assignServiceProvider(serviceRequestId, proposalId);
};

// Decline proposal function
export const declineProposal = async (proposalId: string) => {
  const { data, error } = await supabase
    .from('modul8_proposals')
    .update({ status: 'rejected' })
    .eq('id', proposalId)
    .select()
    .single();
  
  if (error) throw error;
  return data;
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

export const deleteProposal = async (proposalId: string): Promise<void> => {
  const { error } = await supabase
    .from('modul8_proposals')
    .delete()
    .eq('id', proposalId);
  
  if (error) throw error;
};

// Get existing service request between organizer and service provider
export const getExistingServiceRequest = async (organizerId: string, serviceProviderId: string) => {
  const { data, error } = await supabase
    .from('modul8_service_requests')
    .select(`
      *,
      service_provider:modul8_service_providers(*),
      organizer:modul8_organizers(*)
    `)
    .eq('organizer_id', organizerId)
    .eq('service_provider_id', serviceProviderId)
    .single();
  
  if (error && error.code !== 'PGRST116') throw error;
  return data ? transformServiceRequest(data) : null;
};

// Get service request by ID
export const getServiceRequestById = async (serviceRequestId: string) => {
  const { data, error } = await supabase
    .from('modul8_service_requests')
    .select(`
      *,
      service_provider:modul8_service_providers(*),
      organizer:modul8_organizers(*)
    `)
    .eq('id', serviceRequestId)
    .single();
  
  if (error && error.code !== 'PGRST116') throw error;
  return data ? transformServiceRequest(data) : null;
};
