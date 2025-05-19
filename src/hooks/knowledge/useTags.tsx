
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
      
      return data as KnowledgeTag[];
    }
  });
};
