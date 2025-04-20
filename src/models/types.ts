
export enum UserRole {
  ADMIN = "ADMIN",        // System administrators
  ORGANIZER = "ORGANIZER", // Community organizers
  MEMBER = "MEMBER",      // Regular community members
  GUEST = "GUEST"         // Unauthenticated/public users
}

export interface User {
  id: string;
  name: string;
  role: UserRole;
  imageUrl: string;
  email: string;
  bio: string;
  communities: string[];
  managedCommunities?: string[]; // Communities where user is organizer
  createdAt?: string;
  lastLoginAt?: string;
}

export interface Community {
  id: string;
  name: string;
  description: string;
  location: string;
  imageUrl: string;
  communitySize: string; // Changed from number to string
  organizerIds: string[];
  memberIds: string[];
  tags: string[];
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
  website?: string;
  communityType?: string;
  format?: string;
  targetAudience?: string[];
  tone?: string;
  launchDate?: string;
  memberCapacity?: number;
  eventFrequency?: string;
  newsletterUrl?: string;
  socialMedia?: Record<string, string | { url?: string }>;
  primaryPlatforms?: string[];
  event_platforms?: Record<string, string | { url?: string; details?: string }>;
  communication_platforms?: Record<string, string | { url?: string; details?: string }>;
  notification_platforms?: Record<string, string | { url?: string; details?: string }>;
  founder_name?: string;
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
