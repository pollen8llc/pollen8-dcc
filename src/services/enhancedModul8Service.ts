
import { supabase } from "@/integrations/supabase/client";
import { 
  ProposalThread,
  ProposalVersion,
  ProjectComment,
  CreateProposalThreadData,
  CreateProposalVersionData,
  CreateProjectCommentData
} from "@/types/modul8";

// Proposal Thread Services
export const createProposalThread = async (data: CreateProposalThreadData): Promise<ProposalThread> => {
  const { data: result, error } = await supabase
    .from('modul8_proposal_threads')
    .insert(data)
    .select()
    .single();
  
  if (error) throw error;
  return result as ProposalThread;
};

export const getProposalThread = async (serviceRequestId: string): Promise<ProposalThread | null> => {
  const { data, error } = await supabase
    .from('modul8_proposal_threads')
    .select('*')
    .eq('service_request_id', serviceRequestId)
    .single();
  
  if (error && error.code !== 'PGRST116') throw error;
  return data as ProposalThread | null;
};

export const updateProposalThreadStatus = async (threadId: string, status: 'active' | 'closed' | 'completed'): Promise<ProposalThread> => {
  const { data, error } = await supabase
    .from('modul8_proposal_threads')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', threadId)
    .select()
    .single();
  
  if (error) throw error;
  return data as ProposalThread;
};

// Proposal Version Services
export const createProposalVersion = async (data: CreateProposalVersionData): Promise<ProposalVersion> => {
  const { data: result, error } = await supabase
    .from('modul8_proposal_versions')
    .insert(data)
    .select()
    .single();
  
  if (error) throw error;
  return result as ProposalVersion;
};

export const getProposalVersions = async (threadId: string): Promise<ProposalVersion[]> => {
  const { data, error } = await supabase
    .from('modul8_proposal_versions')
    .select('*')
    .eq('thread_id', threadId)
    .order('version_number', { ascending: true });
  
  if (error) throw error;
  return data as ProposalVersion[];
};

export const getLatestProposalVersion = async (threadId: string): Promise<ProposalVersion | null> => {
  const { data, error } = await supabase
    .from('modul8_proposal_versions')
    .select('*')
    .eq('thread_id', threadId)
    .order('version_number', { ascending: false })
    .limit(1)
    .single();
  
  if (error && error.code !== 'PGRST116') throw error;
  return data as ProposalVersion | null;
};

// Project Comment Services
export const createProjectComment = async (data: CreateProjectCommentData): Promise<ProjectComment> => {
  const { data: result, error } = await supabase
    .from('modul8_project_comments')
    .insert(data)
    .select()
    .single();
  
  if (error) throw error;
  return result as ProjectComment;
};

export const getProjectComments = async (serviceRequestId: string): Promise<ProjectComment[]> => {
  const { data, error } = await supabase
    .from('modul8_project_comments')
    .select('*')
    .eq('service_request_id', serviceRequestId)
    .order('created_at', { ascending: true });
  
  if (error) throw error;
  return data as ProjectComment[];
};

export const updateProjectComment = async (commentId: string, content: string): Promise<ProjectComment> => {
  const { data, error } = await supabase
    .from('modul8_project_comments')
    .update({ content, updated_at: new Date().toISOString() })
    .eq('id', commentId)
    .select()
    .single();
  
  if (error) throw error;
  return data as ProjectComment;
};

export const deleteProjectComment = async (commentId: string): Promise<void> => {
  const { error } = await supabase
    .from('modul8_project_comments')
    .delete()
    .eq('id', commentId);
  
  if (error) throw error;
};

// Enhanced proposal workflow
export const submitCounterProposal = async (
  threadId: string,
  proposalId: string,
  counterData: Partial<CreateProposalVersionData>,
  changeNotes: string
): Promise<ProposalVersion> => {
  // Get current version number
  const versions = await getProposalVersions(threadId);
  const nextVersion = versions.length + 1;

  const versionData: CreateProposalVersionData = {
    thread_id: threadId,
    proposal_id: proposalId,
    version_number: nextVersion,
    change_notes: changeNotes,
    created_by: counterData.created_by!,
    ...counterData
  };

  return await createProposalVersion(versionData);
};

// Project status management
export const updateProjectStatus = async (
  serviceRequestId: string,
  status: string,
  userId: string,
  notes?: string
): Promise<void> => {
  // Update the service request status
  const { error: updateError } = await supabase
    .from('modul8_service_requests')
    .update({ status })
    .eq('id', serviceRequestId);

  if (updateError) throw updateError;

  // Add a status update comment
  if (notes) {
    await createProjectComment({
      service_request_id: serviceRequestId,
      user_id: userId,
      comment_type: 'status_update',
      content: `Status updated to: ${status}. ${notes}`,
      metadata: { status_change: { from: null, to: status } }
    });
  }
};

// Get project activity feed
export const getProjectActivity = async (serviceRequestId: string): Promise<ProjectComment[]> => {
  return await getProjectComments(serviceRequestId);
};
