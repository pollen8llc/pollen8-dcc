export type Nomin8Classification = 'Ambassador' | 'Volunteer' | 'Supporter' | 'Moderator';

export interface Nomin8Profile {
  id: string;
  contactId: string; // Reference to REL8 contact
  name: string;
  email: string;
  avatar?: string;
  location?: string;
  classification: Nomin8Classification;
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

export interface Nomin8Metrics {
  totalProfiles: number;
  averageEngagement: number;
  totalEvents: number;
  activeThisMonth: number;
  classificationBreakdown: Record<Nomin8Classification, number>;
}

export interface Nomin8Filter {
  classification?: Nomin8Classification | 'all';
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