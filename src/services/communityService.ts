
import { Community } from "@/models/types";
import * as communityRepository from "@/repositories/communityRepository";

/**
 * Gets all communities
 */
export const getAllCommunities = async (): Promise<Community[]> => {
  return communityRepository.getAllCommunities();
};

/**
 * Gets a community by its ID
 */
export const getCommunityById = async (id: string): Promise<Community | null> => {
  return communityRepository.getCommunityById(id);
};

/**
 * Searches communities by a query string
 */
export const searchCommunities = async (query: string): Promise<Community[]> => {
  return communityRepository.searchCommunities(query);
};

/**
 * Gets communities managed by a specific user
 */
export const getManagedCommunities = async (userId: string): Promise<Community[]> => {
  return communityRepository.getManagedCommunities(userId);
};

/**
 * Updates a community
 */
export const updateCommunity = async (community: Community): Promise<Community> => {
  return communityRepository.updateCommunity(community);
};

/**
 * Creates a new community
 */
export const createCommunity = async (community: Partial<Community>): Promise<Community> => {
  return communityRepository.createCommunity(community);
};
