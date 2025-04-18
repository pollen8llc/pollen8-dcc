
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useSession } from '@/hooks/useSession';

export const useKnowledgeArticles = (communityId?: string, searchQuery?: string) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { session } = useSession();

  const { data: articles, isLoading, error } = useQuery({
    queryKey: ['knowledge-articles', communityId, searchQuery],
    queryFn: async () => {
      console.log('Fetching articles', communityId ? `for community: ${communityId}` : 'for all communities', searchQuery ? `with search: ${searchQuery}` : '');
      
      let query = supabase
        .from('knowledge_articles')
        .select(`
          id,
          title,
          content,
          created_at
        `)
        .order('created_at', { ascending: false });

      // Only filter by community if communityId is provided
      if (communityId) {
        query = query.eq('community_id', communityId);
      }

      // If search query is provided, use the search_vector column
      if (searchQuery && searchQuery.trim() !== '') {
        // First try to use the search_vector if it exists
        try {
          const { data: searchData, error: searchError } = await supabase
            .from('knowledge_articles')
            .select(`
              id,
              title,
              content,
              created_at
            `)
            .textSearch('search_vector', searchQuery, {
              type: 'websearch',
              config: 'english'
            });

          if (!searchError && searchData) {
            return searchData.map(article => ({
              ...article,
              tags: []
            }));
          }
        } catch (e) {
          console.warn('Full-text search failed, falling back to basic filtering:', e);
          // If search_vector doesn't exist or another error occurs, we fall back to basic filtering
        }
        
        // Fallback to simple ILIKE search if full-text search fails
        query = query.or(`title.ilike.%${searchQuery}%,content.ilike.%${searchQuery}%`);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching articles:', error);
        throw error;
      }

      return data.map(article => ({
        ...article,
        tags: []
      }));
    },
    enabled: true,
    retry: 1
  });

  const createArticle = useMutation({
    mutationFn: async (article: { title: string; content: string; community_id?: string }) => {
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
