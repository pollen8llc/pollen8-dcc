
/**
 * Debug utility to help track community data flow and find property mismatches
 */
export const logCommunityData = (community: any, source: string) => {
  console.group(`Community Data [${source}]`);
  console.log('ID:', community.id);
  console.log('Name:', community.name);
  
  // Check for the existence of both old and new property names
  if (community.memberCount !== undefined) {
    console.warn('DEPRECATED: Using old property name "memberCount"', community.memberCount);
  }
  
  if (community.communitySize !== undefined) {
    console.log('Community Size:', community.communitySize);
  } else {
    console.warn('MISSING: Property "communitySize" not found');
  }
  
  console.log('Full object:', community);
  console.groupEnd();
  
  return community; // Allow for function chaining
};
