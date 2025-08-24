export interface Community {
  id: string;
  name: string;
  description: string;
  bio: string;
  type: string;
  location?: string;
  memberCount: number;
  growthStatus: 'growing' | 'recruiting' | 'active' | 'paused';
  banner: string;
  logo: string;
  organizer: string;
  organizerPhoto: string;
  organizerId: string;
  tags: string[];
  badges: string[];
  isPublic: boolean;
  website?: string;
  email?: string;
  socialLinks?: {
    twitter?: string;
    linkedin?: string;
    facebook?: string;
  };
  stats?: {
    totalMembers: number;
    activeMembers: number;
    monthlyGrowth: number;
  };
  media?: {
    videos: string[];
    images: string[];
  };
  created_at: string;
  updated_at: string;
}

export interface CommunityFormData {
  name: string;
  description: string;
  bio: string;
  type: string;
  location?: string;
  format?: string;
  customLocation?: string;
  communitySize?: string;
  eventFrequency?: string;
  tags: string[];
  isPublic: boolean;
  website?: string;
  email?: string;
  socialLinks?: {
    twitter?: string;
    linkedin?: string;
    facebook?: string;
  };
}

export const COMMUNITY_TYPES = [
  'Technology',
  'Arts & Culture',
  'Health & Wellness',
  'Business & Entrepreneurship',
  'Education',
  'Environment & Sustainability',
  'Social Impact',
  'Sports & Recreation',
  'Food & Cooking',
  'Travel & Adventure',
  'Other'
];

export const GROWTH_STATUS_COLORS = {
  growing: 'bg-green-500',
  recruiting: 'bg-blue-500',
  active: 'bg-primary',
  paused: 'bg-yellow-500'
};