
// This is a barrel file to maintain backward compatibility
// Import and re-export all community services

import * as communityQueryService from './community/communityQueryService';
import * as communityMutationService from './community/communityMutationService';
import * as communityMembershipService from './community/communityMembershipService';
import * as communityOrganizerService from './community/communityOrganizerService';

// Export all services
export {
  // Query services
  getAllCommunities,
  getCommunityById,
  searchCommunities,
  getManagedCommunities
} from './community/communityQueryService';

export {
  // Mutation services
  createCommunity,
  updateCommunity,
  deleteCommunity
} from './community/communityMutationService';

export {
  // Membership services
  joinCommunity,
  leaveCommunity,
  makeAdmin,
  removeAdmin
} from './community/communityMembershipService';

// Export any organizer services if needed
