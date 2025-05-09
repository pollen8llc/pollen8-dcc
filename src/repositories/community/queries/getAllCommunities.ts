import { Community } from "@/models/types";
import { supabase } from "@/integrations/supabase/client";

// Expanded mock communities for development and testing purposes
export const mockCommunities = [
  {
    id: "a1b2c3d4-e5f6-4a2b-8c6d-1e3f5a7b9c0d",
    name: "Tech Enthusiasts",
    description: "A community for tech lovers exploring the latest in software, hardware, and innovations.",
    location: "San Francisco, CA",
    imageUrl: "/placeholder.svg",
    communitySize: "120",
    organizerIds: ["1"],
    memberIds: ["2", "3", "4"],
    tags: ["Technology", "Innovation", "Software"],
    isPublic: true
  },
  {
    id: "b2c3d4e5-f6a7-5b3c-9d7e-2f4a6b8c0d2",
    name: "Eco Warriors",
    description: "Dedicated to environmental activism and sustainability efforts in urban areas.",
    location: "Portland, OR",
    imageUrl: "/placeholder.svg",
    communitySize: "85",
    organizerIds: ["5"],
    memberIds: ["6", "7", "8"],
    tags: ["Environment", "Activism", "Sustainability"],
    isPublic: true
  },
  {
    id: "c3d4e5f6-a7b8-6c4d-0e8f-3a5b7c9d1e3",
    name: "Art Collective",
    description: "A vibrant group of artists sharing ideas, projects, and exhibitions.",
    location: "Brooklyn, NY",
    imageUrl: "/placeholder.svg",
    communitySize: "65",
    organizerIds: ["9"],
    memberIds: ["10", "11", "12"],
    tags: ["Art", "Creativity", "Exhibition"],
    isPublic: true
  },
  {
    id: "d4e5f6a7-b8c9-7d5e-1f9a-4b6c8d0e2f4",
    name: "Fitness Friends",
    description: "Community focused on fitness, wellness, and active lifestyles.",
    location: "Austin, TX",
    imageUrl: "/placeholder.svg",
    communitySize: "150",
    organizerIds: ["13"],
    memberIds: ["14", "15", "16"],
    tags: ["Fitness", "Wellness", "Health"],
    isPublic: true
  },
  {
    id: "e5f6a7b8-c9d0-8e6f-2a0b-5c7d9e1f3a5",
    name: "Book Lovers",
    description: "Readers and writers coming together to discuss literature and writing.",
    location: "Seattle, WA",
    imageUrl: "/placeholder.svg",
    communitySize: "95",
    organizerIds: ["17"],
    memberIds: ["18", "19", "20"],
    tags: ["Books", "Literature", "Writing"],
    isPublic: true
  }
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
    logo_url: dbCommunity.logo_url || '/placeholder.svg',
    communitySize: dbCommunity.member_count?.toString() || "0",
    organizerIds: dbCommunity.owner_id ? [dbCommunity.owner_id] : [],
    memberIds: [],
    tags: dbCommunity.tags || dbCommunity.target_audience || [],
    is_public: dbCommunity.is_public,
    created_at: dbCommunity.created_at || new Date().toISOString(),
    updated_at: dbCommunity.updated_at || new Date().toISOString(),
    website: dbCommunity.website || '',
    founder_name: dbCommunity.founder_name || '',
    role_title: dbCommunity.role_title || '',
    personal_background: dbCommunity.personal_background || '',
    community_structure: dbCommunity.community_structure || '',
    vision: dbCommunity.vision || '',
    community_values: dbCommunity.community_values || '',
    newsletter_url: dbCommunity.newsletter_url || '',
    communication_platforms: communicationPlatforms,
    social_media: typeSafeSocialMedia,
    type: dbCommunity.type || dbCommunity.community_type || '',
    format: dbCommunity.format || '',
    eventFrequency: dbCommunity.event_frequency || '',
    launchDate: dbCommunity.start_date || null,
    target_audience: dbCommunity.target_audience || [],
    size_demographics: dbCommunity.size_demographics || '1-100',
    imageUrl: dbCommunity.logo_url || '/placeholder.svg',
    isPublic: dbCommunity.is_public,
    createdAt: dbCommunity.created_at,
    updatedAt: dbCommunity.updated_at,
    targetAudience: dbCommunity.target_audience || [],
    socialMedia: typeSafeSocialMedia,
    newsletterUrl: dbCommunity.newsletter_url,
    communityType: dbCommunity.type || dbCommunity.community_type
  };
};

export const mapLegacyCommunity = (legacyCommunity: any): Community => {
  return {
    id: legacyCommunity.id,
    name: legacyCommunity.name,
    description: legacyCommunity.description,
    location: legacyCommunity.location,
    logo_url: legacyCommunity.imageUrl,
    communitySize: legacyCommunity.communitySize?.toString() || "0",
    organizerIds: legacyCommunity.organizerIds || [],
    memberIds: legacyCommunity.memberIds || [],
    tags: legacyCommunity.tags || [],
    is_public: legacyCommunity.isPublic,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    imageUrl: legacyCommunity.imageUrl,
    isPublic: legacyCommunity.isPublic,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    targetAudience: legacyCommunity.tags || [],
    social_media: {}
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
