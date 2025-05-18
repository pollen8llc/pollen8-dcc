
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
    const targetAudienceArray = typeof communityData.targetAudience === 'string' 
      ? communityData.targetAudience.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)
      : communityData.targetAudience || [];

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
        member_count: "1" // Start with 1 member (the owner)
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
