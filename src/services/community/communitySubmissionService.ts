import { CommunityFormData } from "@/schemas/communitySchema";
import { submitCommunityDistribution, checkDistributionStatus } from "./communityDistributionService";

export async function submitCommunity(
  data: CommunityFormData, 
  addDebugLog: (type: 'info' | 'error' | 'success', message: string) => void
) {
  addDebugLog('info', 'Starting community submission process...');
  
  try {
    // Format and validate the data before submission
    addDebugLog('info', 'Formatting submission data...');
    const formattedData = {
      ...data,
      targetAudience: typeof data.targetAudience === 'string' 
        ? data.targetAudience.split(',').map(tag => tag.trim()).filter(Boolean)
        : data.targetAudience || [],
    };

    // Log the formatted data
    addDebugLog('info', `Formatted data: ${JSON.stringify(formattedData, null, 2)}`);
    
    // Convert targetAudience back to string for distribution service
    const distributionData = {
      ...formattedData,
      targetAudience: Array.isArray(formattedData.targetAudience) 
        ? formattedData.targetAudience.join(',') 
        : formattedData.targetAudience
    };

    // Submit to distribution system
    addDebugLog('info', 'Submitting to distribution system...');
    const distribution = await submitCommunityDistribution(distributionData);
    addDebugLog('success', `Distribution record created with ID: ${distribution.id}`);

    // Poll for status until completion or failure
    const maxAttempts = 10;
    let attempts = 0;
    let status = distribution;

    while (attempts < maxAttempts && (status.status === 'pending' || status.status === 'processing')) {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second between checks
      status = await checkDistributionStatus(distribution.id);
      attempts++;
      
      addDebugLog('info', `Check ${attempts}: Status is ${status.status}`);
      
      if (status.error_message) {
        addDebugLog('error', `Processing error: ${status.error_message}`);
      }
    }

    if (status.status === 'failed') {
      const errorMessage = status.error_message || 'Failed to create community';
      addDebugLog('error', `Submission failed: ${errorMessage}`);
      throw new Error(errorMessage);
    }

    if (!status.community_id) {
      addDebugLog('error', 'No community ID returned after processing');
      throw new Error('Failed to create community: No ID returned');
    }

    addDebugLog('success', `Community created successfully with ID: ${status.community_id}`);
    
    return {
      id: status.community_id,
      name: data.name,
      description: data.description,
      location: data.location,
      type: data.type,
      format: data.format,
      targetAudience: formattedData.targetAudience,
      website: data.website,
      newsletterUrl: data.newsletterUrl,
      socialMediaHandles: data.socialMediaHandles,
      eventFrequency: data.eventFrequency
    };
  } catch (error: any) {
    addDebugLog('error', `Error in submission process: ${error.message}`);
    console.error('Full error:', error);
    throw error;
  }
}
