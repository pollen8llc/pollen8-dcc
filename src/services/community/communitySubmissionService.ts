
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
    
    // Process targetAudience to ensure it's a string for the distribution service
    let targetAudience: string = '';
    if (Array.isArray(data.targetAudience)) {
      targetAudience = data.targetAudience.join(',');
    } else if (typeof data.targetAudience === 'string') {
      targetAudience = data.targetAudience;
    }
    
    // Validate format is one of the allowed values
    if (!["online", "IRL", "hybrid"].includes(data.format)) {
      throw new Error("Invalid format. Must be one of: online, IRL, hybrid");
    }
    
    // Create distribution data with consistent types
    const distributionData = {
      ...data,
      targetAudience: targetAudience,
      format: data.format,
    };

    // Log the formatted data
    addDebugLog('info', `Formatted data: ${JSON.stringify(distributionData, null, 2)}`);
    
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
      targetAudience: data.targetAudience,
      website: data.website,
      newsletterUrl: data.newsletterUrl,
      socialMediaHandles: data.socialMediaHandles,
      eventFrequency: data.eventFrequency,
      community_id: status.community_id // Add the community_id property
    };
  } catch (error: any) {
    addDebugLog('error', `Error in submission process: ${error.message}`);
    console.error('Full error:', error);
    throw error;
  }
}
