
export enum UserRole {
  ADMIN = "ADMIN",
  ORGANIZER = "ORGANIZER", 
  MEMBER = "MEMBER",
  SERVICE_PROVIDER = "SERVICE_PROVIDER"
}

export interface User {
  id: string;
  name: string;
  role: UserRole;
  imageUrl: string;
  email: string;
  bio: string;
  location?: string;
  phone?: string;
  interests?: string[];
  communities: string[];
  managedCommunities?: string[]; // Communities where user is organizer
  createdAt?: string;
  lastLoginAt?: string;
  profile_complete?: boolean;
  labr8_setup_complete?: boolean;
  modul8_setup_complete?: boolean;
}

export interface Community {
  id: string;
  name: string;
  description: string;
  owner_id?: string;
  type?: string;
  format?: string;
  location?: string;
  target_audience?: string[];
  social_media?: Record<string, string | { url?: string }>;
  website?: string;
  created_at: string;
  updated_at: string;
  member_count?: string;
  is_public: boolean;
  newsletter_url?: string;
  logo_url?: string;
  founder_name?: string;
  communitySize: string; // For backward compatibility
  organizerIds: string[];
  memberIds: string[];
  tags: string[];
  tone?: string;
  launchDate?: string;
  memberCapacity?: number;
  eventFrequency?: string;
  primaryPlatforms?: string[];
  event_platforms?: Record<string, string | { url?: string; details?: string }>;
  communication_platforms?: Record<string, string | { url?: string; details?: string }>;
  notification_platforms?: Record<string, string | { url?: string; details?: string }>;
  role_title?: string;
  personal_background?: string;
  community_structure?: string;
  vision?: string;
  community_values?: string;
  size_demographics?: string;
  team_structure?: string;
  tech_stack?: string;
  event_formats?: string;
  business_model?: string;
  challenges?: string;
  special_notes?: string;
  // Added aliases for backward compatibility
  imageUrl?: string; // Alias for logo_url
  isPublic?: boolean; // Alias for is_public
  createdAt?: string; // Alias for created_at
  updatedAt?: string; // Alias for updated_at
  targetAudience?: string[]; // Alias for target_audience
  socialMedia?: Record<string, string | { url?: string }>; // Alias for social_media
  newsletterUrl?: string; // Alias for newsletter_url
  communityType?: string; // Alias for type
}

export interface CommunityStatistics {
  id: string;
  communityId: string;
  memberGrowth?: TimeSeriesData[];
  eventAttendance?: TimeSeriesData[];
  engagementRate?: number;
  topContent?: ContentStats[];
}

export interface TimeSeriesData {
  date: string;
  value: number;
}

export interface ContentStats {
  id: string;
  title: string;
  views: number;
  engagement: number;
}

export interface CommunitySettings {
  id: string;
  communityId: string;
  allowMemberInvites: boolean;
  showMemberList: boolean;
  allowPublicPosts: boolean;
  requireApproval: boolean;
  theme?: CommunityTheme;
}

export interface CommunityTheme {
  primaryColor?: string;
  secondaryColor?: string;
  logoUrl?: string;
  bannerUrl?: string;
}

export interface KnowledgeBase {
  id: string;
  communityId: string;
  title: string;
  description: string;
  sections: KnowledgeSection[];
  createdAt: string;
  updatedAt: string;
  createdById: string;
  isPublic: boolean;
}

export interface KnowledgeSection {
  id: string;
  knowledgeBaseId: string;
  title: string;
  order: number;
  articles: KnowledgeArticle[];
}

export interface KnowledgeArticle {
  id: string;
  title: string;
  content: string;
  user_id: string;
  community_id: string;
  created_at: string;
  updated_at: string;
  views?: number;
  is_answered?: boolean;
  vote_count?: number;
  tags?: KnowledgeTag[];
  comments?: KnowledgeComment[];
}

export interface KnowledgeTag {
  id: string;
  name: string;
  description?: string;
}

export interface KnowledgeComment {
  id: string;
  article_id: string;
  user_id: string;
  content: string;
  created_at: string;
  updated_at: string;
  is_accepted?: boolean;
  vote_count?: number;
}

export interface KnowledgeVote {
  id: string;
  user_id: string;
  article_id?: string;
  comment_id?: string;
  vote_type: number; // 1 for upvote, -1 for downvote
  created_at: string;
}

export interface AdminPermission {
  resource: string;
  actions: string[];
}

export interface UserPermissions {
  userId: string;
  permissions: AdminPermission[];
}

export interface CommunityOrganizerProfile {
  id: string;
  community_id: string;
  founder_name: string;
  role_title?: string;
  personal_background?: string;
  size_demographics?: string;
  community_structure?: string;
  team_structure?: string;
  tech_stack?: string;
  event_formats?: string;
  business_model?: string;
  community_values?: string;
  challenges?: string;
  vision?: string;
  special_notes?: string;
  created_at?: string;
  updated_at?: string;
}
