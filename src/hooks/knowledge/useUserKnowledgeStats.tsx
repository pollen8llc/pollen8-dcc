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
        .select('id, title, content, content_type, created_at, view_count, comment_count, vote_count, tags, user_id')
        .eq('user_id', currentUser.id)
        .order('created_at', { ascending: false });

      if (articlesError) throw articlesError;

      // Fetch author profile info for the current user
      let authorProfile = null;
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, avatar_url')
        .eq('id', currentUser.id)
        .single();
      if (!profileError && profileData) {
        authorProfile = profileData;
      }

      // Attach author info to each article
      const articlesWithAuthor = (articles || []).map(article => ({
        ...article,
        author: authorProfile ? {
          id: article.user_id,
          name: `${authorProfile.first_name || ''} ${authorProfile.last_name || ''}`.trim() || currentUser.email || 'Unknown User',
          avatar_url: authorProfile.avatar_url || ''
        } : {
          id: article.user_id,
          name: currentUser.email || 'Unknown User',
          avatar_url: ''
        }
      }));

      // Get total stats
      const totalArticles = articlesWithAuthor.length || 0;
      const totalViews = articlesWithAuthor.reduce((sum, article) => sum + (article.view_count || 0), 0) || 0;
      const totalComments = articlesWithAuthor.reduce((sum, article) => sum + article.comment_count, 0) || 0;
      const totalVotes = articlesWithAuthor.reduce((sum, article) => sum + article.vote_count, 0) || 0;

      // Get content type breakdown
      const contentTypeStats = articlesWithAuthor.reduce((acc, article) => {
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
      
      const recentArticles = articlesWithAuthor.filter(article => 
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
        articles: articlesWithAuthor,
        averageViewsPerArticle: totalArticles > 0 ? Math.round(totalViews / totalArticles) : 0,
        averageVotesPerArticle: totalArticles > 0 ? Math.round(totalVotes / totalArticles) : 0
      };
    },
    enabled: !!currentUser
  });
};
