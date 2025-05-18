
import { supabase } from "@/integrations/supabase/client";
import { CommunityFormData } from "@/schemas/communitySchema";
import { COMMUNITY_FORMATS } from "@/constants/communityConstants";

export type LoggerFunction = (type: 'info' | 'error' | 'success', message: string) => void;

// These types must match what's in the database
export type SubmissionStatus = 'pending' | 'processing' | 'completed' | 'failed';

export interface SubmissionResult {
  id: string;
  community_id?: string;
  status: SubmissionStatus;
}

/**
 * Submit community data to be processed by the database trigger
 */
export const submitCommunity = async (
  formData: CommunityFormData, 
  logger: LoggerFunction
): Promise<SubmissionResult> => {
  try {
    logger('info', 'Preparing community submission data');
    
    // Validate the format to match database constraints
    if (formData.format && !Object.values(COMMUNITY_FORMATS).includes(formData.format as any)) {
      throw new Error(`Invalid format: ${formData.format}. Must be one of: ${Object.values(COMMUNITY_FORMATS).join(', ')}`);
    }
    
    // Process targetAudience to ensure it's an array
    const targetAudience = typeof formData.targetAudience === 'string' 
      ? formData.targetAudience.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)
      : formData.targetAudience || [];
    
    // Create communication platforms object from the platforms array
    const communicationPlatforms = formData.platforms?.reduce((acc, platform) => {
      acc[platform] = { enabled: true };
      return acc;
    }, {} as Record<string, any>) || {};
    
    // Create social media object
    const socialMediaHandles = formData.socialMediaHandles || {};
    
    // Prepare the submission data - match the expected format in process_community_submission function
    const submissionData = {
      name: formData.name,
      description: formData.description,
      type: formData.type,
      format: formData.format,
      location: formData.location || "Remote",
      targetAudience: targetAudience,
      communicationPlatforms: communicationPlatforms,
      website: formData.website || "",
      newsletterUrl: formData.newsletterUrl || "",
      socialMedia: socialMediaHandles,
      isPublic: true,  // Default to public
    };

    logger('info', `Submitting community data for "${formData.name}"`);
    
    // Submit to the database
    const { data, error } = await supabase
      .from('community_data_distribution')
      .insert({
        submission_data: submissionData,
        submitter_id: (await supabase.auth.getSession()).data.session?.user.id
      })
      .select('id, status, community_id')
      .single();
    
    if (error) {
      logger('error', `Submission error: ${error.message}`);
      throw new Error(`Failed to submit community data: ${error.message}`);
    }

    logger('success', `Community submission successful! ID: ${data.id}`);
    
    return data as SubmissionResult;
  } catch (error: any) {
    logger('error', `Community submission failed: ${error.message}`);
    throw error;
  }
};

/**
 * Check the status of a community submission
 */
export const getSubmissionStatus = async (distributionId: string): Promise<SubmissionResult | null> => {
  try {
    const { data, error } = await supabase
      .from('community_data_distribution')
      .select('id, status, community_id, error_message')
      .eq('id', distributionId)
      .single();
    
    if (error) {
      console.error(`Error fetching submission status: ${error.message}`);
      return null;
    }
    
    return data as SubmissionResult;
  } catch (error) {
    console.error('Failed to get submission status:', error);
    return null;
  }
};
