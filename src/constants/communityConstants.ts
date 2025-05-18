
/**
 * @deprecated These constants are kept for backwards compatibility only.
 * Community functionality has been removed from the platform.
 */

export const COMMUNITY_TYPES = {
  TECH: 'tech',
  CREATIVE: 'creative',
  WELLNESS: 'wellness',
  PROFESSIONAL: 'professional',
  SOCIAL_IMPACT: 'social-impact',
  EDUCATION: 'education',
  SOCIAL: 'social',
  OTHER: 'other'
} as const;

export type CommunityType = (typeof COMMUNITY_TYPES)[keyof typeof COMMUNITY_TYPES];

export const COMMUNITY_FORMATS = {
  ONLINE: 'online',
  IRL: 'IRL',
  HYBRID: 'hybrid'
} as const;

export type CommunityFormat = (typeof COMMUNITY_FORMATS)[keyof typeof COMMUNITY_FORMATS];

export const EVENT_FREQUENCIES = {
  DAILY: 'daily',
  WEEKLY: 'weekly',
  BIWEEKLY: 'biweekly',
  MONTHLY: 'monthly',
  QUARTERLY: 'quarterly',
  ADHOC: 'adhoc'
} as const;

export type EventFrequency = (typeof EVENT_FREQUENCIES)[keyof typeof EVENT_FREQUENCIES];

export const COMMUNITY_SIZES = [
  '1-10',
  '11-50',
  '51-100',
  '101-500',
  '501-1000',
  '1000+'
] as const;

export type CommunitySize = (typeof COMMUNITY_SIZES)[number];
