
import { Community } from "@/models/types";
import { supabase } from "@/integrations/supabase/client";

// Import the mapping functions and mock data
import { mapLegacyCommunity, mockCommunities, mapDbCommunity } from "./getAllCommunities";

export const searchCommunities = async (query: string): Promise<Community[]> => {
  try {
    const { data, error } = await supabase
      .from('communities')
      .select('*')
      .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
      .order('name');
    
    if (error) {
      console.error("Error searching communities:", error);
      return filterMockCommunities(query);
    }
    
    if (!data || data.length === 0) {
      console.log("No matching communities found in database, using filtered mock data");
      return filterMockCommunities(query);
    }
    
    return data.map(mapDbCommunity);
  } catch (err) {
    console.error("Error in searchCommunities:", err);
    return filterMockCommunities(query);
  }
};

// Add the server-side search function
export const searchCommunitiesServer = async (query: string, page = 1, pageSize = 12): Promise<Community[]> => {
  try {
    console.log(`Searching communities with query "${query}": page ${page}, pageSize ${pageSize}`);
    
    const { data, error } = await supabase
      .from('communities')
      .select('*')
      .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
      .order('name')
      .range((page - 1) * pageSize, page * pageSize - 1);
    
    if (error) {
      console.error("Error searching communities:", error);
      return filterMockCommunities(query);
    }
    
    if (!data || data.length === 0) {
      console.log("No matching communities found in database, using filtered mock data");
      return filterMockCommunities(query);
    }
    
    return data.map(mapDbCommunity);
  } catch (err) {
    console.error("Error in searchCommunitiesServer:", err);
    return filterMockCommunities(query);
  }
};

const filterMockCommunities = (query: string): Community[] => {
  const lowercaseQuery = query.toLowerCase();
  const filteredCommunities = mockCommunities.filter(community => 
    community.name.toLowerCase().includes(lowercaseQuery) ||
    community.description.toLowerCase().includes(lowercaseQuery) ||
    community.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
  );
  return filteredCommunities.map(mapLegacyCommunity);
};
