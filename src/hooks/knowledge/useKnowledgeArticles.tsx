
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { KnowledgeArticle } from '@/models/types';

export const useKnowledgeArticles = (communityId: string) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: articles, isLoading } = useQuery({
    queryKey: ['knowledge-articles', communityId],
    queryFn: async () => {
      console.log('Fetching articles for community:', communityId);
      const { data, error } = await supabase
        .from('knowledge_articles')
        .select(`
          *,
          votes: knowledge_votes (
            vote_type
          ),
          comments: knowledge_comments (
            count
          ),
          tags: knowledge_article_tags (
            tag: knowledge_tags (
              name
            )
          )
        `)
        .eq('community_id', communityId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching articles:', error);
        throw error;
      }

      return data;
    },
    enabled: !!communityId,
  });

  const createArticle = useMutation({
    mutationFn: async (article: Partial<KnowledgeArticle>) => {
      const { data, error } = await supabase
        .from('knowledge_articles')
        .insert([article])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['knowledge-articles', communityId] });
      toast({
        title: "Article created",
        description: "Your article has been published successfully.",
      });
    },
    onError: (error) => {
      console.error('Error creating article:', error);
      toast({
        title: "Error",
        description: "Failed to create article. Please try again.",
        variant: "destructive",
      });
    },
  });

  return {
    articles,
    isLoading,
    createArticle,
  };
};
