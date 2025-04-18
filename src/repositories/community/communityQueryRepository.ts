
import { Community } from "@/models/types";
import { supabase, mockCommunities, mapDbCommunity } from "../base/baseRepository";

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
      // Fallback to mock data
      return mockCommunities;
    }
    
    if (!data || data.length === 0) {
      console.log("No communities found in database, using mock data");
      return mockCommunities;
    }
    
    return data.map(mapDbCommunity);
  } catch (err) {
    console.error("Error in getAllCommunities:", err);
    // Fallback to mock data
    return mockCommunities;
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
        community_members!inner(user_id)
      `)
      .eq('id', id)
      .single();
    
    if (error) {
      console.error("Error fetching community:", error);
      const mockCommunity = mockCommunities.find(community => community.id === id);
      return mockCommunity ? mapDbCommunity(mockCommunity) : null;
    }
    
    return mapDbCommunity(data);
  } catch (err) {
    console.error("Error in getCommunityById:", err);
    const mockCommunity = mockCommunities.find(community => community.id === id);
    return mockCommunity ? mapDbCommunity(mockCommunity) : null;
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
      return filteredCommunities.map(mapDbCommunity);
    }
    
    if (!data || data.length === 0) {
      console.log("No matching communities found in database, using filtered mock data");
      const lowercaseQuery = query.toLowerCase();
      const filteredCommunities = mockCommunities.filter(community => 
        community.name.toLowerCase().includes(lowercaseQuery) ||
        community.description.toLowerCase().includes(lowercaseQuery) ||
        community.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
      );
      return filteredCommunities.map(mapDbCommunity);
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
    return filteredCommunities.map(mapDbCommunity);
  }
};

/**
 * Gets communities managed by a specific user
 */
export const getManagedCommunities = async (userId: string): Promise<Community[]> => {
  try {
    const { data, error } = await supabase
      .from('community_members')
      .select(`
        community_id,
        communities:community_id(*)
      `)
      .eq('user_id', userId)
      .eq('role', 'admin');
    
    if (error) {
      console.error("Error fetching managed communities:", error);
      const filteredCommunities = mockCommunities.filter(community => 
        community.organizerIds.includes(userId)
      );
      return filteredCommunities.map(mapDbCommunity);
    }
    
    return data.map(item => mapDbCommunity(item.communities));
  } catch (err) {
    console.error("Error in getManagedCommunities:", err);
    const filteredCommunities = mockCommunities.filter(community => 
      community.organizerIds.includes(userId)
    );
    return filteredCommunities.map(mapDbCommunity);
  }
};
