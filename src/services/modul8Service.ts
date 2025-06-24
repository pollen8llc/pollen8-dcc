import { supabase } from "@/integrations/supabase/client";
import { 
  ServiceProvider, 
  ServiceRequest, 
  Organizer,
  Proposal,
  CreateServiceProviderData,
  CreateOrganizerData,
  CreateServiceRequestData,
  CreateProposalData
} from "@/types/modul8";

export const createServiceProvider = async (data: CreateServiceProviderData): Promise<ServiceProvider> => {
  const { data: provider, error } = await supabase
    .from('modul8_service_providers')
    .insert(data)
    .select()
    .single();
  
  if (error) throw error;
  return {
    ...provider,
    services: Array.isArray(provider.services) ? provider.services : [],
    pricing_range: provider.pricing_range as { min?: number; max?: number; currency: string; }
  } as ServiceProvider;
};

export const updateServiceProvider = async (id: string, data: Partial<CreateServiceProviderData>): Promise<ServiceProvider> => {
  const { data: provider, error } = await supabase
    .from('modul8_service_providers')
    .update(data)
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return {
    ...provider,
    services: Array.isArray(provider.services) ? provider.services : [],
    pricing_range: provider.pricing_range as { min?: number; max?: number; currency: string; }
  } as ServiceProvider;
};

export const getUserServiceProvider = async (userId: string): Promise<ServiceProvider | null> => {
  const { data, error } = await supabase
    .from('modul8_service_providers')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();
  
  if (error) throw error;
  if (!data) return null;
  
  return {
    ...data,
    services: Array.isArray(data.services) ? data.services : [],
    pricing_range: data.pricing_range as { min?: number; max?: number; currency: string; }
  } as ServiceProvider;
};

export const createOrganizer = async (data: CreateOrganizerData): Promise<Organizer> => {
  const { data: organizer, error } = await supabase
    .from('modul8_organizers')
    .insert(data)
    .select()
    .single();
  
  if (error) throw error;
  return organizer;
};

export const updateOrganizer = async (id: string, data: Partial<CreateOrganizerData>): Promise<Organizer> => {
  const { data: organizer, error } = await supabase
    .from('modul8_organizers')
    .update(data)
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return organizer;
};

export const getUserOrganizer = async (userId: string): Promise<Organizer | null> => {
  const { data, error } = await supabase
    .from('modul8_organizers')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();
  
  if (error) throw error;
  return data;
};

export const createServiceRequest = async (data: CreateServiceRequestData & { 
  service_provider_id?: string;
  status?: string;
  engagement_status?: string;
}): Promise<ServiceRequest> => {
  console.log('Creating service request with data:', data);
  
  const { data: request, error } = await supabase
    .from('modul8_service_requests')
    .insert(data)
    .select(`
      *,
      service_provider:modul8_service_providers(*),
      organizer:modul8_organizers(*)
    `)
    .single();
  
  if (error) throw error;
  
  // If assigned to a specific provider, use the new assignment function
  if (data.service_provider_id) {
    console.log('Assigning request to provider:', data.service_provider_id);
    const { error: assignError } = await supabase.rpc('assign_request_to_provider', {
      p_service_request_id: request.id,
      p_service_provider_id: data.service_provider_id
    });
    
    if (assignError) {
      console.error('Error assigning request to provider:', assignError);
    } else {
      console.log('Successfully assigned request to provider');
    }
  }
  
  return {
    ...request,
    budget_range: request.budget_range as { min?: number; max?: number; currency: string; },
    milestones: request.milestones as string[]
  } as ServiceRequest;
};

export const updateServiceRequest = async (
  id: string, 
  data: Partial<ServiceRequest>
): Promise<ServiceRequest> => {
  const { data: request, error } = await supabase
    .from('modul8_service_requests')
    .update(data)
    .eq('id', id)
    .select(`
      *,
      service_provider:modul8_service_providers(*),
      organizer:modul8_organizers(*)
    `)
    .single();
  
  if (error) throw error;
  
  return {
    ...request,
    budget_range: request.budget_range as { min?: number; max?: number; currency: string; },
    milestones: request.milestones as string[]
  } as ServiceRequest;
};

export const getServiceRequestById = async (id: string): Promise<ServiceRequest | null> => {
  const { data, error } = await supabase
    .from('modul8_service_requests')
    .select(`
      *,
      service_provider:modul8_service_providers(*),
      organizer:modul8_organizers(*)
    `)
    .eq('id', id)
    .maybeSingle();
  
  if (error) throw error;
  
  if (!data) return null;
  
  return {
    ...data,
    budget_range: data.budget_range as { min?: number; max?: number; currency: string; },
    milestones: data.milestones as string[]
  } as ServiceRequest;
};

export const deleteServiceRequest = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('modul8_service_requests')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
};

