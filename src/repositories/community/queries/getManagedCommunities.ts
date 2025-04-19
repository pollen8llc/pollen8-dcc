
import { Community } from "@/models/types";
import { supabase, mockCommunities, mapDbCommunity, mapLegacyCommunity } from "../../base/baseRepository";

export const getManagedCommunities = async (userId: string): Promise<Community[]> => {
  if (!userId) {
    console.error("getManagedCommunities called with no userId");
    return [];
  }

  console.log("Repository: Fetching managed communities for user:", userId);
  
  try {
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
      return getMockManagedCommunities(userId);
    }
    
    if (!data || data.length === 0) {
      console.log("No managed communities found in database for user", userId);
      return getMockManagedCommunities(userId);
    }
    
    console.log(`Repository: Found ${data.length} real communities managed by user ${userId}`);
    return data
      .filter(item => item.communities)
      .map(item => mapDbCommunity(item.communities));
  } catch (err) {
    console.error("Error in getManagedCommunities:", err);
    return getMockManagedCommunities(userId);
  }
};

const getMockManagedCommunities = (userId: string): Community[] => {
  const filteredCommunities = mockCommunities.filter(community => 
    community.organizerIds.includes(userId)
  );
  return filteredCommunities.map(mapLegacyCommunity);
};
