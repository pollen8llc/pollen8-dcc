
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { KnowledgeTag } from '@/models/knowledgeTypes';

export const useTags = () => {
  return useQuery({
    queryKey: ['knowledgeTags'],
    queryFn: async () => {
      // First get all tags from the knowledge_tags table
      const { data: tagData, error: tagError } = await supabase
        .from('knowledge_tags')
        .select('*')
        .order('name');
      
      if (tagError) {
        throw tagError;
      }
      
      // Then get count for each tag from articles
      const { data: articleTags, error: articleError } = await supabase
        .from('knowledge_articles')
        .select('tags');
        
      if (articleError) {
        console.error('Error fetching article tags:', articleError);
      }
      
      // Create a map to store tag counts
      const tagCounts = new Map<string, number>();
      
      // Count occurrences of each tag
      if (articleTags) {
        articleTags.forEach(article => {
          if (article.tags && Array.isArray(article.tags)) {
            article.tags.forEach(tag => {
              const tagLower = tag.toLowerCase();
              tagCounts.set(tagLower, (tagCounts.get(tagLower) || 0) + 1);
            });
          }
        });
      }
      
      // Transform the tags data to include count
      return tagData.map(tag => ({
        id: tag.id || tag.name,
        name: tag.name,
        description: tag.description || null,
        count: tagCounts.get(tag.name.toLowerCase()) || 0
      })) as KnowledgeTag[];
    }
  });
};
