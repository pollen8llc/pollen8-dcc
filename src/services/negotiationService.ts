
import { supabase } from "@/integrations/supabase/client";
import { ServiceRequest, ServiceProvider, Proposal } from "@/types/modul8";
import { 
  createServiceRequest, 
  createProposal, 
  getServiceRequestById,
  updateServiceRequest
} from "@/services/modul8Service";
import { createServiceRequestComment } from "@/services/commentService";

interface StructuredRequestData {
  title: string;
  description: string;
  budgetMin: number;
  budgetMax: number;
  timeline: string;
  milestones: string[];
  organizerId: string;
  serviceProviderId: string;
  domainPage: number;
}

interface ProviderProposalData {
  quoteAmount: number;
  timeline: string;
  scopeDetails: string;
  terms: string;
  clarifications?: string;
  serviceRequestId: string;
  fromUserId: string;
}

export const createStructuredRequest = async (data: StructuredRequestData): Promise<ServiceRequest> => {
  const budgetRange = {
    min: data.budgetMin,
    max: data.budgetMax > data.budgetMin ? data.budgetMax : undefined,
    currency: 'USD'
  };

  const serviceRequest = await createServiceRequest({
    organizer_id: data.organizerId,
    domain_page: data.domainPage,
    title: data.title,
    description: data.description,
    budget_range: budgetRange,
    timeline: data.timeline,
    milestones: data.milestones, // Keep as string array to match the type
    service_provider_id: data.serviceProviderId,
    status: 'pending',
    engagement_status: 'affiliated'
  });

  // Create initial comment with structured request details
  await createServiceRequestComment({
    service_request_id: serviceRequest.id,
    user_id: data.organizerId,
    comment_type: 'general', // Use allowed comment type
    content: `New service request: ${data.title} - Budget: $${data.budgetMin.toLocaleString()} - ${data.budgetMax.toLocaleString()}, Timeline: ${data.timeline}`
  });

  return serviceRequest;
};

export const submitProviderProposal = async (data: ProviderProposalData): Promise<Proposal> => {
  // Create the proposal
  const proposal = await createProposal({
    service_request_id: data.serviceRequestId,
    from_user_id: data.fromUserId,
    proposal_type: 'initial',
    quote_amount: data.quoteAmount,
    timeline: data.timeline,
    scope_details: data.scopeDetails,
    terms: data.terms
  });

  // Update service request status to negotiating
  await updateServiceRequest(data.serviceRequestId, {
    status: 'negotiating'
  });

  // Create comment for the proposal
  let commentContent = `Proposal submitted: $${data.quoteAmount.toLocaleString()} • ${data.timeline}`;
  if (data.clarifications) {
    commentContent += `\n\nQuestions/Clarifications: ${data.clarifications}`;
  }

  await createServiceRequestComment({
    service_request_id: data.serviceRequestId,
    user_id: data.fromUserId,
    comment_type: 'general', // Use allowed comment type
    content: commentContent
  });

  return proposal;
};

export const acceptProposal = async (
  serviceRequestId: string, 
  proposalId: string, 
  userId: string
): Promise<ServiceRequest> => {
  // Update service request status to agreed
  const updatedRequest = await updateServiceRequest(serviceRequestId, {
    status: 'agreed'
  });

  // Update proposal status to accepted
  await supabase
    .from('modul8_proposals')
    .update({ status: 'accepted' })
    .eq('id', proposalId);

  // Create status change comment
  await createServiceRequestComment({
    service_request_id: serviceRequestId,
    user_id: userId,
    comment_type: 'status_change',
    content: 'Proposal accepted! Ready to lock the deal.'
  });

  return updatedRequest;
};

export const declineProposal = async (
  serviceRequestId: string, 
  proposalId: string, 
  userId: string,
  reason?: string
): Promise<ServiceRequest> => {
  // Update service request status to declined
  const updatedRequest = await updateServiceRequest(serviceRequestId, {
    status: 'declined'
  });

  // Update proposal status to rejected
  await supabase
    .from('modul8_proposals')
    .update({ status: 'rejected' })
    .eq('id', proposalId);

  // Create status change comment
  const content = reason 
    ? `Proposal declined: ${reason}`
    : 'Proposal has been declined.';

  await createServiceRequestComment({
    service_request_id: serviceRequestId,
    user_id: userId,
    comment_type: 'status_change',
    content
  });

  return updatedRequest;
};

export const lockDeal = async (
  serviceRequestId: string, 
  userId: string
): Promise<ServiceRequest> => {
  // Update service request status to in_progress
  const updatedRequest = await updateServiceRequest(serviceRequestId, {
    status: 'in_progress'
  });

  // Create deal lock comment
  await createServiceRequestComment({
    service_request_id: serviceRequestId,
    user_id: userId,
    comment_type: 'status_change',
    content: 'Deal locked! Project is now active.'
  });

  return updatedRequest;
};

// Check if organizer has existing request with provider
export const checkExistingRequest = async (
  organizerId: string, 
  serviceProviderId: string
): Promise<ServiceRequest | null> => {
  const { data, error } = await supabase
    .from('modul8_service_requests')
    .select(`
      *,
      service_provider:modul8_service_providers(*),
      organizer:modul8_organizers(*)
    `)
    .eq('organizer_id', organizerId)
    .eq('service_provider_id', serviceProviderId)
    .not('status', 'in', '(completed,cancelled,closed)')
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle(); // Use maybeSingle instead of single to handle no results

  if (error) throw error;
  
  // Type assertion to handle the Json types from Supabase
  if (data) {
    return {
      ...data,
      budget_range: data.budget_range as { min?: number; max?: number; currency: string; },
      milestones: data.milestones as string[]
    } as ServiceRequest;
  }
  
  return null;
};
