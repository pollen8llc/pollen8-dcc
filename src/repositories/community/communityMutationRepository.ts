
import { Community } from "@/models/types";
import { supabase, mapDbCommunity } from "../base/baseRepository";

/**
 * Updates a community
 */
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

/**
 * Creates a new community
 */
export const createCommunity = async (community: Partial<Community>): Promise<Community> => {
  try {
    console.log("Repository: Creating community with data:", community);
    
    const { data: sessionData } = await supabase.auth.getSession();
    const currentUserId = sessionData?.session?.user?.id;
    console.log("Current authenticated user ID:", currentUserId);
    
    if (!currentUserId) {
      console.warn("No authenticated user found when creating community");
      throw new Error("Authentication required to create a community");
    }
    
    const { data, error } = await supabase
      .from('communities')
      .insert({
        name: community.name || "New Community",
        description: community.description || "",
        logo_url: community.imageUrl || "https://images.unsplash.com/photo-1577962917302-cd874c4e31d2?q=80&w=1742&auto=format&fit=crop&ixlib=rb-4.0.3",
        website: community.website || "",
        is_public: community.isPublic !== undefined ? community.isPublic : true,
        location: community.location || "Remote",
        founder_name: community.founder_name || "",
        role_title: community.role_title || "",
        personal_background: community.personal_background || "",
        community_structure: community.community_structure || "",
        vision: community.vision || "",
        community_values: community.community_values || "",
        owner_id: currentUserId // Set the owner_id to the current user
      })
      .select()
      .single();
    
    if (error) {
      console.error("Error creating community:", error);
      console.error("Error details:", error.details, error.hint, error.message);
      throw new Error(`Failed to create community: ${error.message}`);
    }
    
    if (!data) {
      console.error("No data returned from community creation");
      throw new Error("No data returned from community creation");
    }
    
    console.log("Repository: Community created successfully:", data);
    return mapDbCommunity(data);
  } catch (err) {
    console.error("Error in createCommunity:", err);
    throw err;
  }
};

/**
 * Deletes a community
 */
export const deleteCommunity = async (communityId: string): Promise<void> => {
  try {
    // First, get the session to verify user has permission
    const session = await supabase.auth.getSession();
    const userId = session.data.session?.user.id;
    
    if (!userId) {
      throw new Error("User not authenticated");
    }
    
    // Check if user is the owner of this community
    const { data: isOwner } = await supabase.rpc('is_community_owner', {
      user_id: userId,
      community_id: communityId
    });
    
    if (!isOwner) {
      console.error("User is not the owner of this community");
      throw new Error("Permission denied");
    }
    
    // Delete the community
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
