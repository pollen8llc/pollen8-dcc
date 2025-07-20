import { UserRole } from "@/models/types";

export interface ExtendedProfile {
  id: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  avatar_url?: string;
  bio?: string;
  location?: string;
  interests?: string[];
  social_links?: Record<string, string>;
  invited_by?: string;
  profile_complete?: boolean;
  privacy_settings?: {
    profile_visibility: "public" | "connections" | "connections2" | "connections3" | "private";
  };
  created_at?: string;
  updated_at?: string;
  role?: UserRole;
}