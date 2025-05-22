
import { 
  KnowledgeArticle,
  KnowledgeTag, 
  ContentType,
  KnowledgeQueryOptions
} from '@/models/knowledgeTypes';

// Empty placeholder for mock articles - in production we'll use real data
const mockArticles: KnowledgeArticle[] = [];

// Empty placeholder for mock tags - in production we'll use real data
const mockTags: KnowledgeTag[] = [];

// Function to filter and sort articles based on query parameters
export const getMockArticles = (options: KnowledgeQueryOptions = {}): Promise<KnowledgeArticle[]> => {
  // In production environment, this would be replaced with actual API calls
  console.warn('getMockArticles is being used in production. Replace with actual API call.');
  return Promise.resolve([]);
};

// Function to get tags
export const getMockTags = (): Promise<KnowledgeTag[]> => {
  // In production environment, this would be replaced with actual API calls
  console.warn('getMockTags is being used in production. Replace with actual API call.');
  return Promise.resolve([]);
};
