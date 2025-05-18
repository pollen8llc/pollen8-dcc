
/**
 * Process target audience data into a consistent array format
 */
export const processTargetAudience = (
  audience: string[] | string | undefined
): string[] => {
  if (!audience) {
    return [];
  }

  if (Array.isArray(audience)) {
    return audience.filter(Boolean);
  }

  if (typeof audience === "string") {
    return audience
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);
  }

  return [];
};

/**
 * Format a community type string for display
 */
export const formatCommunityType = (type: string | undefined): string => {
  if (!type) return "Other";
  
  // Handle special case for social-impact
  if (type === "social-impact") return "Social Impact";
  
  // Capitalize first letter
  return type.charAt(0).toUpperCase() + type.slice(1);
};

/**
 * Format a date string for display
 */
export const formatDate = (dateString: string | undefined): string => {
  if (!dateString) return "N/A";
  
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch (error) {
    return dateString;
  }
};
