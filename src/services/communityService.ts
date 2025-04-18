import { Community } from "@/models/types";
import * as communityRepository from "@/repositories/community";

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

/**
 * Creates a new community for a specific user
 */
export const createUserCommunity = async (communityData: Partial<Community>): Promise<Community> => {
  return communityRepository.createCommunity(communityData);
};

/**
 * Deletes a community
 */
export const deleteCommunity = async (communityId: string): Promise<void> => {
  return communityRepository.deleteCommunity(communityId);
};

/**
 * Joins a community
 */
export const joinCommunity = async (userId: string, communityId: string): Promise<void> => {
  return communityRepository.joinCommunity(userId, communityId);
};

/**
 * Leaves a community
 */
export const leaveCommunity = async (userId: string, communityId: string): Promise<void> => {
  return communityRepository.leaveCommunity(userId, communityId);
};

/**
 * Makes a user an admin of a community
 */
export const makeAdmin = async (adminId: string, userId: string, communityId: string): Promise<void> => {
  return communityRepository.makeAdmin(adminId, userId, communityId);
};

/**
 * Removes admin role from a user
 */
export const removeAdmin = async (adminId: string, userId: string, communityId: string): Promise<void> => {
  return communityRepository.removeAdmin(adminId, userId, communityId);
};
