
import { Community } from "@/models/types";
import * as communityRepository from "@/repositories/community";

/**
 * Gets all communities with pagination
 */
export const getAllCommunities = async (page = 1, pageSize = 12): Promise<Community[]> => {
  try {
    console.log(`[communityService] Getting all communities: page ${page}, pageSize ${pageSize}`);
    return await communityRepository.getAllCommunities(page, pageSize);
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
 * Searches communities by a query string (client-side)
 * @deprecated Use searchCommunitiesServer for better performance
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
 * Searches communities by a query string (server-side)
 */
export const searchCommunitiesServer = async (query: string, page = 1, pageSize = 12): Promise<Community[]> => {
  try {
    console.log(`[communityService] Searching communities with query "${query}": page ${page}, pageSize ${pageSize}`);
    return await communityRepository.searchCommunitiesServer(query, page, pageSize);
  } catch (error) {
    console.error(`Error in searchCommunitiesServer service for query ${query}:`, error);
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
