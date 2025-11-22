/**
 * System Email Service
 * Generates and manages unique system emails for calendar event handling
 */

/**
 * Generate a unique system email for a trigger
 * Format: notifications-{shortUserId}{shortTriggerId}@ecosystembuilder.app
 */
export const generateSystemEmail = (userId: string, triggerId: string): string => {
  // Create short identifiers (first 6 chars of each ID)
  const shortUserId = userId.replace(/-/g, '').substring(0, 6);
  const shortTriggerId = triggerId.replace(/-/g, '').substring(0, 6);
  
  return `notifications-${shortUserId}${shortTriggerId}@ecosystembuilder.app`;
};

/**
 * Parse a system email to extract user and trigger information
 * Returns null if the email doesn't match the expected format
 */
export const parseSystemEmail = (email: string): { userId: string; triggerId: string } | null => {
  const match = email.match(/^notifications-([a-f0-9]{6})([a-f0-9]{6})@ecosystembuilder\.app$/);
  
  if (!match) {
    return null;
  }
  
  return {
    userId: match[1],
    triggerId: match[2],
  };
};

/**
 * Validate that an email is a valid system email
 */
export const isSystemEmail = (email: string): boolean => {
  return /^notifications-[a-f0-9]{12}@ecosystembuilder\.app$/.test(email);
};

/**
 * Generate a unique system email for an outreach task
 * Format: notifications-{shortUserId}{shortOutreachId}@ecosystembuilder.app
 */
export const generateOutreachSystemEmail = (userId: string, outreachId: string): string => {
  const shortUserId = userId.replace(/-/g, '').substring(0, 6);
  const shortOutreachId = outreachId.replace(/-/g, '').substring(0, 6);
  
  return `notifications-${shortUserId}${shortOutreachId}@ecosystembuilder.app`;
};

/**
 * Parse an outreach system email to extract user and outreach information
 * Returns null if the email doesn't match the expected format
 */
export const parseOutreachSystemEmail = (email: string): { userId: string; outreachId: string } | null => {
  const match = email.match(/^notifications-([a-f0-9]{6})([a-f0-9]{6})@ecosystembuilder\.app$/);
  
  if (!match) {
    return null;
  }
  
  return {
    userId: match[1],
    outreachId: match[2],
  };
};

/**
 * Validate that an email is a valid outreach system email
 */
export const isOutreachSystemEmail = (email: string): boolean => {
  return /^notifications-[a-f0-9]{12}@ecosystembuilder\.app$/.test(email);
};
