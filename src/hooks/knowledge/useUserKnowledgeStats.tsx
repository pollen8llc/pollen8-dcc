import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { getMockArticles } from '@/data/mockKnowledgeData';
import { ContentType } from '@/models/knowledgeTypes';

interface UserKnowledgeStats {
  totalArticles: number;
  totalQuestions: number; 
  totalPolls: number;
  totalQuotes: number;
  totalViews?: number;
  totalComments?: number;
  totalVotes?: number;
  savedArticlesCount?: number;
  commentsLeftCount?: number;
  pollVotesCount?: number;
  recentArticlesCount?: number;
  recentActivity: any[];
  contentTypeStats: Record<string, number>;
  articles: any[];
  questions: any[];
  polls: any[];
  quotes: any[];
  profile?: {
    full_name: string;
    avatar_url: string;
  };
}

export const useUserKnowledgeStats = (userId?: string) => {
  const [stats, setStats] = useState<UserKnowledgeStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserStats = async () => {
      if (!userId) {
        setStats(null);
        setLoading(false);
        return;
      }

      try {
        // Fetch user's actual articles from database
        const { data: userArticles, error } = await supabase
          .from('knowledge_articles')
          .select('*')
          .eq('author_id', userId)
          .eq('is_published', true)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching user articles:', error);
          // Fallback to mock data
          const mockData = await getMockArticles();
          const filteredMockData = mockData.filter(() => Math.random() > 0.7);
          
          const articles = filteredMockData.filter(article => 
            (article as any).content_type === ContentType.ARTICLE
          );
          const questions = filteredMockData.filter(article => 
            (article as any).content_type === ContentType.QUESTION
          );
          const polls = filteredMockData.filter(article => 
            (article as any).content_type === ContentType.POLL
          );
          const quotes = filteredMockData.filter(article => 
            (article as any).content_type === ContentType.QUOTE
          );

          const contentTypeStats: Record<string, number> = {};
          filteredMockData.forEach(article => {
            const type = (article as any).content_type || 'ARTICLE';
            contentTypeStats[type] = (contentTypeStats[type] || 0) + 1;
          });

          setStats({
            totalArticles: articles.length,
            totalQuestions: questions.length,
            totalPolls: polls.length,
            totalQuotes: quotes.length,
            totalViews: Math.floor(Math.random() * 1000),
            totalComments: Math.floor(Math.random() * 200),
            totalVotes: Math.floor(Math.random() * 300),
            savedArticlesCount: Math.floor(Math.random() * 50),
            recentArticlesCount: Math.floor(Math.random() * 20),
            contentTypeStats,
            articles,
            questions,
            polls,
            quotes,
            recentActivity: filteredMockData.slice(0, 5)
          });
          return;
        }

        // Process real data
        const articles = (userArticles || []).filter(article => 
          article.content_type === ContentType.ARTICLE
        );
        const questions = (userArticles || []).filter(article => 
          article.content_type === ContentType.QUESTION
        );
        const polls = (userArticles || []).filter(article => 
          article.content_type === ContentType.POLL
        );
        const quotes = (userArticles || []).filter(article => 
          article.content_type === ContentType.QUOTE
        );

        const contentTypeStats: Record<string, number> = {};
        (userArticles || []).forEach(article => {
          const type = article.content_type || 'ARTICLE';
          contentTypeStats[type] = (contentTypeStats[type] || 0) + 1;
        });

        // Get additional stats
        const { data: voteStats } = await supabase
          .from('knowledge_votes')
          .select('vote_type')
          .in('article_id', (userArticles || []).map(a => a.id));

        const totalVotes = voteStats?.reduce((sum, vote) => {
          return sum + (vote.vote_type === 'upvote' ? 1 : vote.vote_type === 'downvote' ? -1 : 0);
        }, 0) || 0;

        // Get saved articles count
        const { data: savedArticles } = await supabase
          .from('knowledge_saved_articles')
          .select('id')
          .eq('user_id', userId);

        // Get comments left by user
        const { data: commentsLeft } = await supabase
          .from('knowledge_comments')
          .select('id')
          .eq('author_id', userId);

        // Get poll votes by user
        const { data: pollVotes } = await supabase
          .from('knowledge_votes')
          .select('id')
          .eq('user_id', userId)
          .not('article_id', 'is', null);

        setStats({
          totalArticles: articles.length,
          totalQuestions: questions.length,
          totalPolls: polls.length,
          totalQuotes: quotes.length,
          totalViews: (userArticles || []).reduce((sum, article) => sum + (article.view_count || 0), 0),
          totalComments: (userArticles || []).reduce((sum, article) => sum + (article.comment_count || 0), 0),
          totalVotes: Math.abs(totalVotes),
          savedArticlesCount: savedArticles?.length || 0,
          commentsLeftCount: commentsLeft?.length || 0,
          pollVotesCount: pollVotes?.length || 0,
          recentArticlesCount: (userArticles || []).filter(article => {
            const created = new Date(article.created_at);
            const weekAgo = new Date();
            weekAgo.setDate(weekAgo.getDate() - 7);
            return created > weekAgo;
          }).length,
          contentTypeStats,
          articles,
          questions,
          polls,
          quotes,
          recentActivity: (userArticles || []).slice(0, 5).map(article => ({
            id: article.id,
            type: 'article' as const,
            content: article.title,
            article_title: article.title,
            article_id: article.id,
            created_at: article.created_at,
            user_name: 'You'
          }))
        });

      } catch (error) {
        console.error('Error fetching user knowledge stats:', error);
        setStats(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUserStats();
  }, [userId]);

  return { 
    data: stats, 
    isLoading: loading,
    // Legacy interface compatibility  
    stats, 
    loading 
  };
};