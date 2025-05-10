

export const getContactsByCommunityCounts = async (): Promise<{ communityName: string; count: number }[]> => {
  try {
    const tagCounts = await getContactsByTags();
    
    // Convert tag counts to the expected format
    // (since we're no longer using communities, we'll use tags as communities)
    return tagCounts.map(tag => ({
      communityName: tag.tagName,
      count: tag.count
    }));
  } catch (error) {
    console.error("Error fetching contacts by community:", error);
    return [];
  }
};
