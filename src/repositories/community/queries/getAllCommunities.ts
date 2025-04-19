import { Community } from "@/models/types";
import { supabase } from "@/integrations/supabase/client";

// Mock data and mapping functions for fallback
export const mockCommunities = [
  {
    id: '1',
    name: 'Tech Enthusiasts',
    description: 'A community for tech lovers',
    location: 'San Francisco, CA',
    imageUrl: '/placeholder.svg',
    communitySize: 120,
    organizerIds: ['1'],
    memberIds: ['2', '3', '4'],
    tags: ['Technology', 'Innovation', 'Software'],
    isPublic: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// Map a database community to our Community type
export const mapDbCommunity = (dbCommunity: any): Community => {
  return {
    id: dbCommunity.id,
    name: dbCommunity.name,
    description: dbCommunity.description || '',
    location: dbCommunity.location || 'Remote',
    imageUrl: dbCommunity.logo_url || '/placeholder.svg',
    communitySize: dbCommunity.member_count || 0,
    organizerIds: dbCommunity.owner_id ? [dbCommunity.owner_id] : [],
    memberIds: [],
    tags: dbCommunity.target_audience || [],
    isPublic: dbCommunity.is_public,
    createdAt: dbCommunity.created_at || new Date().toISOString(),
    updatedAt: dbCommunity.updated_at || new Date().toISOString(),
    website: dbCommunity.website || '',
    communityType: dbCommunity.community_type || '',
    format: dbCommunity.format || '',
    targetAudience: dbCommunity.target_audience || [],
    eventFrequency: dbCommunity.event_frequency || '',
    launchDate: dbCommunity.start_date || null,
    newsletterUrl: dbCommunity.newsletter_url || '',
    socialMedia: dbCommunity.social_media || {},
    communication_platforms: dbCommunity.communication_platforms || {},
    size_demographics: dbCommunity.size_demographics || '0'
  };
};

// Map legacy mock data to our Community type
export const mapLegacyCommunity = (community: any): Community => {
  return {
    ...community,
    communitySize: community.communitySize || 0
  };
};

export const getAllCommunities = async (): Promise<Community[]> => {
  try {
    const { data, error } = await supabase
      .from('communities')
      .select('*');
    
    if (error) {
      console.error("Error fetching communities:", error);
      return mockCommunities.map(mapLegacyCommunity);
    }
    
    if (!data || data.length === 0) {
      console.log("No communities found in database, using mock data");
      return mockCommunities.map(mapLegacyCommunity);
    }
    
    return data.map(mapDbCommunity);
  } catch (err) {
    console.error("Error in getAllCommunities:", err);
    return mockCommunities.map(mapLegacyCommunity);
  }
};
