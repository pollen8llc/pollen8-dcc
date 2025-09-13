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
  // Map the data to match database column names
  const insertData = {
    user_id: data.user_id,
    business_name: data.business_name,
    tagline: data.tagline,
    description: data.description,
    logo_url: data.logo_url,
    services: data.services || [],
    services_offered: data.services || [],
    tags: data.tags || [],
    pricing_range: data.pricing_range || { currency: 'USD' },
    portfolio_links: data.portfolio_links || [],
    domain_specializations: data.domain_specializations || []
  };

  const { data: provider, error } = await supabase
    .from('modul8_service_providers')
    .insert(insertData)
    .select()
    .single();
  
  if (error) throw error;
  
  return {
    ...provider,
    services: Array.isArray(provider.services) ? provider.services : (Array.isArray(provider.services_offered) ? provider.services_offered : []),
    pricing_range: (typeof provider.pricing_range === 'object' && provider.pricing_range !== null) 
      ? provider.pricing_range as { min?: number; max?: number; currency: string; }
      : { currency: 'USD' },
    tags: provider.tags || [],
    domain_specializations: provider.domain_specializations || []
  } as ServiceProvider;
};

export const updateServiceProvider = async (id: string, data: Partial<CreateServiceProviderData>): Promise<ServiceProvider> => {
  // Map the data to match database column names
  const updateData: any = {};
  if (data.business_name) updateData.business_name = data.business_name;
  if (data.tagline !== undefined) updateData.tagline = data.tagline;
  if (data.description !== undefined) updateData.description = data.description;
  if (data.logo_url !== undefined) updateData.logo_url = data.logo_url;
  if (data.services !== undefined) {
    updateData.services = data.services;
    updateData.services_offered = data.services;
  }
  if (data.tags !== undefined) updateData.tags = data.tags;
  if (data.pricing_range !== undefined) updateData.pricing_range = data.pricing_range;
  if (data.portfolio_links !== undefined) updateData.portfolio_links = data.portfolio_links;
  if (data.domain_specializations !== undefined) updateData.domain_specializations = data.domain_specializations;

  const { data: provider, error } = await supabase
    .from('modul8_service_providers')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  
  return {
    ...provider,
    services: Array.isArray(provider.services_offered) ? provider.services_offered : [],
    pricing_range: (typeof provider.pricing_range === 'object' && provider.pricing_range !== null) 
      ? provider.pricing_range as { min?: number; max?: number; currency: string; }
      : { currency: 'USD' },
    tags: provider.tags || [],
    domain_specializations: provider.domain_specializations || []
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
    services: Array.isArray(data.services_offered) ? data.services_offered : [],
    pricing_range: (typeof data.pricing_range === 'object' && data.pricing_range !== null) 
      ? data.pricing_range as { min?: number; max?: number; currency: string; }
      : { currency: 'USD' },
    tags: data.tags || [],
    domain_specializations: data.domain_specializations || []
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
  
  const { data: request, error } = await (supabase as any)
    .from('modul8_service_requests')
    .insert({
      ...data,
      budget_range: JSON.stringify(data.budget_range)
    })
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
    budget_range: typeof request.budget_range === 'string' ? JSON.parse(request.budget_range) : request.budget_range,
    milestones: [],
    service_provider: request.service_provider ? {
      ...request.service_provider,
      services: Array.isArray(request.service_provider.services_offered) ? request.service_provider.services_offered : [],
      pricing_range: { currency: 'USD' },
      tags: [],
      domain_specializations: []
    } : undefined
  } as ServiceRequest;
};

export const updateServiceRequest = async (
  id: string, 
  data: Partial<ServiceRequest>
): Promise<ServiceRequest> => {
  const updateData = {
    ...data,
    budget_range: data.budget_range ? JSON.stringify(data.budget_range) : undefined
  };
  const { data: request, error } = await supabase
    .from('modul8_service_requests')
    .update(updateData as any)
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
    budget_range: typeof request.budget_range === 'string' ? JSON.parse(request.budget_range) : request.budget_range,
    milestones: [],
    service_provider: request.service_provider ? {
      ...request.service_provider,
      services: Array.isArray(request.service_provider.services_offered) ? request.service_provider.services_offered : [],
      pricing_range: { currency: 'USD' },
      tags: [],
      domain_specializations: []
    } : undefined
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
    budget_range: typeof data.budget_range === 'string' ? JSON.parse(data.budget_range) : { currency: 'USD' },
    milestones: [],
    service_provider: data.service_provider ? {
      ...data.service_provider,
      services: Array.isArray(data.service_provider.services_offered) ? data.service_provider.services_offered : [],
      pricing_range: { currency: 'USD' },
      tags: [],
      domain_specializations: []
    } as any : undefined,
    organizer: data.organizer
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
  
  return ((data || []) as any[]).map(request => ({
    ...request,
    budget_range: typeof request.budget_range === 'string' ? JSON.parse(request.budget_range) : { currency: 'USD' },
    milestones: [],
    service_provider: request.service_provider ? {
      ...request.service_provider,
      services: Array.isArray(request.service_provider.services_offered) ? request.service_provider.services_offered : [],
      pricing_range: { currency: 'USD' },
      tags: [],
      domain_specializations: []
    } : undefined
  })) as ServiceRequest[];
};

