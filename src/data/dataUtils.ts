
import { User, Community } from "./types";
import { communities } from "./communities";
import { users } from "./users";

export const getCommunityById = (id: string): Community | undefined => {
  return communities.find((community) => community.id === id);
};

export const getUserById = (id: string): User | undefined => {
  return users.find((user) => user.id === id);
};

export const getCommunityMembers = (communityId: string): User[] => {
  const community = getCommunityById(communityId);
  if (!community) return [];
  
  return [
    ...users.filter((user) => community.organizerIds.includes(user.id)),
    ...users.filter((user) => community.memberIds.includes(user.id))
  ];
};

export const getCommunityOrganizers = (communityId: string): User[] => {
  const community = getCommunityById(communityId);
  if (!community) return [];
  
  return users.filter((user) => community.organizerIds.includes(user.id));
};

export const getCommunityRegularMembers = (communityId: string): User[] => {
  const community = getCommunityById(communityId);
  if (!community) return [];
  
  return users.filter((user) => community.memberIds.includes(user.id));
};
