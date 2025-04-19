
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
  communities: string[];
}

export interface Community {
  id: string;
  name: string;
  description: string;
  location: string;
  imageUrl: string;
  communitySize: number; // Changed from memberCount to communitySize
  organizerIds: string[];
  memberIds: string[];
  tags: string[];
  isPublic: boolean;
}
