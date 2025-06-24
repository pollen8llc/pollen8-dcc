
import { supabase } from "@/integrations/supabase/client";

export interface CreateServiceRequestCommentData {
  service_request_id: string;
  user_id: string;
  comment_type: 'general' | 'status_change';
  content: string;
  metadata?: Record<string, any>;
}

export interface ServiceRequestComment {
  id: string;
  service_request_id: string;
  user_id: string;
  comment_type: string;
  content: string;
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export const createServiceRequestComment = async (data: CreateServiceRequestCommentData): Promise<ServiceRequestComment> => {
  const { data: comment, error } = await supabase
    .from('modul8_service_request_comments')
    .insert(data)
    .select()
    .single();

  if (error) throw error;
  return comment as ServiceRequestComment;
};

export const getServiceRequestComments = async (serviceRequestId: string): Promise<ServiceRequestComment[]> => {
  const { data, error } = await supabase
    .from('modul8_service_request_comments')
    .select('*')
    .eq('service_request_id', serviceRequestId)
    .order('created_at', { ascending: true });

  if (error) throw error;
  return (data || []) as ServiceRequestComment[];
};

export const updateServiceRequestComment = async (
  commentId: string, 
  content: string
): Promise<ServiceRequestComment> => {
  const { data: comment, error } = await supabase
    .from('modul8_service_request_comments')
    .update({ content, updated_at: new Date().toISOString() })
    .eq('id', commentId)
    .select()
    .single();

  if (error) throw error;
  return comment as ServiceRequestComment;
};

export const deleteServiceRequestComment = async (commentId: string): Promise<void> => {
  const { error } = await supabase
    .from('modul8_service_request_comments')
    .delete()
    .eq('id', commentId);

  if (error) throw error;
};
