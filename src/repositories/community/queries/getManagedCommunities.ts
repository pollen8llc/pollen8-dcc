import { Community } from "@/models/types";
import { supabase } from "@/integrations/supabase/client";
import { mockCommunities, mapDbCommunity, mapLegacyCommunity } from "../../base/baseRepository";

export const getManagedCommunities = async (userId: string): Promise<Community[]> => {
  if (!userId) {
    console.error("getManagedCommunities called with no userId");
    return [];
  }

  console.log("Repository: Fetching managed communities for user:", userId);
  
  try {
    // Use the RPC function we created to get user's owned communities
    const { data, error } = await supabase.rpc('get_user_owned_communities', {
      user_id: userId
    });
    
    if (error) {
      console.error("Error fetching managed communities:", error);
      return getMockManagedCommunities(userId);
    }
    
    if (!data || data.length === 0) {
      console.log("No managed communities found for user", userId);
      return getMockManagedCommunities(userId);
    }
    
    // Get the full community details
    const communityIds = data.map(item => item.community_id);
    const { data: communities, error: communitiesError } = await supabase
      .from('communities')
      .select('*')
      .in('id', communityIds);
    
    if (communitiesError || !communities) {
      console.error("Error fetching community details:", communitiesError);
      return getMockManagedCommunities(userId);
    }
    
    console.log(`Repository: Found ${communities.length} real communities managed by user ${userId}`);
    return communities.map(mapDbCommunity);
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
