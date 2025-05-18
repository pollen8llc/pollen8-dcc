
import { supabase } from "@/integrations/supabase/client";
import { CommunityFormData } from "@/schemas/communitySchema";

// Status type for distribution records
export type DistributionStatus = 'pending' | 'processing' | 'completed' | 'failed';

// Interface for distribution record response
export interface DistributionRecord {
  id: string;
  status: DistributionStatus;
  community_id: string | null;
  created_at: string;
  processed_at: string | null;
  error_message?: string | null; // Added error_message property
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

  // Process targetAudience consistently - convert to array if it's a string
  if (typeof processedData.targetAudience === 'string') {
    processedData.targetAudience = processedData.targetAudience
      .split(',')
      .map(tag => tag.trim())
      .filter(Boolean);
  }

  // Handle date components
  if (processedData.startDateYear && processedData.startDateMonth && processedData.startDateDay) {
    const dateString = formatDateString(
      processedData.startDateYear,
      processedData.startDateMonth,
      processedData.startDateDay
    );
    processedData.foundingDate = dateString || undefined;
  }

  const { data, error } = await supabase
    .from('community_data_distribution')
    .insert({
      submission_data: processedData,
      submitter_id: session.session.user.id,
      status: 'pending'
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
    community_id: data.community_id,
    created_at: data.created_at,
    processed_at: data.processed_at,
    error_message: data.error_message
  };
};

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

  return {
    id: data.id,
    status: data.status as DistributionStatus,
    community_id: data.community_id,
    created_at: data.created_at,
    processed_at: data.processed_at,
    error_message: data.error_message
  };
};
