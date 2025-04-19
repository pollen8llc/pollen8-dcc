
import { Community } from "@/models/types";
import * as communityRepository from "@/repositories/community";

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
