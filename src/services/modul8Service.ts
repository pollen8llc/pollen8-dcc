
import { supabase } from "@/integrations/supabase/client";
import { ServiceProvider, Organizer, ServiceRequest, Proposal, Deal } from "@/types/modul8";

// Service Provider Services
export const createServiceProvider = async (data: Partial<ServiceProvider>) => {
  const { data: result, error } = await supabase
    .from('modul8_service_providers')
    .insert(data)
    .select()
    .single();
  
  if (error) throw error;
  return result;
};

export const getServiceProviders = async () => {
  const { data, error } = await supabase
    .from('modul8_service_providers')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data;
};

export const getUserServiceProvider = async (userId: string) => {
  const { data, error } = await supabase
    .from('modul8_service_providers')
    .select('*')
    .eq('user_id', userId)
    .single();
  
  if (error && error.code !== 'PGRST116') throw error;
  return data;
};

// Organizer Services
export const createOrganizer = async (data: Partial<Organizer>) => {
  const { data: result, error } = await supabase
    .from('modul8_organizers')
    .insert(data)
    .select()
    .single();
  
  if (error) throw error;
  return result;
};

export const getOrganizers = async () => {
  const { data, error } = await supabase
    .from('modul8_organizers')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data;
};

export const getUserOrganizer = async (userId: string) => {
  const { data, error } = await supabase
    .from('modul8_organizers')
    .select('*')
    .eq('user_id', userId)
    .single();
  
  if (error && error.code !== 'PGRST116') throw error;
  return data;
};

// Service Request Services
export const createServiceRequest = async (data: Partial<ServiceRequest>) => {
  const { data: result, error } = await supabase
    .from('modul8_service_requests')
    .insert(data)
    .select()
    .single();
  
  if (error) throw error;
  return result;
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
  return data;
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
  return data;
};

export const updateServiceRequest = async (id: string, data: Partial<ServiceRequest>) => {
  const { data: result, error } = await supabase
    .from('modul8_service_requests')
    .update(data)
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return result;
};

// Proposal Services
export const createProposal = async (data: Partial<Proposal>) => {
  const { data: result, error } = await supabase
    .from('modul8_proposals')
    .insert(data)
    .select()
    .single();
  
  if (error) throw error;
  return result;
};

export const getRequestProposals = async (serviceRequestId: string) => {
  const { data, error } = await supabase
    .from('modul8_proposals')
    .select('*')
    .eq('service_request_id', serviceRequestId)
    .order('created_at', { ascending: true });
  
  if (error) throw error;
  return data;
};

// Deal Services
export const createDeal = async (data: Partial<Deal>) => {
  const { data: result, error } = await supabase
    .from('modul8_deals')
    .insert(data)
    .select()
    .single();
  
  if (error) throw error;
  return result;
};

export const getDeals = async () => {
  const { data, error } = await supabase
    .from('modul8_deals')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data;
};
