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
  memberCount: number;
  organizerIds: string[];
  memberIds: string[];
  tags: string[];
  isPublic: boolean;
  createdAt?: string;
  updatedAt?: string;
  statistics?: CommunityStatistics;
  settings?: CommunitySettings;
  website?: string;
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
  sectionId: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  authorId: string;
  tags: string[];
  views: number;
}

export interface AdminPermission {
  resource: string;
  actions: string[];
}

export interface UserPermissions {
  userId: string;
  permissions: AdminPermission[];
}
