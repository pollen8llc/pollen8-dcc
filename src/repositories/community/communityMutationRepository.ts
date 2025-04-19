
import { Community } from "@/models/types";
import { supabase, mapDbCommunity } from "../base/baseRepository";

export const updateCommunity = async (community: Community): Promise<Community> => {
  try {
    const { data, error } = await supabase
      .from('communities')
      .update({
        name: community.name,
        description: community.description,
        logo_url: community.imageUrl,
        website: community.website,
        is_public: community.isPublic,
        location: community.location
      })
      .eq('id', community.id)
      .select()
      .single();
    
    if (error) {
      console.error("Error updating community:", error);
      throw error;
    }
    
    return mapDbCommunity(data);
  } catch (err) {
    console.error("Error in updateCommunity:", err);
    throw err;
  }
};

export const createCommunity = async (community: Partial<Community>): Promise<Community> => {
  try {
    // Extract the creator ID (first organizer) to use as owner_id in the database
    const { data, error } = await supabase
      .from('communities')
      .insert({
        name: community.name || "New Community",
        description: community.description || "",
        logo_url: community.imageUrl || "https://images.unsplash.com/photo-1577962917302-cd874c4e31d2?q=80&w=1742&auto=format&fit=crop&ixlib=rb-4.0.3",
        website: community.website || "",
        is_public: community.isPublic !== undefined ? community.isPublic : true,
        location: community.location || "Remote",
        // Use the first organizer ID as the owner_id, or null if no organizers
        owner_id: community.organizerIds && community.organizerIds.length > 0 ? community.organizerIds[0] : null
      })
      .select()
      .single();
    
    if (error) {
      console.error("Error creating community:", error);
      throw error;
    }
    
    return mapDbCommunity(data);
  } catch (err) {
    console.error("Error in createCommunity:", err);
    throw err;
  }
};

export const deleteCommunity = async (communityId: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('communities')
      .delete()
      .eq('id', communityId);
    
    if (error) {
      console.error("Error deleting community:", error);
      throw error;
    }
  } catch (err) {
    console.error("Error in deleteCommunity:", err);
    throw err;
  }
};
