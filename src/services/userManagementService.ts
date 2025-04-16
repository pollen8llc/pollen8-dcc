
import { getAllUsers } from "./userQueryService";
import { updateUserRole, getRoles } from "./roleService";
import { inviteUser, resetUserPassword } from "./userInvitationService";
import { deactivateUser, getUserCommunities } from "./userAccountService";

// Re-export everything for backward compatibility
export {
  getAllUsers,
  updateUserRole,
  inviteUser,
  deactivateUser,
  resetUserPassword,
  getRoles,
  getUserCommunities
};
