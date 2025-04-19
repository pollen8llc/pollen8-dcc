
import { Community } from "@/models/types";
import * as communityRepository from "@/repositories/community";
import { supabase } from "@/integrations/supabase/client";

/**
 * Updates a community
 */
export const updateCommunity = async (community: Community): Promise<Community> => {
  try {
    return await communityRepository.updateCommunity(community);
  } catch (error) {
    console.error("Error in updateCommunity service:", error);
    throw error;
  }
};

/**
 * Creates a new community
 */
export const createCommunity = async (community: Partial<Community>): Promise<Community> => {
  try {
    console.log("Service: Creating community with data:", community);
    
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    if (sessionError) {
      console.error('Error getting session:', sessionError);
      throw new Error('Authentication required to create a community');
    }
    
    if (!sessionData?.session?.user?.id) {
      console.error('No authenticated user found');
      throw new Error('Authentication required to create a community');
    }
    
    const { data: newCommunity, error } = await supabase
      .from('communities')
      .insert({
        name: community.name,
        description: community.description,
        location: community.location || "Remote",
        website: community.website || "",
        is_public: true,
        logo_url: "https://images.unsplash.com/photo-1577962917302-cd874c4e31d2?q=80&w=1742&auto=format&fit=crop&ixlib=rb-4.0.3",
        founder_name: community.founder_name || "",
        role_title: community.role_title || "",
        personal_background: community.personal_background || "",
        community_structure: community.community_structure || "",
        vision: community.vision || "",
        community_values: community.community_values || "",
        owner_id: sessionData.session.user.id
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating community:', error);
      throw error;
    }

    return {
      id: newCommunity.id,
      name: newCommunity.name,
      description: newCommunity.description || "",
      location: newCommunity.location || "Remote",
      imageUrl: newCommunity.logo_url,
      memberCount: newCommunity.member_count || 1,
      organizerIds: [sessionData.session.user.id],
      memberIds: [],
      tags: community.tags || [],
      isPublic: newCommunity.is_public,
      createdAt: newCommunity.created_at,
      updatedAt: newCommunity.updated_at,
      website: newCommunity.website || "",
      communityType: community.communityType,
      format: community.format,
      tone: community.tone,
      founder_name: newCommunity.founder_name || "",
      role_title: newCommunity.role_title || "",
      personal_background: newCommunity.personal_background || "",
      community_structure: newCommunity.community_structure || "",
      vision: newCommunity.vision || "",
      community_values: newCommunity.community_values || ""
    };
  } catch (error) {
    console.error("Error in createCommunity service:", error);
    throw error;
  }
};

/**
 * Deletes a community using the safe_delete_community database function
 */
export const deleteCommunity = async (communityId: string): Promise<void> => {
  try {
    console.log(`[communityService] Deleting community with ID: ${communityId}`);
    
    // Get current user session
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !sessionData?.session?.user?.id) {
      console.error('Error getting session:', sessionError);
      throw new Error('Authentication required to delete a community');
    }
    
    const userId = sessionData.session.user.id;
    
    // Call the safe_delete_community function
    const { data, error } = await supabase.rpc(
      'safe_delete_community',
      {
        community_id: communityId,
        user_id: userId
      }
    );
    
    if (error) {
      console.error(`Error deleting community:`, error);
      throw new Error(error.message || 'Failed to delete community');
    }
    
    if (data === false) {
      throw new Error('Failed to delete community');
    }
    
    console.log(`[communityService] Successfully deleted community with ID: ${communityId}`);
  } catch (error) {
    console.error(`Error in deleteCommunity service for communityId ${communityId}:`, error);
    throw error;
  }
};
