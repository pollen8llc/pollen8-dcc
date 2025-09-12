import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export interface RecentActivity {
  id: string;
  type: 'comment' | 'vote' | 'article';
  content: string;
  article_title: string;
  article_id: string;
  created_at: string;
  user_name?: string;
  vote_type?: 'upvote' | 'downvote';
  avatar_url?: string;
}

export const useRecentActivity = () => {
  const { currentUser } = useAuth();

  return useQuery({
    queryKey: ['recent-activity', currentUser?.id],
    queryFn: async (): Promise<RecentActivity[]> => {
      if (!currentUser?.id) return [];

      try {
        // Simplified implementation - get user's articles only for now
        const { data: articles } = await supabase
          .from('knowledge_articles' as any)
          .select('id, title, created_at, content, author_id')
          .eq('author_id', currentUser.id)
          .order('created_at', { ascending: false })
          .limit(10);

        // Transform articles to activities
        const activities: RecentActivity[] = (articles as any[] || []).map((article: any) => ({
          id: article.id,
          type: 'article' as const,
          content: article.title,
          article_title: article.title,
          article_id: article.id,
          created_at: article.created_at,
          user_name: 'You'
        }));

        return activities;
      } catch (error) {
        console.error('Error fetching recent activity:', error);
        return [];
      }
    },
    enabled: !!currentUser?.id
  });
};