export const getOrganizerServiceRequests = async (organizerId: string): Promise<ServiceRequest[]> => {
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
  
  return (data || []).map(request => ({
    ...request,
    budget_range: request.budget_range as { min?: number; max?: number; currency: string; },
    milestones: request.milestones as string[]
  })) as ServiceRequest[];
};

export const getProviderServiceRequests = async (serviceProviderId: string): Promise<ServiceRequest[]> => {
  console.log('Getting service requests for provider:', serviceProviderId);
  
  const { data, error } = await supabase
    .from('modul8_service_requests')
    .select(`
      *,
      organizer:modul8_organizers(*)
    `)
    .eq('service_provider_id', serviceProviderId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching provider service requests:', error);
    throw error;
  }

  console.log('Provider service requests found:', data?.length || 0);
  
  return (data || []).map(request => ({
    ...request,
    budget_range: request.budget_range as { min?: number; max?: number; currency: string; },
    milestones: request.milestones as string[]
  })) as ServiceRequest[];
};

export const getAvailableServiceRequestsForProvider = async (providerId: string): Promise<ServiceRequest[]> => {
  console.log('Loading available service requests (open market)');
  
  const { data, error } = await supabase
    .from('modul8_service_requests')
    .select(`
      *,
      service_provider:modul8_service_providers(*),
      organizer:modul8_organizers(*)
    `)
    .is('service_provider_id', null)
    .eq('status', 'pending')
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error loading available requests:', error);
    throw error;
  }
  
  console.log('Available requests loaded:', data?.length || 0, 'requests');
  
  return (data || []).map(request => ({
    ...request,
    budget_range: request.budget_range as { min?: number; max?: number; currency: string; },
    milestones: request.milestones as string[]
  })) as ServiceRequest[];
};

export const getAllServiceRequests = async (): Promise<ServiceRequest[]> => {
  const { data, error } = await supabase
    .from('modul8_service_requests')
    .select(`
      *,
      service_provider:modul8_service_providers(*),
      organizer:modul8_organizers(*)
    `)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  
  return (data || []).map(request => ({
    ...request,
    budget_range: request.budget_range as { min?: number; max?: number; currency: string; },
    milestones: request.milestones as string[]
  })) as ServiceRequest[];
};

export const createProposal = async (data: CreateProposalData): Promise<Proposal> => {
  const { data: proposal, error } = await supabase
    .from('modul8_proposals')
    .insert(data)
    .select()
    .single();
  
  if (error) throw error;
  return {
    ...proposal,
    proposal_type: proposal.proposal_type as 'initial' | 'counter' | 'revision'
  } as Proposal;
};

export const getServiceRequestProposals = async (serviceRequestId: string): Promise<Proposal[]> => {
  const { data, error } = await supabase
    .from('modul8_proposals')
    .select('*')
    .eq('service_request_id', serviceRequestId)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return (data || []).map(proposal => ({
    ...proposal,
    proposal_type: proposal.proposal_type as 'initial' | 'counter' | 'revision'
  })) as Proposal[];
};

export const getServiceProviders = async (): Promise<ServiceProvider[]> => {
  const { data, error } = await supabase
    .from('modul8_service_providers')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return (data || []).map(provider => ({
    ...provider,
    services: Array.isArray(provider.services) ? provider.services : [],
    pricing_range: provider.pricing_range as { min?: number; max?: number; currency: string; }
  })) as ServiceProvider[];
};

export const getServiceProviderById = async (id: string): Promise<ServiceProvider | null> => {
  const { data, error } = await supabase
    .from('modul8_service_providers')
    .select('*')
    .eq('id', id)
    .maybeSingle();
  
  if (error) throw error;
  if (!data) return null;
  
  return {
    ...data,
    services: Array.isArray(data.services) ? data.services : [],
    pricing_range: data.pricing_range as { min?: number; max?: number; currency: string; }
  } as ServiceProvider;
};

export const getServiceProvidersByDomain = async (domainId: number): Promise<ServiceProvider[]> => {
  const { data, error } = await supabase
    .from('modul8_service_providers')
    .select('*')
    .contains('domain_specializations', [domainId])
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return (data || []).map(provider => ({
    ...provider,
    services: Array.isArray(provider.services) ? provider.services : [],
    pricing_range: provider.pricing_range as { min?: number; max?: number; currency: string; }
  })) as ServiceProvider[];
};

export const getRequestProposals = getServiceRequestProposals;
export const getProposalsByRequestId = getServiceRequestProposals;
export const getServiceRequests = getAllServiceRequests;

export const assignServiceProvider = async (requestId: string, providerId: string): Promise<void> => {
  const { error } = await supabase.rpc('assign_request_to_provider', {
    p_service_request_id: requestId,
    p_service_provider_id: providerId
  });
  
  if (error) throw error;
};

export const closeServiceRequest = async (requestId: string): Promise<void> => {
  const { error } = await supabase
    .from('modul8_service_requests')
    .update({ status: 'cancelled' })
    .eq('id', requestId);
  
  if (error) throw error;
};
