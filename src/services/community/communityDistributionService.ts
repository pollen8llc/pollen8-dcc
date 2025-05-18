import { supabase } from '@/integrations/supabase/client';
import { processTargetAudience } from '@/utils/communityUtils';

// Distribution status enum
export enum DistributionStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed'
}

export type DistributionRecord = {
  id: string;
  submission_data: any;
  submitter_id: string;
  status: DistributionStatus;
  community_id: string | null;
  processed_at: string | null;
  error_message: string | null;
  created_at: string;
};

/**
 * Check the distribution status of a community submission
 */
export const checkDistributionStatus = async (submissionId: string): Promise<DistributionRecord> => {
  const { data, error } = await supabase
    .from('community_data_distribution')
    .select('*')
    .eq('id', submissionId)
    .single();
  
  if (error) {
    console.error('Error checking distribution status:', error);
    throw new Error(`Failed to check distribution status: ${error.message}`);
  }
  
  return data as DistributionRecord;
};

/**
 * Process submission data into a format for database distribution
 */
export const processSubmissionData = (submissionData: any) => {
  // Process target audience using the utility function
  const processedTargetAudience = processTargetAudience(submissionData.target_audience);
  
  // Return processed data
  return {
    ...submissionData,
    target_audience: processedTargetAudience,
  };
};
