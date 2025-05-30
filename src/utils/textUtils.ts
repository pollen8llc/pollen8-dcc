
/**
 * Strips HTML tags and markdown formatting from text
 */
export function stripMarkdown(text: string): string {
  return text
    // Remove HTML tags
    .replace(/<[^>]*>/g, '')
    // Remove markdown headers
    .replace(/^#{1,6}\s+/gm, '')
    // Remove markdown bold/italic
    .replace(/(\*\*|__)(.*?)\1/g, '$2')
    .replace(/(\*|_)(.*?)\1/g, '$2')
    // Remove markdown links
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    // Remove markdown code blocks
    .replace(/```[\s\S]*?```/g, '')
    .replace(/`([^`]+)`/g, '$1')
    // Remove markdown lists
    .replace(/^\s*[-*+]\s+/gm, '')
    .replace(/^\s*\d+\.\s+/gm, '')
    // Remove multiple spaces and newlines
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Truncates text to a specified length with proper word boundaries
 */
export function truncateText(text: string, maxLength: number = 200): string {
  const cleanText = stripMarkdown(text);
  
  if (cleanText.length <= maxLength) return cleanText;
  
  const truncated = cleanText.substring(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');
  
  if (lastSpace > 0) {
    return truncated.substring(0, lastSpace) + '...';
  }
  
  return truncated + '...';
}
