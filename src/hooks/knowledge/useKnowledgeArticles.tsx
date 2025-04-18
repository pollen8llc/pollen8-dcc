
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useSession } from '@/hooks/useSession';

export const useKnowledgeArticles = (communityId: string) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { session } = useSession();

  const { data: articles, isLoading, error } = useQuery({
    queryKey: ['knowledge-articles', communityId],
    queryFn: async () => {
      console.log('Fetching articles for community:', communityId);
      
      // Simplified query to avoid the tags relation issue
      const { data, error } = await supabase
        .from('knowledge_articles')
        .select(`
          id,
          title,
          content,
          created_at
        `)
        .eq('community_id', communityId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching articles:', error);
        throw error;
      }

      // Add empty tags array to each article to satisfy the type
      return data.map(article => ({
        ...article,
        tags: []
      }));
    },
    enabled: !!communityId,
    retry: 1
  });

  const createArticle = useMutation({
    mutationFn: async (article: { title: string; content: string; community_id: string }) => {
      if (!session?.user?.id) {
        throw new Error("You must be logged in to create an article");
      }

      const { data, error } = await supabase
        .from('knowledge_articles')
        .insert({
          title: article.title,
          content: article.content,
          community_id: article.community_id,
          user_id: session.user.id
        })
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
    error,
    createArticle,
  };
};
