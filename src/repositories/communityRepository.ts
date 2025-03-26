
import { supabase } from "@/integrations/supabase/client";
import { Community } from "@/models/types";
import { communities as mockCommunities } from "@/data/communities";

/**
 * Retrieves all communities from the data source.
 * Currently using mock data, but ready for Supabase integration.
 */
export const getAllCommunities = async (): Promise<Community[]> => {
  // When database is ready, use this:
  // const { data, error } = await supabase.from('communities').select('*');
  // if (error) throw error;
  // return data as Community[];
  
  return mockCommunities;
};

/**
 * Retrieves a community by its ID from the data source.
 */
export const getCommunityById = async (id: string): Promise<Community | null> => {
  // When database is ready, use this:
  // const { data, error } = await supabase.from('communities').select('*').eq('id', id).single();
  // if (error) return null;
  // return data as Community;
  
  const community = mockCommunities.find(community => community.id === id);
  return community || null;
};

/**
 * Searches communities based on a query.
 */
export const searchCommunities = async (query: string): Promise<Community[]> => {
  if (!query.trim()) return mockCommunities;
  
  const q = query.toLowerCase();
  return mockCommunities.filter(
    community =>
      community.name.toLowerCase().includes(q) ||
      community.description.toLowerCase().includes(q) ||
      community.location.toLowerCase().includes(q) ||
      community.tags.some(tag => tag.toLowerCase().includes(q))
  );
};
