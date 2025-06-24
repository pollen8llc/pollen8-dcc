
import { supabase } from "@/integrations/supabase/client";
import { 
  ProjectRevision,
  ProjectCompletion,
  ProjectRating,
  ProjectMilestone,
  CreateProjectRevisionData,
  CreateProjectCompletionData,
  CreateProjectRatingData,
  CreateProjectMilestoneData
} from "@/types/modul8";

// Project Revision Services
export const createProjectRevision = async (data: CreateProjectRevisionData): Promise<ProjectRevision> => {
  const { data: result, error } = await supabase
    .from('modul8_project_revisions')
    .insert(data)
    .select()
    .single();
  
  if (error) throw error;
  return result as ProjectRevision;
};

export const getProjectRevisions = async (serviceRequestId: string): Promise<ProjectRevision[]> => {
  const { data, error } = await supabase
    .from('modul8_project_revisions')
    .select('*')
    .eq('service_request_id', serviceRequestId)
    .order('created_at', { ascending: true });
  
  if (error) throw error;
  return data as ProjectRevision[];
};

export const updateRevisionStatus = async (revisionId: string, status: 'pending' | 'addressed' | 'accepted'): Promise<ProjectRevision> => {
  const { data, error } = await supabase
    .from('modul8_project_revisions')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', revisionId)
    .select()
    .single();
  
  if (error) throw error;
  return data as ProjectRevision;
};

// Project Completion Services
export const createProjectCompletion = async (data: CreateProjectCompletionData): Promise<ProjectCompletion> => {
  const { data: result, error } = await supabase
    .from('modul8_project_completions')
    .insert(data)
    .select()
    .single();
  
  if (error) throw error;
  return result as ProjectCompletion;
};

export const getProjectCompletion = async (serviceRequestId: string): Promise<ProjectCompletion | null> => {
  const { data, error } = await supabase
    .from('modul8_project_completions')
    .select('*')
    .eq('service_request_id', serviceRequestId)
    .single();
  
  if (error && error.code !== 'PGRST116') throw error;
  return data as ProjectCompletion | null;
};

export const confirmProjectCompletion = async (completionId: string, confirmerId: string): Promise<ProjectCompletion> => {
  const { data, error } = await supabase
    .from('modul8_project_completions')
    .update({ 
      status: 'confirmed',
      confirmed_at: new Date().toISOString(),
      confirmed_by: confirmerId
    })
    .eq('id', completionId)
    .select()
    .single();
  
  if (error) throw error;
  return data as ProjectCompletion;
};

export const rejectProjectCompletion = async (completionId: string): Promise<ProjectCompletion> => {
  const { data, error } = await supabase
    .from('modul8_project_completions')
    .update({ status: 'rejected' })
    .eq('id', completionId)
    .select()
    .single();
  
  if (error) throw error;
  return data as ProjectCompletion;
};

// Project Rating Services
export const createProjectRating = async (data: CreateProjectRatingData): Promise<ProjectRating> => {
  const { data: result, error } = await supabase
    .from('modul8_project_ratings')
    .insert(data)
    .select()
    .single();
  
  if (error) throw error;
  return result as ProjectRating;
};

export const getProjectRating = async (serviceRequestId: string): Promise<ProjectRating | null> => {
  const { data, error } = await supabase
    .from('modul8_project_ratings')
    .select('*')
    .eq('service_request_id', serviceRequestId)
    .single();
  
  if (error && error.code !== 'PGRST116') throw error;
  return data as ProjectRating | null;
};

// Project Milestone Services
export const createProjectMilestone = async (data: CreateProjectMilestoneData): Promise<ProjectMilestone> => {
  const { data: result, error } = await supabase
    .from('modul8_project_milestones')
    .insert(data)
    .select()
    .single();
  
  if (error) throw error;
  return result as ProjectMilestone;
};

export const getProjectMilestones = async (serviceRequestId: string): Promise<ProjectMilestone[]> => {
  const { data, error } = await supabase
    .from('modul8_project_milestones')
    .select('*')
    .eq('service_request_id', serviceRequestId)
    .order('order_index', { ascending: true });
  
  if (error) throw error;
  return data as ProjectMilestone[];
};

export const updateMilestoneStatus = async (milestoneId: string, status: 'pending' | 'in_progress' | 'completed' | 'overdue'): Promise<ProjectMilestone> => {
  const updateData: any = { 
    status, 
    updated_at: new Date().toISOString() 
  };
  
  if (status === 'completed') {
    updateData.completed_at = new Date().toISOString();
  }

  const { data, error } = await supabase
    .from('modul8_project_milestones')
    .update(updateData)
    .eq('id', milestoneId)
    .select()
    .single();
  
  if (error) throw error;
  return data as ProjectMilestone;
};

// Update service request progress
export const updateProjectProgress = async (serviceRequestId: string, progress: number): Promise<void> => {
  const { error } = await supabase
    .from('modul8_service_requests')
    .update({ project_progress: progress })
    .eq('id', serviceRequestId);
  
  if (error) throw error;
};

// Get service provider's active projects
export const getServiceProviderProjects = async (serviceProviderId: string): Promise<any[]> => {
  const { data, error } = await supabase
    .from('modul8_service_requests')
    .select(`
      *,
      organizer:modul8_organizers(*)
    `)
    .eq('service_provider_id', serviceProviderId)
    .in('status', ['agreed', 'in_progress', 'pending_review', 'revision_requested', 'pending_completion', 'completed'])
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
};
