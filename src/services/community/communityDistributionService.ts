
import { supabase } from "@/integrations/supabase/client";
import { CommunityFormData } from "@/schemas/communitySchema";

// Define the DistributionStatus type
export type DistributionStatus = 'pending' | 'processing' | 'completed' | 'failed';

/**
 * Submits community data to the distribution service
 * @param data Community data
 * @returns The created distribution record
 */
export async function submitCommunityDistribution(data: CommunityFormData) {
  try {
    // Process data for submission
    const submissionData = {
      ...data,
      isPublic: true, // Default to public
    };

    // Handle founding date if we have individual date components
    if (data.startDateYear || data.startDateMonth || data.startDateDay) {
      // Only create foundingDate if at least year is provided
      if (data.startDateYear) {
        const month = data.startDateMonth || '01';
        const day = data.startDateDay || '01';
        submissionData.foundingDate = `${data.startDateYear}-${month}-${day}`;
      }
    }

    // Ensure targetAudience is properly handled
    let targetAudienceArray: string[] = [];
    
    if (typeof submissionData.targetAudience === 'string') {
      // Only attempt to split if it's a non-empty string
      if (submissionData.targetAudience.trim()) {
        targetAudienceArray = submissionData.targetAudience
          .split(',')
          .map(tag => tag.trim())
          .filter(Boolean);
      }
    } else if (Array.isArray(submissionData.targetAudience)) {
      targetAudienceArray = submissionData.targetAudience;
    }
    
    // Ensure targetAudience is always an array
    submissionData.targetAudience = targetAudienceArray;

    const { data: distributionRecord, error } = await supabase
      .from('community_data_distribution')
      .insert({
        submission_data: submissionData,
        submitter_id: (await supabase.auth.getUser()).data.user?.id
      })
      .select()
      .single();

    if (error) {
      console.error("Error submitting community distribution:", error);
      throw error;
    }

    return distributionRecord;
  } catch (error: any) {
    console.error("Distribution service error:", error);
    throw new Error(`Failed to submit community data: ${error.message}`);
  }
}

/**
 * Checks the status of a distribution
 * @param distributionId The distribution ID
 * @returns The distribution record
 */
export async function checkDistributionStatus(distributionId: string) {
  const { data, error } = await supabase
    .from('community_data_distribution')
    .select(`
      id, 
      status, 
      error_message,
      processed_at,
      community_id
    `)
    .eq('id', distributionId)
    .single();

  if (error) {
    throw error;
  }

  return data;
}
