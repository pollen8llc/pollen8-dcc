
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

      const { data, error } = await supabase
        .from('knowledge_saved_articles')
        .select(`
          id,
          saved_at,
          knowledge_articles (
            id,
            title,
            content,
            created_at,
            updated_at,
            view_count,
            comment_count,
            vote_count,
            tags,
            content_type,
            user_id
          )
        `)
        .eq('user_id', currentUser.id)
        .order('saved_at', { ascending: false });

      if (error) throw error;

      // Get author information for each article
      const articleIds = data?.map(item => item.knowledge_articles?.user_id).filter(Boolean) || [];
      const uniqueUserIds = [...new Set(articleIds)];

      let profiles = [];
      if (uniqueUserIds.length > 0) {
        const { data: profilesData, error: profilesError } = await supabase
          .from('profiles')
          .select('id, first_name, last_name, avatar_url')
          .in('id', uniqueUserIds);

        if (!profilesError) {
          profiles = profilesData || [];
        }
      }

      const profilesMap = profiles.reduce((map, profile) => {
        map[profile.id] = profile;
        return map;
      }, {} as Record<string, any>);

      return data?.map(item => {
        const article = item.knowledge_articles;
        if (!article) return null;

        const profileData = profilesMap[article.user_id];
        
        return {
          ...article,
          author: profileData ? {
            id: article.user_id,
            name: `${profileData.first_name || ''} ${profileData.last_name || ''}`.trim(),
            avatar_url: profileData.avatar_url || ''
          } : undefined,
          saved_at: item.saved_at
        };
      }).filter(Boolean) as (KnowledgeArticle & { saved_at: string })[];
    },
    enabled: !!currentUser
  });

  // Check if an article is saved
  const { data: savedArticleIds } = useQuery({
    queryKey: ['savedArticleIds', currentUser?.id],
    queryFn: async () => {
      if (!currentUser) return [];

      const { data, error } = await supabase
        .from('knowledge_saved_articles')
        .select('article_id')
        .eq('user_id', currentUser.id);

      if (error) throw error;
      return data?.map(item => item.article_id) || [];
    },
    enabled: !!currentUser
  });

  // Save article mutation
  const saveArticle = useMutation({
    mutationFn: async (articleId: string) => {
      if (!currentUser) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('knowledge_saved_articles')
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
        .from('knowledge_saved_articles')
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
    return savedArticleIds?.includes(articleId) || false;
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
