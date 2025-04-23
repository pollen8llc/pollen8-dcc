
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

/**
 * Submits community data to the distribution system
 */
export const submitCommunityDistribution = async (
  formData: CommunityFormData
): Promise<DistributionRecord> => {
  const { data: session } = await supabase.auth.getSession();
  if (!session?.session?.user) {
    throw new Error("Authentication required");
  }

  // Submit to the distribution table
  const { data, error } = await supabase
    .from('community_data_distribution')
    .insert({
      submission_data: formData,
      submitter_id: session.session.user.id
    })
    .select()
    .single();

  if (error) {
    console.error("Error submitting community:", error);
    throw new Error(error.message);
  }

  return data;
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

  return data;
};
