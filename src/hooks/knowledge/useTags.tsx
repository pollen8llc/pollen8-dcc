
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { KnowledgeTag } from '@/models/knowledgeTypes';

export const useTags = () => {
  return useQuery({
    queryKey: ['knowledgeTags'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('knowledge_tags')
        .select('*')
        .order('name');
      
      if (error) {
        throw error;
      }
      
      // Transform the tags data to include count
      // In a real implementation, you might fetch actual counts from the database
      return data.map(tag => ({
        id: tag.id || tag.name, // Use name as fallback id if needed
        name: tag.name,
        description: tag.description || null,
        count: 0 // Default count, should be updated with actual count from database
      })) as KnowledgeTag[];
    }
  });
};
