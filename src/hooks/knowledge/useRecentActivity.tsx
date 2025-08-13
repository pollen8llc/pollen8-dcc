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
}

export const useRecentActivity = () => {
  const { currentUser } = useAuth();

  return useQuery({
    queryKey: ['recent-activity', currentUser?.id],
    queryFn: async (): Promise<RecentActivity[]> => {
      if (!currentUser?.id) return [];

      // Get recent comments on user's articles
      const { data: comments } = await supabase
        .from('knowledge_comments')
        .select(`
          id,
          content,
          created_at,
          user_id,
          knowledge_articles!inner(id, title, user_id)
        `)
        .eq('knowledge_articles.user_id', currentUser.id)
        .order('created_at', { ascending: false })
        .limit(10);

      // Get recent votes on user's articles
      const { data: votes } = await supabase
        .from('knowledge_votes')
        .select(`
          id,
          vote_type,
          created_at,
          user_id,
          knowledge_articles!inner(id, title, user_id)
        `)
        .eq('knowledge_articles.user_id', currentUser.id)
        .order('created_at', { ascending: false })
        .limit(10);

      // Get user's recent articles
      const { data: articles } = await supabase
        .from('knowledge_articles')
        .select('id, title, created_at, content')
        .eq('user_id', currentUser.id)
        .order('created_at', { ascending: false })
        .limit(5);

      const activities: RecentActivity[] = [];

      // Get user profiles for comments and votes
      const userIds = [
        ...(comments?.map(c => c.user_id) || []),
        ...(votes?.map(v => v.user_id) || [])
      ].filter(Boolean);

      const { data: profiles } = userIds.length > 0 ? await supabase
        .from('profiles')
        .select('id, display_name, username')
        .in('id', userIds) : { data: [] };

      const profileMap = new Map<string, any>();
      profiles?.forEach(p => {
        if (p.id) {
          profileMap.set(p.id, p);
        }
      });

      // Process comments
      comments?.forEach(comment => {
        const profile = profileMap.get(comment.user_id);
        activities.push({
          id: comment.id,
          type: 'comment',
          content: comment.content?.substring(0, 100) + '...' || '',
          article_title: comment.knowledge_articles.title,
          article_id: comment.knowledge_articles.id,
          created_at: comment.created_at,
          user_name: profile?.display_name || profile?.username || 'Anonymous'
        });
      });

      // Process votes
      votes?.forEach(vote => {
        const profile = profileMap.get(vote.user_id);
        activities.push({
          id: vote.id,
          type: 'vote',
          content: `${vote.vote_type === 1 ? 'Upvoted' : 'Downvoted'} your article`,
          article_title: vote.knowledge_articles.title,
          article_id: vote.knowledge_articles.id,
          created_at: vote.created_at,
          user_name: profile?.display_name || profile?.username || 'Anonymous',
          vote_type: vote.vote_type === 1 ? 'upvote' : 'downvote'
        });
      });

      // Process user's articles
      articles?.forEach(article => {
        activities.push({
          id: article.id,
          type: 'article',
          content: article.content?.replace(/<[^>]*>?/gm, '').substring(0, 100) + '...' || '',
          article_title: article.title,
          article_id: article.id,
          created_at: article.created_at,
          user_name: 'You'
        });
      });

      // Sort all activities by date and return top 15
      return activities
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 15);
    },
    enabled: !!currentUser?.id
  });
};