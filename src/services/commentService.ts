
import { supabase } from "@/integrations/supabase/client";
import { 
  ServiceRequestComment, 
  StatusChange,
  CreateServiceRequestCommentData,
  CreateStatusChangeData
} from "@/types/modul8";

// Service Request Comment Services
export const createServiceRequestComment = async (data: CreateServiceRequestCommentData): Promise<ServiceRequestComment> => {
  const { data: result, error } = await supabase
    .from('modul8_service_request_comments')
    .insert(data)
    .select()
    .single();
  
  if (error) throw error;
  return result as ServiceRequestComment;
};

export const getServiceRequestComments = async (serviceRequestId: string): Promise<ServiceRequestComment[]> => {
  const { data, error } = await supabase
    .from('modul8_service_request_comments')
    .select('*')
    .eq('service_request_id', serviceRequestId)
    .order('created_at', { ascending: true });
  
  if (error) throw error;
  return data as ServiceRequestComment[];
};

export const updateServiceRequestComment = async (commentId: string, content: string): Promise<ServiceRequestComment> => {
  const { data, error } = await supabase
    .from('modul8_service_request_comments')
    .update({ content, updated_at: new Date().toISOString() })
    .eq('id', commentId)
    .select()
    .single();
  
  if (error) throw error;
  return data as ServiceRequestComment;
};

export const deleteServiceRequestComment = async (commentId: string): Promise<void> => {
  const { error } = await supabase
    .from('modul8_service_request_comments')
    .delete()
    .eq('id', commentId);
  
  if (error) throw error;
};

// Status Change Services
export const createStatusChange = async (data: CreateStatusChangeData): Promise<StatusChange> => {
  const { data: result, error } = await supabase
    .from('modul8_status_changes')
    .insert(data)
    .select()
    .single();
  
  if (error) throw error;
  return result as StatusChange;
};

export const getStatusChanges = async (serviceRequestId: string): Promise<StatusChange[]> => {
  const { data, error } = await supabase
    .from('modul8_status_changes')
    .select('*')
    .eq('service_request_id', serviceRequestId)
    .order('created_at', { ascending: true });
  
  if (error) throw error;
  return data as StatusChange[];
};

// Combined function to update service request status and create status change log
export const updateServiceRequestStatus = async (
  serviceRequestId: string, 
  newStatus: string, 
  userId: string,
  currentStatus?: string,
  reason?: string
): Promise<void> => {
  // Update service request status
  const { error: updateError } = await supabase
    .from('modul8_service_requests')
    .update({ status: newStatus, updated_at: new Date().toISOString() })
    .eq('id', serviceRequestId);

  if (updateError) throw updateError;

  // Create status change log
  await createStatusChange({
    service_request_id: serviceRequestId,
    user_id: userId,
    from_status: currentStatus,
    to_status: newStatus,
    reason
  });

  // Create system notification comment
  let statusMessage = `Status changed from ${currentStatus || 'unknown'} to ${newStatus}`;
  if (reason) {
    statusMessage += `: ${reason}`;
  }

  await createServiceRequestComment({
    service_request_id: serviceRequestId,
    user_id: userId,
    comment_type: 'status_change',
    content: statusMessage,
    metadata: { from_status: currentStatus, to_status: newStatus }
  });
};
