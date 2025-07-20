// DEPRECATED: This file is being phased out in favor of the useProfiles hook
// Please use @/hooks/useProfiles instead for all profile operations

import { ExtendedProfile } from "@/types/profiles";

// Re-export the type for backward compatibility
export type { ExtendedProfile };

// All profile functions have been moved to useProfiles hook
// Please update your imports to use:
// import { useProfiles } from "@/hooks/useProfiles";