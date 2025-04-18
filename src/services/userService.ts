
import { User } from "@/models/types";
import * as userRepository from "@/repositories/userRepository";

/**
 * Retrieves a user by their ID.
 */
export const getUserById = async (id: string): Promise<User | null> => {
  console.log("userService: getUserById called with ID", id);
  const result = await userRepository.getUserById(id);
  console.log("userService: getUserById result", result);
  return result;
};

/**
 * Retrieves all organizers of a specific community.
 */
export const getCommunityOrganizers = async (communityId: string): Promise<User[]> => {
  console.log("userService: getCommunityOrganizers called for community", communityId);
  const result = await userRepository.getCommunityOrganizers(communityId);
  console.log("userService: getCommunityOrganizers result", result);
  return result;
};

/**
 * Retrieves all regular members of a specific community.
 */
export const getCommunityMembers = async (communityId: string): Promise<User[]> => {
  console.log("userService: getCommunityMembers called for community", communityId);
  const result = await userRepository.getCommunityMembers(communityId);
  console.log("userService: getCommunityMembers result", result);
  return result;
};

/**
 * Retrieves all users in the system.
 * Useful for admin-level operations.
 */
export const getAllUsers = async (): Promise<User[]> => {
  console.log("userService: getAllUsers called");
  const result = await userRepository.getAllUsers();
  console.log("userService: getAllUsers result count", result?.length);
  return result;
};
