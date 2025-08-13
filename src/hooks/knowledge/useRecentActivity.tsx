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
        .select('id, first_name, last_name, username, avatar_url')
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
        const userName = profile ? 
          (profile.first_name && profile.last_name ? 
            `${profile.first_name} ${profile.last_name}` : 
            profile.username || 'Anonymous User') : 
          'Anonymous User';
        
        // Better content excerpt - strip HTML and limit length
        const cleanContent = comment.content?.replace(/<[^>]*>/g, '') || '';
        const excerpt = cleanContent.length > 80 ? 
          cleanContent.substring(0, 80) + '...' : 
          cleanContent;

        activities.push({
          id: comment.id,
          type: 'comment',
          content: excerpt,
          article_title: comment.knowledge_articles.title,
          article_id: comment.knowledge_articles.id,
          created_at: comment.created_at,
          user_name: userName,
          avatar_url: profile?.avatar_url
        });
      });

      // Process votes
      votes?.forEach(vote => {
        const profile = profileMap.get(vote.user_id);
        const userName = profile ? 
          (profile.first_name && profile.last_name ? 
            `${profile.first_name} ${profile.last_name}` : 
            profile.username || 'Anonymous User') : 
          'Anonymous User';

        activities.push({
          id: vote.id,
          type: 'vote',
          content: `${vote.vote_type === 1 ? 'Upvoted' : 'Downvoted'} your article`,
          article_title: vote.knowledge_articles.title,
          article_id: vote.knowledge_articles.id,
          created_at: vote.created_at,
          user_name: userName,
          vote_type: vote.vote_type === 1 ? 'upvote' : 'downvote',
          avatar_url: profile?.avatar_url
        });
      });

      // Process user's articles
      articles?.forEach(article => {
        const cleanContent = article.content?.replace(/<[^>]*>/g, '') || '';
        const excerpt = cleanContent.length > 80 ? 
          cleanContent.substring(0, 80) + '...' : 
          cleanContent;

        activities.push({
          id: article.id,
          type: 'article',
          content: excerpt,
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