
import { supabase } from '@/integrations/supabase/client';

export const assignServiceProvider = async (requestId: string, providerId: string) => {
  const { data, error } = await supabase
    .from('modul8_service_requests')
    .update({ 
      service_provider_id: providerId,
      status: 'assigned'
    })
    .eq('id', requestId);

  if (error) {
    console.error('Error assigning service provider:', error);
    throw error;
  }

  return data;
};
