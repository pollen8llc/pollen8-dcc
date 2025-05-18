import { supabase } from '@/integrations/supabase/client';
import { Community } from '@/models/types';
import { processTargetAudience } from '@/utils/communityUtils';

/**
 * Create a new community in the database
 */
export const createCommunity = async (communityData: Partial<Community>): Promise<Community> => {
  console.log('Creating community:', communityData);
  
  // Process target audience using the utility function
  const processedTargetAudience = processTargetAudience(communityData.target_audience);
  
  // Create the community with processed data
  const { data, error } = await supabase
    .from('communities')
    .insert({
      ...communityData,
      target_audience: processedTargetAudience,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })
    .select()
    .single();
  
  if (error) {
    console.error('Error creating community:', error);
    throw new Error(`Failed to create community: ${error.message}`);
  }
  
  return data as Community;
};

/**
 * Update an existing community in the database
 */
export const updateCommunity = async (communityId: string, communityData: Partial<Community>): Promise<Community> => {
  console.log('Updating community:', communityId, communityData);
  
  // Process target audience using the utility function
  const processedTargetAudience = processTargetAudience(communityData.target_audience);
  
  // Update the community with processed data
  const { data, error } = await supabase
    .from('communities')
    .update({
      ...communityData,
      target_audience: processedTargetAudience,
      updated_at: new Date().toISOString()
    })
    .eq('id', communityId)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating community:', error);
    throw new Error(`Failed to update community: ${error.message}`);
  }
  
  return data as Community;
};

/**
 * Deletes a community
 * @param communityId The community ID to delete
 * @returns A promise that resolves when the community is deleted
 */
export async function deleteCommunity(communityId: string) {
  try {
    if (!communityId) {
      throw new Error("Community ID is required to delete.");
    }

    // Use the safe_delete_community function instead of direct delete
    // This ensures proper ownership validation and auditing
    const { data, error } = await supabase.rpc('safe_delete_community', {
      community_id: communityId,
      user_id: (await supabase.auth.getUser()).data.user?.id
    });
    
    if (error) {
      console.error("Error deleting community:", error);
      throw new Error(`Failed to delete community: ${error.message}`);
    }
    
    if (!data) {
      throw new Error("Failed to delete community - you may not be the owner");
    }
    
    console.log("Community deleted successfully:", communityId);
    return true;
  } catch (error: any) {
    console.error("Error in deleteCommunity:", error);
    throw error;
  }
}
