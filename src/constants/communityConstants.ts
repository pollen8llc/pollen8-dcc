
/**
 * Constants for community data
 */

// Valid community format values
export const COMMUNITY_FORMATS = {
  ONLINE: 'online',
  IRL: 'IRL',
  HYBRID: 'hybrid'
} as const;

export type CommunityFormat = typeof COMMUNITY_FORMATS[keyof typeof COMMUNITY_FORMATS];

// Valid community type values
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

export type CommunityType = typeof COMMUNITY_TYPES[keyof typeof COMMUNITY_TYPES];

// Valid event frequencies
export const EVENT_FREQUENCIES = {
  DAILY: 'daily',
  WEEKLY: 'weekly',
  BIWEEKLY: 'biweekly',
  MONTHLY: 'monthly',
  QUARTERLY: 'quarterly',
  ADHOC: 'adhoc'
} as const;

export type EventFrequency = typeof EVENT_FREQUENCIES[keyof typeof EVENT_FREQUENCIES];
