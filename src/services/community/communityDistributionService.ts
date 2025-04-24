import { supabase } from "@/integrations/supabase/client";
import { CommunityFormData } from "@/schemas/communitySchema";

// Status type for distribution records
export type DistributionStatus = 'pending' | 'processing' | 'completed' | 'failed';

// Interface for distribution record response
export interface DistributionRecord {
  id: string;
  status: DistributionStatus;
  error_message: string | null;
  community_id: string | null;
  created_at: string;
  processed_at: string | null;
}

const formatDateString = (year?: string, month?: string, day?: string): string | null => {
  if (!year || !month || !day) return null;
  const paddedMonth = month.padStart(2, '0');
  const paddedDay = day.padStart(2, '0');
  return `${year}-${paddedMonth}-${paddedDay}`;
};

export const submitCommunityDistribution = async (
  formData: CommunityFormData
): Promise<DistributionRecord> => {
  const { data: session } = await supabase.auth.getSession();
  if (!session?.session?.user) {
    throw new Error("Authentication required");
  }

  // Create a processed copy of the data
  const processedData = { ...formData };
  
  // Handle date components
  if (processedData.startDateYear && processedData.startDateMonth && processedData.startDateDay) {
    const dateString = formatDateString(
      processedData.startDateYear,
      processedData.startDateMonth,
      processedData.startDateDay
    );
    (processedData as any).start_date = dateString;
  }

  // Clean up date fields
  delete (processedData as any).startDateYear;
  delete (processedData as any).startDateMonth;
  delete (processedData as any).startDateDay;

  // Convert targetAudience to string if it's an array
  if (Array.isArray(processedData.targetAudience)) {
    processedData.targetAudience = processedData.targetAudience.join(',');
  }

  console.log('Submitting processed data:', processedData);

  const { data, error } = await supabase
    .from('community_data_distribution')
    .insert({
      submission_data: processedData,
      submitter_id: session.session.user.id
    })
    .select()
    .single();

  if (error) {
    console.error("Error submitting community:", error);
    throw new Error(error.message);
  }

  return {
    id: data.id,
    status: data.status as DistributionStatus,
    error_message: data.error_message,
    community_id: data.community_id,
    created_at: data.created_at,
    processed_at: data.processed_at
  };
};

/**
 * Checks the status of a community distribution submission
 */
export const checkDistributionStatus = async (
  distributionId: string
): Promise<DistributionRecord> => {
  const { data, error } = await supabase
    .from('community_data_distribution')
    .select('*')
    .eq('id', distributionId)
    .single();

  if (error) {
    console.error("Error checking distribution status:", error);
    throw new Error(error.message);
  }

  // Cast the response to our DistributionRecord type
  return {
    id: data.id,
    status: data.status as DistributionStatus,
    error_message: data.error_message,
    community_id: data.community_id,
    created_at: data.created_at,
    processed_at: data.processed_at
  };
};
