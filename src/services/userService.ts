
import { User } from "@/models/types";
import * as userRepository from "@/repositories/userRepository";

/**
 * Retrieves a user by their ID.
 */
export const getUserById = async (id: string): Promise<User | null> => {
  return await userRepository.getUserById(id);
};

/**
 * Retrieves all organizers of a specific community.
 */
export const getCommunityOrganizers = async (communityId: string): Promise<User[]> => {
  return await userRepository.getCommunityOrganizers(communityId);
};

/**
 * Retrieves all regular members of a specific community.
 */
export const getCommunityMembers = async (communityId: string): Promise<User[]> => {
  return await userRepository.getCommunityMembers(communityId);
};
