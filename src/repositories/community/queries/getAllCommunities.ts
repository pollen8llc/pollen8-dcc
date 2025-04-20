
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

// Export this function for use in other files
export const mapDbCommunity = (dbCommunity: any): Community => {
  // Type-safe handling of potentially non-object JSON fields
  const communicationPlatforms = 
    typeof dbCommunity.communication_platforms === 'object' && dbCommunity.communication_platforms !== null
      ? dbCommunity.communication_platforms
      : {};
      
  const socialMedia = 
    typeof dbCommunity.social_media === 'object' && dbCommunity.social_media !== null
      ? dbCommunity.social_media
      : {};

  // Convert any social media values that are numbers to strings
  const typeSafeSocialMedia: Record<string, string | { url?: string }> = {};
  
  if (typeof socialMedia === 'object' && socialMedia !== null) {
    Object.keys(socialMedia).forEach(key => {
      const value = socialMedia[key];
      if (typeof value === 'number') {
        typeSafeSocialMedia[key] = value.toString();
      } else if (typeof value === 'object' && value !== null) {
        typeSafeSocialMedia[key] = value;
      } else if (typeof value === 'string') {
        typeSafeSocialMedia[key] = value;
      } else {
        typeSafeSocialMedia[key] = '';
      }
    });
  }

  return {
    id: dbCommunity.id,
    name: dbCommunity.name,
    description: dbCommunity.description || '',
    location: dbCommunity.location || 'Remote',
    imageUrl: dbCommunity.logo_url || '/placeholder.svg',
    communitySize: dbCommunity.member_count?.toString() || "0",
    organizerIds: dbCommunity.owner_id ? [dbCommunity.owner_id] : [],
    memberIds: [],
    tags: dbCommunity.target_audience || [],
    isPublic: dbCommunity.is_public,
    createdAt: dbCommunity.created_at || new Date().toISOString(),
    updatedAt: dbCommunity.updated_at || new Date().toISOString(),
    website: dbCommunity.website || '',
    founder_name: dbCommunity.founder_name || '',
    role_title: dbCommunity.role_title || '',
    personal_background: dbCommunity.personal_background || '',
    community_structure: dbCommunity.community_structure || '',
    vision: dbCommunity.vision || '',
    community_values: dbCommunity.community_values || '',
    newsletterUrl: dbCommunity.newsletter_url || '',
    communication_platforms: communicationPlatforms,
    socialMedia: typeSafeSocialMedia,
    communityType: dbCommunity.community_type || '',
    format: dbCommunity.format || '',
    eventFrequency: dbCommunity.event_frequency || '',
    launchDate: dbCommunity.start_date || null,
    targetAudience: dbCommunity.target_audience || [],
    size_demographics: dbCommunity.size_demographics || '1-100'
  };
};

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

    return data.map(mapDbCommunity);
  } catch (err) {
    console.error("Error in getAllCommunities:", err);
    return mockCommunities.map(mapLegacyCommunity);
  }
};
