
import { supabase } from '@/integrations/supabase/client';

export const assignServiceProvider = async (requestId: string, providerId: string) => {
  const { data, error } = await supabase
    .from('modul8_service_requests')
    .update({ 
      service_provider_id: providerId,
      status: 'assigned',
      engagement_status: 'affiliated'
    })
    .eq('id', requestId);

  if (error) {
    console.error('Error assigning service provider:', error);
    throw error;
  }

  return data;
};

export const getServiceProviderByUserId = async (userId: string) => {
  const { data, error } = await supabase
    .from('modul8_service_providers')
    .select('id')
    .eq('user_id', userId)
    .single();

  if (error) {
    console.error('Error getting service provider:', error);
    throw error;
  }

  return data;
};
