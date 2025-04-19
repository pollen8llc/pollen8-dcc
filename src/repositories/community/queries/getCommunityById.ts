import { Community } from "@/models/types";
import { supabase } from "@/integrations/supabase/client";
import { mockCommunities, mapLegacyCommunity } from "../../base/baseRepository";

export const getCommunityById = async (id: string): Promise<Community | null> => {
  try {
    const { data, error } = await supabase
      .from('communities')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error("Error fetching community:", error);
      const mockCommunity = mockCommunities.find(community => community.id === id);
      return mockCommunity ? mapLegacyCommunity(mockCommunity) : null;
    }
    
    if (!data) {
      console.log("No community found with id:", id);
      return null;
    }

    // Set organizer to the owner
    const organizerIds = data.owner_id ? [data.owner_id] : [];
    // For now, set members to empty array since we don't have a members table anymore
    const memberIds = [];

    // Type-safe handling of potentially non-object JSON fields
    const communicationPlatforms = typeof data.communication_platforms === 'object' && data.communication_platforms !== null
      ? data.communication_platforms
      : {};
      
    const socialMedia = typeof data.social_media === 'object' && data.social_media !== null
      ? data.social_media
      : {};

    return {
      id: data.id,
      name: data.name,
      description: data.description || '',
      location: data.location || 'Remote',
      imageUrl: data.logo_url || '/placeholder.svg',
      communitySize: data.member_count || 0, // Changed from memberCount to communitySize
      organizerIds: organizerIds,
      memberIds: memberIds,
      tags: [], // No tags in the current model
      isPublic: data.is_public,
      createdAt: data.created_at || new Date().toISOString(),
      updatedAt: data.updated_at || new Date().toISOString(),
      website: data.website || '',
      founder_name: data.founder_name || '',
      role_title: data.role_title || '',
      personal_background: data.personal_background || '',
      community_structure: data.community_structure || '',
      vision: data.vision || '',
      community_values: data.community_values || '',
      // Add proper mapping for the platform-related fields with type checking
      newsletterUrl: data.newsletter_url || '',
      communication_platforms: communicationPlatforms as Record<string, string | { url?: string; details?: string }>,
      socialMedia: socialMedia as Record<string, string | { url?: string }>,
      communityType: data.community_type || '',
      format: data.format || '',
      eventFrequency: data.event_frequency || '',
      launchDate: data.start_date || null,
      targetAudience: data.target_audience || []
    };
  } catch (err) {
    console.error("Error in getCommunityById:", err);
    const mockCommunity = mockCommunities.find(community => community.id === id);
    return mockCommunity ? mapLegacyCommunity(mockCommunity) : null;
  }
};
