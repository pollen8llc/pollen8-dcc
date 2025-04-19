
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
        is_public: community.isPublic
      })
      .eq('id', community.id)
      .select()
      .single();
    
    if (error) {
      console.error("Error updating community:", error);
      return community;
    }
    
    return mapDbCommunity(data);
  } catch (err) {
    console.error("Error in updateCommunity:", err);
    return community;
  }
};

/**
 * Creates a new community
 */
export const createCommunity = async (community: Partial<Community>): Promise<Community> => {
  try {
    console.log("Repository: Creating community with data:", community);
    
    // Create the community entry
    const { data, error } = await supabase
      .from('communities')
      .insert({
        name: community.name || "New Community",
        description: community.description || "",
        logo_url: community.imageUrl || "https://images.unsplash.com/photo-1577962917302-cd874c4e31d2?q=80&w=1742&auto=format&fit=crop&ixlib=rb-4.0.3",
        website: community.website || "",
        is_public: community.isPublic !== undefined ? community.isPublic : true,
        // Adding location as a column in the database if it exists
        location: community.location || "Remote"
      })
      .select()
      .single();
    
    if (error) {
      console.error("Error creating community:", error);
      console.error("Error details:", error.details, error.hint, error.message);
      
      // Create a fallback community object with timestamp-based ID for debugging
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
        updatedAt: new Date().toISOString(),
        website: community.website || ""
      };
    }
    
    console.log("Repository: Community created successfully:", data);
    
    // Add current user as admin
    try {
      const session = await supabase.auth.getSession();
      const userId = session.data.session?.user.id;
      
      if (userId) {
        const { error: memberError } = await supabase
          .from('community_members')
          .insert({
            community_id: data.id,
            user_id: userId,
            role: 'admin'
          });
          
        if (memberError) {
          console.error("Error adding user as community admin:", memberError);
        }
      } else {
        console.log("No authenticated user found to set as community admin");
      }
    } catch (memberErr) {
      console.error("Error during membership creation:", memberErr);
    }
    
    return mapDbCommunity(data);
  } catch (err) {
    console.error("Error in createCommunity:", err);
    // Create a fallback community object with timestamp-based ID
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
      updatedAt: new Date().toISOString(),
      website: community.website || ""
    };
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
    
    // Check if user is an admin of this community
    const { data: memberData, error: memberError } = await supabase
      .from('community_members')
      .select('*')
      .eq('community_id', communityId)
      .eq('user_id', userId)
      .eq('role', 'admin')
      .single();
    
    if (memberError || !memberData) {
      console.error("User is not an admin of this community or community doesn't exist");
      throw new Error("Permission denied");
    }
    
    // Delete community members first (cascade not enabled by default)
    await supabase
      .from('community_members')
      .delete()
      .eq('community_id', communityId);
    
    // Now delete the community
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
