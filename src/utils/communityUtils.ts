
/**
 * Utility functions for community data handling
 */

/**
 * Safely processes target audience values that might be strings or arrays
 * Handles null, undefined, string, or array inputs
 * 
 * @param targetAudience The target audience value that might be a string, array, null, or undefined
 * @returns An array of audience tags
 */
export const processTargetAudience = (targetAudience: string | string[] | null | undefined): string[] => {
  // Return empty array for null/undefined values
  if (targetAudience == null) {
    return [];
  }
  
  // If it's already an array, return it
  if (Array.isArray(targetAudience)) {
    return targetAudience;
  }
  
  // If it's a string, split it by commas and trim each value
  return targetAudience.trim() ? 
    targetAudience.split(',').map(tag => tag.trim()).filter(Boolean) : 
    [];
};
