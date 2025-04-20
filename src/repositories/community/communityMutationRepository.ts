
import { Community } from "@/models/types";
import { supabase } from "@/integrations/supabase/client";
import { mapDbCommunity } from "../base/baseRepository";

export const updateCommunity = async (community: Community): Promise<Community> => {
  try {
    console.log("Updating community:", community.id);
    
    const { data, error } = await supabase
      .from('communities')
      .update({
        name: community.name,
        description: community.description,
        logo_url: community.imageUrl,
        website: community.website,
        is_public: community.isPublic,
        location: community.location,
        member_count: community.communitySize
      })
      .eq('id', community.id)
      .select()
      .single();
    
    if (error) {
      console.error("Error updating community:", error);
      throw error;
    }
    
    console.log("Community updated successfully:", data.id);
    return mapDbCommunity(data);
  } catch (err) {
    console.error("Error in updateCommunity:", err);
    throw err;
  }
};

export const createCommunity = async (community: Partial<Community>): Promise<Community> => {
  try {
    // Log the community data for debugging
    console.log("Creating community in repository with data:", community);

    // Extract the creator ID (first organizer) to use as owner_id in the database
    const owner_id = community.organizerIds && community.organizerIds.length > 0 
      ? community.organizerIds[0] 
      : null;

    // Extract tags for the database
    const target_audience = Array.isArray(community.tags) ? community.tags : [];

    // Extract social media values if they exist
    const socialMedia = community.socialMedia || {};
    
    // Build the database record
    const { data, error } = await supabase
      .from('communities')
      .insert({
        name: community.name || "New Community",
        description: community.description || "",
        logo_url: community.imageUrl || "https://images.unsplash.com/photo-1577962917302-cd874c4e31d2?q=80&w=1742&auto=format&fit=crop&ixlib=rb-4.0.3",
        website: community.website || "",
        is_public: community.isPublic !== undefined ? community.isPublic : true,
        location: community.location || "Remote",
        member_count: community.communitySize || 0,
        owner_id: owner_id,
        target_audience: target_audience,
        community_type: community.communityType || null,
        format: community.format || null,
        role_title: community.role_title || null,
        community_structure: community.community_structure || null,
        vision: community.vision || null,
        social_media: socialMedia,
        communication_platforms: community.communication_platforms || {},
        newsletter_url: community.newsletterUrl || null
      })
      .select()
      .single();
    
    if (error) {
      console.error("Error creating community:", error);
      throw error;
    }
    
    console.log("Community created successfully:", data.id);
    return mapDbCommunity(data);
  } catch (err) {
    console.error("Error in createCommunity:", err);
    throw err;
  }
};

export const deleteCommunity = async (communityId: string): Promise<void> => {
  try {
    console.log("Deleting community:", communityId);
    
    // Use the safe_delete_community function instead of direct delete
    // This ensures proper ownership validation and auditing
    const { data, error } = await supabase.rpc('safe_delete_community', {
      community_id: communityId,
      user_id: (await supabase.auth.getUser()).data.user?.id
    });
    
    if (error) {
      console.error("Error deleting community:", error);
      throw error;
    }
    
    if (!data) {
      throw new Error("Failed to delete community - you may not be the owner");
    }
    
    console.log("Community deleted successfully:", communityId);
  } catch (err) {
    console.error("Error in deleteCommunity:", err);
    throw err;
  }
};
