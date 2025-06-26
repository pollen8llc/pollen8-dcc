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
    budget_range: data.budget_range as { min?: number; max?: number; currency: string; },
    milestones: data.milestones as string[],
    service_provider: data.service_provider ? {
      ...data.service_provider,
      services: Array.isArray(data.service_provider.services) ? data.service_provider.services : [],
      pricing_range: data.service_provider.pricing_range as { min?: number; max?: number; currency: string; }
    } : undefined
  } as ServiceRequest;
};
