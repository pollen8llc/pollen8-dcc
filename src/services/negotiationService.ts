import { supabase } from "@/integrations/supabase/client";
import { ServiceRequest } from "@/types/modul8";

export const getNegotiationServiceRequest = async (requestId: string): Promise<ServiceRequest | null> => {
  const { data, error } = await supabase
    .from('modul8_service_requests')
    .select(`
      *,
      service_provider:modul8_service_providers(*),
      organizer:modul8_organizers(*)
    `)
    .eq('id', requestId)
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
    } : undefined
  } as ServiceRequest;
};

export const checkExistingRequest = async (organizerId: string, providerId: string): Promise<ServiceRequest | null> => {
  const { data, error } = await supabase
    .from('modul8_service_requests')
    .select(`
      *,
      service_provider:modul8_service_providers(*),
      organizer:modul8_organizers(*)
    `)
    .eq('organizer_id', organizerId)
    .eq('service_provider_id', providerId)
    .order('created_at', { ascending: false })
    .limit(1)
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
    } : undefined
  } as ServiceRequest;
};