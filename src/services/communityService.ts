
/**
 * @deprecated This service is maintained for backward compatibility only.
 * The community functionality has been removed from the platform.
 */

// Error types
export class CommunityError extends Error {
  constructor(message: string, public code?: string) {
    super(message);
    this.name = "CommunityError";
  }
}

export class PermissionError extends CommunityError {
  constructor(message = "You don't have permission to perform this action") {
    super(message, "permission_denied");
    this.name = "PermissionError";
  }
}

// Get all communities (with optional filters)
export const getAllCommunities = async (page = 1) => {
  console.warn("getAllCommunities: Community functionality has been removed");
  return { data: [], count: 0 };
};

// Get community by ID
export const getCommunityById = async (id: string) => {
  console.warn("getCommunityById: Community functionality has been removed");
  throw new CommunityError("Community not found", "not_found");
};

// Search for communities
export const searchCommunities = async (query: string) => {
  console.warn("searchCommunities: Community functionality has been removed");
  return { data: [], count: 0 };
};

// Additional exports for backward compatibility
export const createCommunity = async () => {
  console.warn("createCommunity: Community functionality has been removed");
  throw new CommunityError("Community functionality has been removed");
};

export const updateCommunity = async () => {
  console.warn("updateCommunity: Community functionality has been removed");
  throw new CommunityError("Community functionality has been removed");
};

export const deleteCommunity = async () => {
  console.warn("deleteCommunity: Community functionality has been removed");
  throw new CommunityError("Community functionality has been removed");
};

export const getManagedCommunities = async () => {
  console.warn("getManagedCommunities: Community functionality has been removed");
  return [];
};
