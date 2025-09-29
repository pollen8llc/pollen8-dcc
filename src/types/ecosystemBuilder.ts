// Ecosystem Builder Types

export type CommunityType = 
  | 'local'
  | 'online'
  | 'hybrid'
  | 'membership-based'
  | 'chapter-based'
  | 'event-driven';

export type CommunityPurpose = 
  | 'advocacy'
  | 'learning'
  | 'lifestyle'
  | 'business'
  | 'social'
  | 'professional'
  | 'creative';

export type PlatformCategory = 
  | 'event-management'
  | 'member-management'
  | 'communication'
  | 'social-platforms'
  | 'payments'
  | 'crm-analytics'
  | 'email-newsletters'
  | 'knowledge-base'
  | 'collaboration'
  | 'fundraising'
  | 'streaming-video'
  | 'open-source';

export interface Demographics {
  ageRange?: string;
  location?: string;
  identityFocus?: string[];
  size?: string;
}

export interface TechStackItem {
  platform: string;
  category: PlatformCategory;
  status: 'active' | 'recommended' | 'considering';
}

export interface Milestone {
  id: string;
  title: string;
  description: string;
  status: 'completed' | 'in-progress' | 'pending';
  tools: string[];
  resources: string[];
  order: number;
}

export interface EcosystemProfile {
  id: string;
  userId: string;
  hasExistingNetwork: boolean;
  demographics: Demographics;
  communityType: CommunityType;
  purpose: CommunityPurpose;
  techStack: TechStackItem[];
  milestones: Milestone[];
  createdAt: string;
  updatedAt: string;
}

export interface Platform {
  id: string;
  name: string;
  category: PlatformCategory;
  description: string;
  bestFor: CommunityType[];
  regions: string[];
  purposes: CommunityPurpose[];
  pricing: string;
  integrations: string[];
}

export interface AnalyticsData {
  memberGrowth: { month: string; count: number }[];
  engagement: { metric: string; value: number; change: number }[];
  platformUsage: { platform: string; users: number; active: number }[];
  relationships: { type: string; count: number }[];
}
