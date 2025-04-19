
import { Community } from "@/models/types";
import { supabase, mockCommunities, mapDbCommunity, mapLegacyCommunity } from "../../base/baseRepository";

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
