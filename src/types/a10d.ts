export type A10DClassification = 'Ambassador' | 'Volunteer' | 'Supporter' | 'Moderator';

export interface A10DProfile {
  id: string;
  contactId: string; // Reference to REL8 contact
  name: string;
  email: string;
  avatar?: string;
  location?: string;
  classification: A10DClassification;
  communityEngagement: number; // 0-100 percentage
  eventsAttended: number;
  interests: string[];
  joinDate: string;
  lastActive: string;
  notes?: string;
  socialMedia?: {
    twitter?: string;
    linkedin?: string;
    instagram?: string;
    facebook?: string;
    github?: string;
    behance?: string;
  };
}

export interface A10DMetrics {
  totalProfiles: number;
  averageEngagement: number;
  totalEvents: number;
  activeThisMonth: number;
  classificationBreakdown: Record<A10DClassification, number>;
}

export interface A10DFilter {
  classification?: A10DClassification | 'all';
  engagementRange?: {
    min: number;
    max: number;
  };
  eventsRange?: {
    min: number;
    max: number;
  };
  interests?: string[];
  lastActiveWithin?: number; // days
}