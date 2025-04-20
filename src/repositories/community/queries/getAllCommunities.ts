import { Community } from "@/models/types";
import { supabase } from "@/integrations/supabase/client";

// Mock communities for development and testing purposes
export const mockCommunities = [
  {
    id: "1",
    name: "Tech Enthusiasts",
    description: "A community for tech lovers",
    location: "San Francisco, CA",
    imageUrl: "/placeholder.svg",
    communitySize: "120",
    organizerIds: ["1"],
    memberIds: ["2", "3", "4"],
    tags: ["Technology", "Innovation", "Software"],
    isPublic: true
  },
  // ... other mock communities
];

export const mapLegacyCommunity = (legacyCommunity: any): Community => {
  return {
    id: legacyCommunity.id,
    name: legacyCommunity.name,
    description: legacyCommunity.description,
    location: legacyCommunity.location,
    imageUrl: legacyCommunity.imageUrl,
    communitySize: legacyCommunity.communitySize?.toString() || "0",
    organizerIds: legacyCommunity.organizerIds || [],
    memberIds: legacyCommunity.memberIds || [],
    tags: legacyCommunity.tags || [],
    isPublic: legacyCommunity.isPublic,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
};

/**
 * Gets all communities with pagination
 */
export const getAllCommunities = async (page = 1, pageSize = 12): Promise<Community[]> => {
  try {
    console.log(`Getting communities: page ${page}, pageSize ${pageSize}`);
    
    const { data, error } = await supabase
      .from('communities')
      .select('*')
      .order('created_at', { ascending: false })
      .range((page - 1) * pageSize, page * pageSize - 1);
    
    if (error) {
      console.error("Error fetching communities:", error);
      return mockCommunities.map(mapLegacyCommunity);
    }
    
    if (!data || data.length === 0) {
      console.log("No communities found, returning mock data");
      return mockCommunities.map(mapLegacyCommunity);
    }

    const communities = data.map(community => {
      // Type-safe handling of potentially non-object JSON fields
      const communicationPlatforms = 
        typeof community.communication_platforms === 'object' && community.communication_platforms !== null
          ? community.communication_platforms
          : {};
          
      const socialMedia = 
        typeof community.social_media === 'object' && community.social_media !== null
          ? community.social_media
          : {};

      return {
        id: community.id,
        name: community.name,
        description: community.description || '',
        location: community.location || 'Remote',
        imageUrl: community.logo_url || '/placeholder.svg',
        communitySize: community.member_count?.toString() || "0",
        organizerIds: community.owner_id ? [community.owner_id] : [],
        memberIds: [],
        tags: community.target_audience || [],
        isPublic: community.is_public,
        createdAt: community.created_at || new Date().toISOString(),
        updatedAt: community.updated_at || new Date().toISOString(),
        website: community.website || '',
        founder_name: community.founder_name || '',
        role_title: community.role_title || '',
        personal_background: community.personal_background || '',
        community_structure: community.community_structure || '',
        vision: community.vision || '',
        community_values: community.community_values || '',
        newsletterUrl: community.newsletter_url || '',
        communication_platforms: communicationPlatforms,
        socialMedia,
        communityType: community.community_type || '',
        format: community.format || '',
        eventFrequency: community.event_frequency || '',
        launchDate: community.start_date || null,
        targetAudience: community.target_audience || [],
        size_demographics: community.size_demographics || '1-100'
      };
    });

    console.log(`Found ${communities.length} communities`);
    return communities;
  } catch (err) {
    console.error("Error in getAllCommunities:", err);
    return mockCommunities.map(mapLegacyCommunity);
  }
};
