
import { UserRole } from "@/models/types";

export interface UnifiedProfile {
  id: string;
  user_id?: string;
  email: string;
  first_name: string;
  last_name: string;
  bio?: string;
  location?: string;
  avatar_url?: string;
  interests?: string[];
  social_links?: Record<string, string>;
  privacy_settings?: {
    profile_visibility?: string;
  };
  role?: UserRole;
  created_at: string;
  updated_at: string;
  phone?: string;
  website?: string;
}

export interface ProfileViewProps {
  profile: UnifiedProfile;
  isOwnProfile: boolean;
  onEdit: () => void;
}
