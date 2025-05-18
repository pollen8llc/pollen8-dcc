
import { supabase } from "@/integrations/supabase/client";
import { CommunityFormData } from "@/schemas/communitySchema";
import { COMMUNITY_FORMATS } from "@/constants/communityConstants";

/**
 * Creates a new community directly
 * @param communityData The community data
 * @returns The created community
 */
export async function createCommunity(communityData: CommunityFormData) {
  try {
    // Validate format is one of allowed values
    if (communityData.format && !Object.values(COMMUNITY_FORMATS).includes(communityData.format as any)) {
      throw new Error(`Invalid format: ${communityData.format}. Must be one of: ${Object.values(COMMUNITY_FORMATS).join(", ")}`);
    }

    // Process data for insertion
    const targetAudienceArray = Array.isArray(communityData.targetAudience) 
      ? communityData.targetAudience 
      : (typeof communityData.targetAudience === 'string' 
          ? communityData.targetAudience.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)
          : []);

    const socialMediaObject = communityData.socialMediaHandles || {};

    const communicationPlatformsObject = communityData.platforms?.reduce((acc, platform) => {
      acc[platform] = { enabled: true };
      return acc;
    }, {} as Record<string, any>) || {};

    // Create the community
    const { data, error } = await supabase
      .from('communities')
      .insert({
        name: communityData.name,
        description: communityData.description,
        type: communityData.type,
        format: communityData.format,
        location: communityData.location || "Remote",
        target_audience: targetAudienceArray,
        communication_platforms: communicationPlatformsObject,
        website: communityData.website || "",
        newsletter_url: communityData.newsletterUrl || "",
        social_media: socialMediaObject,
        is_public: true, // Default to public
        member_count: communityData.communitySize || communityData.size || "1" // Start with 1 member (the owner)
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating community:", error);
      throw new Error(`Failed to create community: ${error.message}`);
    }

    return data;
  } catch (error: any) {
    console.error("Error in createCommunity:", error);
    throw error;
  }
}

/**
 * Updates an existing community
 * @param communityId The community ID
 * @param communityData The updated community data
 * @returns The updated community
 */
export async function updateCommunity(communityId: string, communityData: Partial<CommunityFormData>) {
  try {
    // Validate format is one of allowed values
    if (communityData.format && !Object.values(COMMUNITY_FORMATS).includes(communityData.format as any)) {
      throw new Error(`Invalid format: ${communityData.format}. Must be one of: ${Object.values(COMMUNITY_FORMATS).join(", ")}`);
    }

    // Process data for update
    const targetAudienceArray = Array.isArray(communityData.targetAudience) 
      ? communityData.targetAudience 
      : (typeof communityData.targetAudience === 'string' 
          ? communityData.targetAudience.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)
          : undefined);

    // Update the community
    const { data, error } = await supabase
      .from('communities')
      .update({
        name: communityData.name,
        description: communityData.description,
        type: communityData.type,
        format: communityData.format,
        location: communityData.location,
        target_audience: targetAudienceArray,
        website: communityData.website,
        newsletter_url: communityData.newsletterUrl,
        social_media: communityData.socialMediaHandles
      })
      .eq('id', communityId)
      .select()
      .single();

    if (error) {
      console.error("Error updating community:", error);
      throw new Error(`Failed to update community: ${error.message}`);
    }

    return data;
  } catch (error: any) {
    console.error("Error in updateCommunity:", error);
    throw error;
  }
}

/**
 * Deletes a community
 * @param communityId The community ID to delete
 * @returns A promise that resolves when the community is deleted
 */
export async function deleteCommunity(communityId: string) {
  try {
    const { error } = await supabase
      .from('communities')
      .delete()
      .eq('id', communityId);

    if (error) {
      console.error("Error deleting community:", error);
      throw new Error(`Failed to delete community: ${error.message}`);
    }

    return true;
  } catch (error: any) {
    console.error("Error in deleteCommunity:", error);
    throw error;
  }
}
