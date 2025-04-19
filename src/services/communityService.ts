import { Community, CommunityOrganizerProfile } from "@/models/types";
import * as communityRepository from "@/repositories/community";
import { supabase } from "@/integrations/supabase/client";

/**
 * Gets all communities
 */
export const getAllCommunities = async (): Promise<Community[]> => {
  try {
    return await communityRepository.getAllCommunities();
  } catch (error) {
    console.error("Error in getAllCommunities service:", error);
    return [];
  }
};

/**
 * Gets a community by its ID
 */
export const getCommunityById = async (id: string): Promise<Community | null> => {
  try {
    return await communityRepository.getCommunityById(id);
  } catch (error) {
    console.error(`Error in getCommunityById service for id ${id}:`, error);
    return null;
  }
};

/**
 * Searches communities by a query string
 */
export const searchCommunities = async (query: string): Promise<Community[]> => {
  try {
    return await communityRepository.searchCommunities(query);
  } catch (error) {
    console.error(`Error in searchCommunities service for query ${query}:`, error);
    return [];
  }
};

/**
 * Gets communities managed by a specific user
 */
export const getManagedCommunities = async (userId: string): Promise<Community[]> => {
  try {
    console.log(`[communityService] Getting managed communities for user: ${userId}`);
    const communities = await communityRepository.getManagedCommunities(userId);
    console.log(`[communityService] Found ${communities.length} managed communities`);
    return communities;
  } catch (error) {
    console.error(`Error in getManagedCommunities service for userId ${userId}:`, error);
    return [];
  }
};

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
    
    // Create the community with fields that match the actual database schema
    const { data: newCommunity, error } = await supabase
      .from('communities')
      .insert({
        name: community.name,
        description: community.description,
        location: community.location,
        website: community.website || "",
        is_public: true,
        member_count: 1, // Starting with 1 for the creator
        logo_url: "https://images.unsplash.com/photo-1577962917302-cd874c4e31d2?q=80&w=1742&auto=format&fit=crop&ixlib=rb-4.0.3",
        // Store custom fields in appropriate columns that exist in the database
        founder_name: community.founder_name || "",
        role_title: community.role_title || "",
        personal_background: community.personal_background || "",
        community_structure: community.community_structure || "",
        vision: community.vision || "",
        community_values: community.community_values || ""
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating community:', error);
      throw error;
    }

    console.log('Created new community:', newCommunity);
    
    // Transform the Supabase response to match the Community type
    const transformedCommunity: Community = {
      id: newCommunity.id,
      name: newCommunity.name,
      description: newCommunity.description || "",
      location: newCommunity.location || "Remote",
      imageUrl: newCommunity.logo_url || "https://images.unsplash.com/photo-1577962917302-cd874c4e31d2?q=80&w=1742&auto=format&fit=crop&ixlib=rb-4.0.3",
      memberCount: newCommunity.member_count || 1,
      organizerIds: [],
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
    
    return transformedCommunity;
  } catch (error) {
    console.error("Error in createCommunity service:", error);
    throw error;
  }
};

/**
 * Deletes a community
 */
export const deleteCommunity = async (communityId: string): Promise<void> => {
  try {
    return await communityRepository.deleteCommunity(communityId);
  } catch (error) {
    console.error(`Error in deleteCommunity service for communityId ${communityId}:`, error);
    throw error;
  }
};

/**
 * Joins a community
 */
export const joinCommunity = async (userId: string, communityId: string): Promise<void> => {
  try {
    return await communityRepository.joinCommunity(userId, communityId);
  } catch (error) {
    console.error(`Error in joinCommunity service for userId ${userId}, communityId ${communityId}:`, error);
    throw error;
  }
};

/**
 * Leaves a community
 */
export const leaveCommunity = async (userId: string, communityId: string): Promise<void> => {
  try {
    return await communityRepository.leaveCommunity(userId, communityId);
  } catch (error) {
    console.error(`Error in leaveCommunity service for userId ${userId}, communityId ${communityId}:`, error);
    throw error;
  }
};

/**
 * Makes a user an admin of a community
 */
export const makeAdmin = async (adminId: string, userId: string, communityId: string): Promise<void> => {
  try {
    return await communityRepository.makeAdmin(adminId, userId, communityId);
  } catch (error) {
    console.error(`Error in makeAdmin service:`, error);
    throw error;
  }
};

/**
 * Removes admin role from a user
 */
export const removeAdmin = async (adminId: string, userId: string, communityId: string): Promise<void> => {
  try {
    return await communityRepository.removeAdmin(adminId, userId, communityId);
  } catch (error) {
    console.error(`Error in removeAdmin service:`, error);
    throw error;
  }
};

/**
 * Creates a new organizer profile
 */
export const createOrganizerProfile = async (profile: Omit<CommunityOrganizerProfile, 'id' | 'created_at' | 'updated_at'>) => {
  try {
    console.log("Service: Creating organizer profile with data:", profile);
    
    if (!profile.community_id) {
      throw new Error("Community ID is required for organizer profile");
    }
    
    // Check if a profile already exists for this community to avoid duplicates
    const { data: existingProfile, error: checkError } = await supabase
      .from('community_organizer_profiles')
      .select('id')
      .eq('community_id', profile.community_id)
      .maybeSingle();
      
    if (checkError) {
      console.error('Error checking for existing profile:', checkError);
    }
    
    // If profile exists, update it instead of creating a new one
    if (existingProfile?.id) {
      console.log('Organizer profile already exists, updating it:', existingProfile.id);
      const { data: updatedProfile, error: updateError } = await supabase
        .from('community_organizer_profiles')
        .update({
          founder_name: profile.founder_name,
          role_title: profile.role_title,
          personal_background: profile.personal_background,
          size_demographics: profile.size_demographics,
          community_structure: profile.community_structure,
          team_structure: profile.team_structure,
          tech_stack: profile.tech_stack,
          event_formats: profile.event_formats,
          business_model: profile.business_model,
          community_values: profile.community_values,
          challenges: profile.challenges,
          vision: profile.vision,
          special_notes: profile.special_notes,
          updated_at: new Date().toISOString() // Convert Date to string
        })
        .eq('id', existingProfile.id)
        .select()
        .single();
      
      if (updateError) {
        console.error('Error updating organizer profile:', updateError);
        throw updateError;
      }
      
      return updatedProfile;
    } else {
      // Create new profile
      const { data, error } = await supabase
        .from('community_organizer_profiles')
        .insert({
          community_id: profile.community_id,
          founder_name: profile.founder_name,
          role_title: profile.role_title,
          personal_background: profile.personal_background,
          size_demographics: profile.size_demographics,
          community_structure: profile.community_structure,
          team_structure: profile.team_structure,
          tech_stack: profile.tech_stack,
          event_formats: profile.event_formats,
          business_model: profile.business_model,
          community_values: profile.community_values,
          challenges: profile.challenges,
          vision: profile.vision,
          special_notes: profile.special_notes,
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating organizer profile:', error);
        throw error;
      }

      console.log('Created new organizer profile:', data);
      return data;
    }
  } catch (error) {
    console.error('Error in createOrganizerProfile service:', error);
    throw error;
  }
};

/**
 * Gets the organizer profile for a community
 */
export const getOrganizerProfile = async (communityId: string): Promise<CommunityOrganizerProfile | null> => {
  try {
    const { data, error } = await supabase
      .from('community_organizer_profiles')
      .select('*')
      .eq('community_id', communityId)
      .maybeSingle();
      
    if (error) {
      console.error('Error fetching organizer profile:', error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error(`Error in getOrganizerProfile service for communityId ${communityId}:`, error);
    return null;
  }
};
