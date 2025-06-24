
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

export const updateServiceRequestStatus = async (
  serviceRequestId: string,
  status: string,
  userId: string,
  fromStatus?: string,
  reason?: string
) => {
  // Update the service request status
  const { error: updateError } = await supabase
    .from('modul8_service_requests')
    .update({ status })
    .eq('id', serviceRequestId);

  if (updateError) throw updateError;

  // Log the status change
  const { error: logError } = await supabase
    .from('modul8_status_changes')
    .insert({
      service_request_id: serviceRequestId,
      user_id: userId,
      from_status: fromStatus,
      to_status: status,
      reason
    });

  if (logError) throw logError;

  // Create a comment for the status change
  await createServiceRequestComment({
    service_request_id: serviceRequestId,
    user_id: userId,
    comment_type: 'status_change',
    content: reason || `Status changed from ${fromStatus || 'unknown'} to ${status}`
  });
};
