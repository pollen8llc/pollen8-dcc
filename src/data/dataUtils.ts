
import { User, Community } from "./types";
import { users } from "./users";

/**
 * @deprecated Community functionality has been removed. This function is kept for
 * backward compatibility only.
 */
export const getCommunityById = (id: string): Community | undefined => {
  console.warn("getCommunityById: Community functionality has been removed");
  return undefined;
};

export const getUserById = (id: string): User | undefined => {
  return users.find((user) => user.id === id);
};

/**
 * @deprecated Community functionality has been removed. This function is kept for
 * backward compatibility only.
 */
export const getCommunityMembers = (communityId: string): User[] => {
  console.warn("getCommunityMembers: Community functionality has been removed");
  return [];
};

/**
 * @deprecated Community functionality has been removed. This function is kept for
 * backward compatibility only.
 */
export const getCommunityOrganizers = (communityId: string): User[] => {
  console.warn("getCommunityOrganizers: Community functionality has been removed");
  return [];
};

/**
 * @deprecated Community functionality has been removed. This function is kept for
 * backward compatibility only.
 */
export const getCommunityRegularMembers = (communityId: string): User[] => {
  console.warn("getCommunityRegularMembers: Community functionality has been removed");
  return [];
};
