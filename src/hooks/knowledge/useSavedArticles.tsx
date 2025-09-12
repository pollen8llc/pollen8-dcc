import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/contexts/UserContext';
import { KnowledgeArticle } from '@/models/knowledgeTypes';

export const useSavedArticles = () => {
  const { currentUser } = useUser();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Get saved articles for the current user
  const { data: savedArticles, isLoading } = useQuery({
    queryKey: ['savedArticles', currentUser?.id],
    queryFn: async () => {
      if (!currentUser) return [];

      try {
        const { data, error } = await supabase
          .from('knowledge_saved_articles' as any)
          .select('id, saved_at, article_id')
          .eq('user_id', currentUser.id)
          .order('saved_at', { ascending: false });

        if (error) throw error;

        // Get articles for saved article IDs
        const articleIds = (data as any[] || []).map((item: any) => item.article_id);
        
        if (articleIds.length === 0) return [];

        const { data: articles, error: articlesError } = await supabase
          .from('knowledge_articles' as any)
          .select('*')
          .in('id', articleIds);

        if (articlesError) throw articlesError;

        // Combine saved info with article data
        return (data as any[] || []).map((savedItem: any) => {
          const article = (articles as any[] || []).find((a: any) => a.id === savedItem.article_id);
          return article ? {
            ...article,
            saved_at: savedItem.saved_at
          } : null;
        }).filter(Boolean);
      } catch (error) {
        console.error('Error fetching saved articles:', error);
        return [];
      }
    },
    enabled: !!currentUser
  });

  // Check if an article is saved
  const { data: savedArticleIds } = useQuery({
    queryKey: ['savedArticleIds', currentUser?.id],
    queryFn: async () => {
      if (!currentUser) return [];

      try {
        const { data, error } = await supabase
          .from('knowledge_saved_articles' as any)
          .select('article_id')
          .eq('user_id', currentUser.id);

        if (error) throw error;
        return (data as any[] || []).map((item: any) => item.article_id);
      } catch (error) {
        console.error('Error fetching saved article IDs:', error);
        return [];
      }
    },
    enabled: !!currentUser
  });

  // Save article mutation
  const saveArticle = useMutation({
    mutationFn: async (articleId: string) => {
      if (!currentUser) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('knowledge_saved_articles' as any)
        .insert({
          user_id: currentUser.id,
          article_id: articleId
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['savedArticles', currentUser?.id] });
      queryClient.invalidateQueries({ queryKey: ['savedArticleIds', currentUser?.id] });
      toast({
        title: "Article saved",
        description: "Article has been added to your saved list",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error saving article",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  // Unsave article mutation
  const unsaveArticle = useMutation({
    mutationFn: async (articleId: string) => {
      if (!currentUser) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('knowledge_saved_articles' as any)
        .delete()
        .eq('user_id', currentUser.id)
        .eq('article_id', articleId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['savedArticles', currentUser?.id] });
      queryClient.invalidateQueries({ queryKey: ['savedArticleIds', currentUser?.id] });
      toast({
        title: "Article removed",
        description: "Article has been removed from your saved list",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error removing article",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  const isArticleSaved = (articleId: string) => {
    return (savedArticleIds || []).includes(articleId);
  };

  const toggleSaveArticle = (articleId: string) => {
    if (isArticleSaved(articleId)) {
      unsaveArticle.mutate(articleId);
    } else {
      saveArticle.mutate(articleId);
    }
  };

  return {
    savedArticles,
    isLoading,
    isArticleSaved,
    toggleSaveArticle,
    saveArticle: saveArticle.mutate,
    unsaveArticle: unsaveArticle.mutate
  };
};