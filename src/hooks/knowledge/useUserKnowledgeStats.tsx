import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { getMockArticles } from '@/data/mockKnowledgeData';
import { ContentType } from '@/models/knowledgeTypes';

interface UserKnowledgeStats {
  totalArticles: number;
  totalQuestions: number; 
  totalPolls: number;
  totalQuotes: number;
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
        // Use mock data for now until types are updated
        const defaultStats: UserKnowledgeStats = {
          totalArticles: 0,
          totalQuestions: 0,
          totalPolls: 0,
          totalQuotes: 0,
          recentActivity: [],
          contentTypeStats: {},
          articles: [],
          questions: [],
          polls: [],
          quotes: []
        };

        // Filter mock data by user (for demo purposes)
        const mockData = await getMockArticles();
        const userArticles = mockData.filter(() => Math.random() > 0.7);
        
        const articles = userArticles.filter(article => 
          (article as any).content_type === ContentType.ARTICLE
        );
        const questions = userArticles.filter(article => 
          (article as any).content_type === ContentType.QUESTION
        );
        const polls = userArticles.filter(article => 
          (article as any).content_type === ContentType.POLL
        );
        const quotes = userArticles.filter(article => 
          (article as any).content_type === ContentType.QUOTE
        );

        const contentTypeStats: Record<string, number> = {};
        userArticles.forEach(article => {
          const type = (article as any).content_type || 'ARTICLE';
          contentTypeStats[type] = (contentTypeStats[type] || 0) + 1;
        });

        setStats({
          ...defaultStats,
          totalArticles: articles.length,
          totalQuestions: questions.length,
          totalPolls: polls.length,
          totalQuotes: quotes.length,
          contentTypeStats,
          articles,
          questions,
          polls,
          quotes,
          recentActivity: userArticles.slice(0, 5)
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

  return { stats, loading };
};