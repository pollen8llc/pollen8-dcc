
import { supabase } from "@/integrations/supabase/client";

export const getServiceRequestComments = async (serviceRequestId: string) => {
  const { data, error } = await supabase
    .from('modul8_service_request_comments')
    .select('*')
    .eq('service_request_id', serviceRequestId)
    .order('created_at', { ascending: true });
  
  if (error) throw error;
  return data || [];
};

export const createServiceRequestComment = async (commentData: {
  service_request_id: string;
  user_id: string;
  comment_type: string;
  content: string;
}) => {
  const { data, error } = await supabase
    .from('modul8_service_request_comments')
    .insert(commentData)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};
