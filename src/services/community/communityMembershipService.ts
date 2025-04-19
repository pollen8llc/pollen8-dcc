
import * as communityRepository from "@/repositories/community";

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
