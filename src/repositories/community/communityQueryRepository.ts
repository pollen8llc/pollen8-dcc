import { Community } from "@/models/types";
import { supabase, mockCommunities, mapDbCommunity, mapLegacyCommunity } from "../base/baseRepository";

/**
 * Gets all communities
 */
export const getAllCommunities = async (): Promise<Community[]> => {
  try {
    const { data, error } = await supabase
      .from('communities')
      .select('*');
    
    if (error) {
      console.error("Error fetching communities:", error);
      // Fallback to mock data, ensuring proper type mapping
      return mockCommunities.map(mapLegacyCommunity);
    }
    
    if (!data || data.length === 0) {
      console.log("No communities found in database, using mock data");
      return mockCommunities.map(mapLegacyCommunity);
    }
    
    return data.map(mapDbCommunity);
  } catch (err) {
    console.error("Error in getAllCommunities:", err);
    // Fallback to mock data, ensuring proper type mapping
    return mockCommunities.map(mapLegacyCommunity);
  }
};

/**
 * Gets a community by its ID
 */
export const getCommunityById = async (id: string): Promise<Community | null> => {
  try {
    const { data, error } = await supabase
      .from('communities')
      .select(`
        *,
        community_members (
          user_id,
          role
        )
      `)
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

    // Transform the data to match our Community type
    const organizers = data.community_members?.filter(member => member.role === 'admin')?.map(member => member.user_id) || [];
    const members = data.community_members?.filter(member => member.role === 'member')?.map(member => member.user_id) || [];

    return {
      id: data.id,
      name: data.name,
      description: data.description || '',
      location: data.location || 'Remote',
      imageUrl: data.logo_url || '/placeholder.svg',
      memberCount: data.member_count || 0,
      organizerIds: organizers,
      memberIds: members,
      tags: [],  // You might want to add a tags relationship later
      isPublic: data.is_public
    };
  } catch (err) {
    console.error("Error in getCommunityById:", err);
    const mockCommunity = mockCommunities.find(community => community.id === id);
    return mockCommunity ? mapLegacyCommunity(mockCommunity) : null;
  }
};

/**
 * Searches communities by a query string
 */
export const searchCommunities = async (query: string): Promise<Community[]> => {
  try {
    const { data, error } = await supabase
      .from('communities')
      .select('*')
      .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
      .order('name');
    
    if (error) {
      console.error("Error searching communities:", error);
      const lowercaseQuery = query.toLowerCase();
      const filteredCommunities = mockCommunities.filter(community => 
        community.name.toLowerCase().includes(lowercaseQuery) ||
        community.description.toLowerCase().includes(lowercaseQuery) ||
        community.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
      );
      return filteredCommunities.map(mapLegacyCommunity);
    }
    
    if (!data || data.length === 0) {
      console.log("No matching communities found in database, using filtered mock data");
      const lowercaseQuery = query.toLowerCase();
      const filteredCommunities = mockCommunities.filter(community => 
        community.name.toLowerCase().includes(lowercaseQuery) ||
        community.description.toLowerCase().includes(lowercaseQuery) ||
        community.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
      );
      return filteredCommunities.map(mapLegacyCommunity);
    }
    
    return data.map(mapDbCommunity);
  } catch (err) {
    console.error("Error in searchCommunities:", err);
    const lowercaseQuery = query.toLowerCase();
    const filteredCommunities = mockCommunities.filter(community => 
      community.name.toLowerCase().includes(lowercaseQuery) ||
      community.description.toLowerCase().includes(lowercaseQuery) ||
      community.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
    );
    return filteredCommunities.map(mapLegacyCommunity);
  }
};

/**
 * Gets communities managed by a specific user
 */
export const getManagedCommunities = async (userId: string): Promise<Community[]> => {
  if (!userId) {
    console.error("getManagedCommunities called with no userId");
    return [];
  }

  console.log("Repository: Fetching managed communities for user:", userId);
  
  try {
    // First try to get real communities from database through community_members table
    const { data, error } = await supabase
      .from('community_members')
      .select(`
        community_id,
        role,
        communities:community_id(*)
      `)
      .eq('user_id', userId)
      .eq('role', 'admin');
    
    if (error) {
      console.error("Error fetching managed communities:", error);
      // Fall back to mock data
      console.log("Using mock data for managed communities");
      const filteredCommunities = mockCommunities.filter(community => 
        community.organizerIds.includes(userId)
      );
      return filteredCommunities.map(mapLegacyCommunity);
    }
    
    if (!data || data.length === 0) {
      console.log("No managed communities found in database for user", userId);
      // If no real communities, use mock data
      const filteredCommunities = mockCommunities.filter(community => 
        community.organizerIds.includes(userId)
      );
      
      if (filteredCommunities.length > 0) {
        console.log(`Found ${filteredCommunities.length} mock communities managed by user ${userId}`);
        return filteredCommunities.map(mapLegacyCommunity);
      } else {
        console.log("No managed communities found for user in mock data either");
        return [];
      }
    }
    
    console.log(`Repository: Found ${data.length} real communities managed by user ${userId}`);
    const communities = data
      .filter(item => item.communities) // Filter out null communities
      .map(item => mapDbCommunity(item.communities));
    
    return communities;
  } catch (err) {
    console.error("Error in getManagedCommunities:", err);
    // If error, fall back to mock data
    const filteredCommunities = mockCommunities.filter(community => 
      community.organizerIds.includes(userId)
    );
    return filteredCommunities.map(mapLegacyCommunity);
  }
};
