
import { supabase } from "@/integrations/supabase/client";
import { Community } from "@/models/types";
import { communities as mockCommunities } from "@/data/communities";

/**
 * Gets all communities
 */
export const getAllCommunities = async (): Promise<Community[]> => {
  // When database is ready, use this:
  // const { data, error } = await supabase.from('communities').select('*');
  // if (error) throw error;
  // return data as Community[];
  
  return mockCommunities as unknown as Community[];
};

/**
 * Gets a community by its ID
 */
export const getCommunityById = async (id: string): Promise<Community | null> => {
  // When database is ready, use this:
  // const { data, error } = await supabase.from('communities').select('*').eq('id', id).single();
  // if (error) return null;
  // return data as Community;
  
  const community = mockCommunities.find(community => community.id === id);
  return community ? (community as unknown as Community) : null;
};

/**
 * Searches communities by a query string
 */
export const searchCommunities = async (query: string): Promise<Community[]> => {
  // When database is ready, use this:
  // const { data, error } = await supabase
  //   .from('communities')
  //   .select('*')
  //   .or(`name.ilike.%${query}%,description.ilike.%${query}%,tags.cs.{${query}}`)
  //   .order('name');
  // if (error) throw error;
  // return data as Community[];
  
  const lowercaseQuery = query.toLowerCase();
  return mockCommunities.filter(community => 
    community.name.toLowerCase().includes(lowercaseQuery) ||
    community.description.toLowerCase().includes(lowercaseQuery) ||
    community.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
  ) as unknown as Community[];
};

/**
 * Gets communities managed by a specific user
 */
export const getManagedCommunities = async (userId: string): Promise<Community[]> => {
  // When database is ready, use this:
  // const { data, error } = await supabase
  //   .from('communities')
  //   .select('*')
  //   .contains('organizerIds', [userId]);
  // if (error) throw error;
  // return data as Community[];
  
  return mockCommunities.filter(community => 
    community.organizerIds.includes(userId)
  ) as unknown as Community[];
};

/**
 * Updates a community
 */
export const updateCommunity = async (community: Community): Promise<Community> => {
  // When database is ready, use this:
  // const { data, error } = await supabase
  //   .from('communities')
  //   .update(community)
  //   .eq('id', community.id)
  //   .select()
  //   .single();
  // if (error) throw error;
  // return data as Community;
  
  // For development, just return the community as is
  return community;
};

/**
 * Creates a new community
 */
export const createCommunity = async (community: Partial<Community>): Promise<Community> => {
  // When database is ready, use this:
  // const { data, error } = await supabase
  //   .from('communities')
  //   .insert(community)
  //   .select()
  //   .single();
  // if (error) throw error;
  // return data as Community;
  
  // For development, just return a mock community
  return {
    id: String(Date.now()),
    name: community.name || "New Community",
    description: community.description || "",
    location: community.location || "Remote",
    imageUrl: community.imageUrl || "https://images.unsplash.com/photo-1577962917302-cd874c4e31d2?q=80&w=1742&auto=format&fit=crop&ixlib=rb-4.0.3",
    memberCount: 1,
    organizerIds: community.organizerIds || ["25"],
    memberIds: community.memberIds || [],
    tags: community.tags || [],
    isPublic: community.isPublic !== undefined ? community.isPublic : true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
};