export const getProviderServiceRequests = async (providerId: string): Promise<ServiceRequest[]> => {
  try {
    const { data, error } = await supabase
      .from('modul8_service_requests')
      .select(`
        *,
        organizer:modul8_organizers(*),
        service_provider:modul8_service_providers(*)
      `)
      .eq('service_provider_id', providerId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching provider service requests:', error);
      throw error;
    }

    return ((data || []) as any[]).map(request => ({
      ...request,
      budget_range: typeof request.budget_range === 'string' ? JSON.parse(request.budget_range) : { currency: 'USD' },
      milestones: [],
      service_provider: request.service_provider ? {
        ...request.service_provider,
        services: Array.isArray(request.service_provider.services_offered) ? request.service_provider.services_offered : [],
        pricing_range: { currency: 'USD' },
        tags: [],
        domain_specializations: []
      } : undefined
    })) as ServiceRequest[];
  } catch (error) {
    console.error('Error in getProviderServiceRequests:', error);
    throw error;
  }
};

export const getAvailableServiceRequestsForProvider = async (providerId: string): Promise<ServiceRequest[]> => {
  try {
    // Get the current user's service provider record to check their user_id
    const { data: providerData, error: providerError } = await supabase
      .from('modul8_service_providers')
      .select('user_id')
      .eq('id', providerId)
      .single();

    if (providerError) {
      console.error('Error fetching provider data:', providerError);
      throw providerError;
    }

    // Get requests that are available (no service provider assigned yet) and status is pending
    const { data, error } = await supabase
      .from('modul8_service_requests')
      .select(`
        *,
        organizer:modul8_organizers(*),
        service_provider:modul8_service_providers(*)
      `)
      .is('service_provider_id', null)
      .eq('status', 'pending')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching available service requests:', error);
      throw error;
    }

    return ((data || []) as any[]).map(request => ({
      ...request,
      budget_range: typeof request.budget_range === 'string' ? JSON.parse(request.budget_range) : { currency: 'USD' },
      milestones: [],
      service_provider: request.service_provider ? {
        ...request.service_provider,
        services: Array.isArray(request.service_provider.services_offered) ? request.service_provider.services_offered : [],
        pricing_range: { currency: 'USD' },
        tags: [],
        domain_specializations: []
      } : undefined
    })) as ServiceRequest[];
  } catch (error) {
    console.error('Error in getAvailableServiceRequestsForProvider:', error);
    throw error;
  }
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
  
  return ((data || []) as any[]).map(request => ({
    ...request,
    budget_range: typeof request.budget_range === 'string' ? JSON.parse(request.budget_range) : { currency: 'USD' },
    milestones: [],
    service_provider: request.service_provider ? {
      ...request.service_provider,
      services: Array.isArray(request.service_provider.services_offered) ? request.service_provider.services_offered : [],
      pricing_range: { currency: 'USD' },
      tags: [],
      domain_specializations: []
    } : undefined
  })) as ServiceRequest[];
};

export const createProposal = async (data: CreateProposalData): Promise<Proposal> => {
  const { data: proposal, error } = await (supabase as any)
    .from('modul8_proposals')
    .insert(data)
    .select()
    .single();
  
  if (error) throw error;
  return proposal as Proposal;
};

export const getServiceRequestProposals = async (serviceRequestId: string): Promise<Proposal[]> => {
  const { data, error } = await (supabase as any)
    .from('modul8_proposals')
    .select('*')
    .eq('service_request_id', serviceRequestId)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return (data || []) as Proposal[];
};

export const getServiceProviders = async (): Promise<ServiceProvider[]> => {
  const { data, error } = await supabase
    .from('modul8_service_providers')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return ((data || []) as any[]).map(provider => ({
    ...provider,
    services: Array.isArray(provider.services_offered) ? provider.services_offered : [],
    pricing_range: { currency: 'USD' },
    tags: [],
    domain_specializations: []
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
    services: Array.isArray(data.services_offered) ? data.services_offered : [],
    pricing_range: { currency: 'USD' },
    tags: [],
    domain_specializations: []
  } as ServiceProvider;
};

export const getServiceProvidersByDomain = async (domainId: number): Promise<ServiceProvider[]> => {
  const { data, error } = await supabase
    .from('modul8_service_providers')
    .select('*')
    .contains('domain_specializations', [domainId])
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return ((data || []) as any[]).map(provider => ({
    ...provider,
    services: Array.isArray(provider.services_offered) ? provider.services_offered : [],
    pricing_range: { currency: 'USD' },
    tags: [],
    domain_specializations: []
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