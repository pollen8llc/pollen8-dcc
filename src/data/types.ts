
export enum Role {
  ORGANIZER = "ORGANIZER",
  MEMBER = "MEMBER"
}

export interface User {
  id: string;
  name: string;
  role: Role;
  imageUrl: string;
  email: string;
  bio: string;
  connections?: string[];
}

/**
 * @deprecated This interface is kept for backward compatibility only and
 * should not be used in new code as community functionality has been removed.
 */
export interface Community {
  id: string;
  name: string;
  description: string;
  location?: string;
  imageUrl?: string;
  communitySize: string; 
  organizerIds: string[];
  memberIds: string[];
  tags: string[];
  isPublic: boolean;
  updated_at?: string;
}
