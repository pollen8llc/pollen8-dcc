
import { CommunityFormData } from "@/schemas/communitySchema";
import { submitCommunityDistribution, checkDistributionStatus } from "./communityDistributionService";

export async function submitCommunity(
  data: CommunityFormData, 
  addDebugLog: (type: 'info' | 'error' | 'success', message: string) => void
) {
  addDebugLog('info', 'Starting community submission process...');
  
  try {
    // Log the date components if present
    if (data.startDateYear && data.startDateMonth && data.startDateDay) {
      addDebugLog('info', `Date components: ${data.startDateYear}-${data.startDateMonth}-${data.startDateDay}`);
    }
    
    // Submit to distribution system
    const distribution = await submitCommunityDistribution(data);
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
    }

    if (status.status === 'failed') {
      addDebugLog('error', `Submission failed: ${status.error_message}`);
      throw new Error(status.error_message || 'Failed to create community');
    }

    if (!status.community_id) {
      addDebugLog('error', 'No community ID returned after processing');
      throw new Error('Failed to create community: No ID returned');
    }

    addDebugLog('success', `Community created successfully with ID: ${status.community_id}`);
    
    return {
      id: status.community_id,
      name: data.name,
      // ... other community fields as needed
    };
  } catch (error: any) {
    addDebugLog('error', `Error in submission process: ${error.message}`);
    throw error;
  }
}
