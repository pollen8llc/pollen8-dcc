
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
    const newCommunity = await communityRepository.createCommunity(community);
    console.log("Service: Community created successfully:", newCommunity);
    
    // Ensure the creator is added as an admin to the community
    const currentUser = supabase.auth.getUser();
    const userId = (await currentUser).data.user?.id;
    
    if (userId) {
      console.log(`Service: Adding creator (${userId}) as admin for community (${newCommunity.id})`);
      try {
        await communityRepository.joinCommunity(userId, newCommunity.id, 'admin');
        console.log("Service: Creator added as admin successfully");
      } catch (joinError) {
        console.error("Error adding creator as admin:", joinError);
      }
    } else {
      console.warn("Service: Cannot add creator as admin - user ID not available");
    }
    
    return newCommunity;
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
