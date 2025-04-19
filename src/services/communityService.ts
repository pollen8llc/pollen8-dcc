
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
    return await communityRepository.getManagedCommunities(userId);
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
    return newCommunity;
  } catch (error) {
    console.error("Error in createCommunity service:", error);
    throw error;
  }
};

/**
 * Creates a new community for a specific user
 */
export const createUserCommunity = async (communityData: Partial<Community>): Promise<Community> => {
  try {
    return await communityRepository.createCommunity(communityData);
  } catch (error) {
    console.error("Error in createUserCommunity service:", error);
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
    
    const { data, error } = await supabase
      .from('community_organizer_profiles')
      .insert(profile)
      .select()
      .single();

    if (error) {
      console.error('Error creating organizer profile:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error in createOrganizerProfile service:', error);
    throw error;
  }
};
