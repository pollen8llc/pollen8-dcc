export interface Profile {
  id: string;
  user_id: string;
  first_name?: string;
  last_name?: string;
  email: string;
  avatar_url?: string;
  bio?: string;
  location?: string;
  interests?: string[];
  social_links?: any;
  privacy_settings: any;
  profile_complete: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProfileViewProps {
  profile: Profile;
  isOwnProfile: boolean;
  onEdit?: () => void;
}