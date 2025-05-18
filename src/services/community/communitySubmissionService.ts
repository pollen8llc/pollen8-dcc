
import { supabase } from '@/integrations/supabase/client';
import { Community } from '@/models/types';
import { processTargetAudience } from '@/utils/communityUtils';

/**
 * Types and interfaces for community submission and distribution
 */
export interface CommunitySubmission {
  id: string;
  submission_data: any;
  submitter_id: string;
  status: string;
  community_id: string | null;
  processed_at: string | null;
  error_message: string | null;
  created_at: string;
}

/**
 * Check the status of a community submission
 */
export const checkDistributionStatus = async (submissionId: string): Promise<CommunitySubmission> => {
  const { data, error } = await supabase
    .from('community_data_distribution')
    .select('*')
    .eq('id', submissionId)
    .single();
  
  if (error) {
    console.error('Error checking submission status:', error);
    throw new Error(`Failed to check submission status: ${error.message}`);
  }
  
  return data;
};

/**
 * Submit a community form for processing via the distribution system
 */
export const submitCommunity = async (formData: Partial<Community>, debugLogCallback: string | ((message: string) => void)) => {
  console.log('Submitting community:', formData);
  
  // Handle the debug logging function
  const logMessage = typeof debugLogCallback === 'function' 
    ? debugLogCallback 
    : (message: string) => console.log(message);
  
  // Process target audience using the utility function
  const processedTargetAudience = processTargetAudience(formData.target_audience);
  
  // Create submission with processed data
  const submissionData = {
    ...formData,
    target_audience: processedTargetAudience
  };
  
  // Log the submission
  logMessage(`Submitting data: ${JSON.stringify(submissionData)}`);
  
  // Get the current user's ID from the session
  const { data: sessionData } = await supabase.auth.getSession();
  const submitterId = sessionData.session?.user.id || '';

  const { data, error } = await supabase
    .from('community_data_distribution')
    .insert({
      submission_data: submissionData,
      status: 'pending',
      submitter_id: submitterId,
      created_at: new Date().toISOString()
    })
    .select()
    .single();
  
  if (error) {
    console.error('Error submitting community:', error);
    throw new Error(`Failed to submit community: ${error.message}`);
  }
  
  return data;
};
