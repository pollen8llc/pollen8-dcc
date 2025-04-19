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

// Optimized mapper that only maps essential fields
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
    updatedAt: dbCommunity.updated_at || new Date().toISOString()
  };
};

// Map legacy mock data to our Community type
export const mapLegacyCommunity = (community: any): Community => {
  return {
    ...community,
    communitySize: community.communitySize || 0
  };
};

export const getAllCommunities = async (page = 1, pageSize = 12): Promise<Community[]> => {
  try {
    console.log(`Fetching communities: page ${page}, pageSize ${pageSize}`);
    const startTime = Date.now();
    
    // Calculate the range for pagination
    const start = (page - 1) * pageSize;
    const end = start + pageSize - 1;
    
    // Optimized query: Select only the columns we need
    const { data, error } = await supabase
      .from('communities')
      .select(`
        id, 
        name, 
        description, 
        location, 
        logo_url, 
        member_count, 
        owner_id, 
        target_audience, 
        is_public, 
        created_at, 
        updated_at
      `)
      .order('created_at', { ascending: false })
      .range(start, end);
    
    const endTime = Date.now();
    console.log(`Query executed in ${endTime - startTime}ms`);
    
    if (error) {
      console.error("Error fetching communities:", error);
      return mockCommunities.map(mapLegacyCommunity);
    }
    
    if (!data || data.length === 0) {
      console.log("No communities found in database, using mock data");
      return mockCommunities.map(mapLegacyCommunity);
    }
    
    const mappingStartTime = Date.now();
    const communities = data.map(mapDbCommunity);
    console.log(`Mapped ${communities.length} communities in ${Date.now() - mappingStartTime}ms`);
    
    return communities;
  } catch (err) {
    console.error("Error in getAllCommunities:", err);
    return mockCommunities.map(mapLegacyCommunity);
  }
};

// Implement server-side search
export const searchCommunitiesServer = async (query: string, page = 1, pageSize = 12): Promise<Community[]> => {
  try {
    console.log(`Searching communities with query "${query}": page ${page}, pageSize ${pageSize}`);
    const startTime = Date.now();
    
    // Calculate the range for pagination
    const start = (page - 1) * pageSize;
    const end = start + pageSize - 1;
    
    // Search query using ilike for case-insensitive matching
    const { data, error } = await supabase
      .from('communities')
      .select(`
        id, 
        name, 
        description, 
        location, 
        logo_url, 
        member_count, 
        owner_id, 
        target_audience, 
        is_public, 
        created_at, 
        updated_at
      `)
      .or(`
        name.ilike.%${query}%,
        description.ilike.%${query}%,
        location.ilike.%${query}%
      `)
      .order('created_at', { ascending: false })
      .range(start, end);
    
    const endTime = Date.now();
    console.log(`Search executed in ${endTime - startTime}ms`);
    
    if (error) {
      console.error("Error searching communities:", error);
      return [];
    }
    
    if (!data || data.length === 0) {
      console.log("No communities found matching search criteria");
      return [];
    }
    
    const mappingStartTime = Date.now();
    const communities = data.map(mapDbCommunity);
    console.log(`Mapped ${communities.length} search results in ${Date.now() - mappingStartTime}ms`);
    
    return communities;
  } catch (err) {
    console.error("Error in searchCommunitiesServer:", err);
    return [];
  }
};
