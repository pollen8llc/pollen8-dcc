
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useUser } from '@/contexts/UserContext';

export const useUserKnowledgeStats = () => {
  const { currentUser } = useUser();

  return useQuery({
    queryKey: ['userKnowledgeStats', currentUser?.id],
    queryFn: async () => {
      if (!currentUser) return null;

      // Get user's articles with their stats
      const { data: articles, error: articlesError } = await supabase
        .from('knowledge_articles')
        .select('id, title, content_type, created_at, view_count, comment_count, vote_count')
        .eq('user_id', currentUser.id)
        .order('created_at', { ascending: false });

      if (articlesError) throw articlesError;

      // Get total stats
      const totalArticles = articles?.length || 0;
      const totalViews = articles?.reduce((sum, article) => sum + (article.view_count || 0), 0) || 0;
      const totalComments = articles?.reduce((sum, article) => sum + article.comment_count, 0) || 0;
      const totalVotes = articles?.reduce((sum, article) => sum + article.vote_count, 0) || 0;

      // Get content type breakdown
      const contentTypeStats = articles?.reduce((acc, article) => {
        const type = article.content_type || 'ARTICLE';
        acc[type] = (acc[type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>) || {};

      // Get saved articles count
      const { data: savedArticlesData, error: savedError } = await supabase
        .from('knowledge_saved_articles')
        .select('id')
        .eq('user_id', currentUser.id);

      if (savedError) throw savedError;

      const savedArticlesCount = savedArticlesData?.length || 0;

      // Calculate recent activity (last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const recentArticles = articles?.filter(article => 
        new Date(article.created_at) > thirtyDaysAgo
      ) || [];

      return {
        totalArticles,
        totalViews,
        totalComments,
        totalVotes,
        savedArticlesCount,
        contentTypeStats,
        recentArticlesCount: recentArticles.length,
        articles: articles || [],
        averageViewsPerArticle: totalArticles > 0 ? Math.round(totalViews / totalArticles) : 0,
        averageVotesPerArticle: totalArticles > 0 ? Math.round(totalVotes / totalArticles) : 0
      };
    },
    enabled: !!currentUser
  });
};
