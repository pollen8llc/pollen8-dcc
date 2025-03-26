
import { Community } from "@/models/types";
import * as communityRepository from "@/repositories/communityRepository";

/**
 * Retrieves all communities.
 */
export const getAllCommunities = async (): Promise<Community[]> => {
  return await communityRepository.getAllCommunities();
};

/**
 * Retrieves a community by its ID.
 */
export const getCommunityById = async (id: string): Promise<Community | null> => {
  return await communityRepository.getCommunityById(id);
};

/**
 * Searches for communities based on a query string.
 */
export const searchCommunities = async (query: string): Promise<Community[]> => {
  return await communityRepository.searchCommunities(query);
};
