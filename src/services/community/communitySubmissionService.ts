
import { CommunityFormData } from "@/schemas/communitySchema";
import { submitCommunityDistribution, checkDistributionStatus } from "./communityDistributionService";
import { COMMUNITY_FORMATS } from "@/constants/communityConstants";

/**
 * Submits community data via the distribution system
 * @param data The community form data
 * @param logger Optional logger function
 * @returns The submission record
 */
export async function submitCommunity(
  data: CommunityFormData,
  logger?: (type: 'info' | 'error' | 'success', message: string) => void
) {
  try {
    // Log submission
    logger?.('info', 'Validating community data');

    // Validate format is one of allowed values
    if (data.format && !Object.values(COMMUNITY_FORMATS).includes(data.format)) {
      throw new Error(`Invalid format: ${data.format}. Must be one of: ${Object.values(COMMUNITY_FORMATS).join(", ")}`);
    }

    // Process targetAudience
    let processedData = { ...data };
    
    // Properly handle targetAudience to avoid the split error on never type
    if (typeof processedData.targetAudience === 'string' && processedData.targetAudience) {
      processedData.targetAudience = processedData.targetAudience
        .split(',')
        .map(tag => tag.trim())
        .filter(Boolean);
    } else if (!Array.isArray(processedData.targetAudience)) {
      processedData.targetAudience = [];
    }
    
    logger?.('info', 'Submitting community data to distribution service');
    const result = await submitCommunityDistribution(processedData);
    
    logger?.('success', `Community data submitted successfully (ID: ${result.id})`);
    return result;
  } catch (error: any) {
    logger?.('error', `Failed to submit community: ${error.message}`);
    throw error;
  }
}

/**
 * Checks the status of a community submission
 * @param distributionId The distribution ID
 * @returns The distribution record
 */
export async function checkCommunitySubmission(distributionId: string) {
  return await checkDistributionStatus(distributionId);
}
