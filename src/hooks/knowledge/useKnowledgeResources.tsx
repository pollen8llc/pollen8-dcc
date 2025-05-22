
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ContentType, KnowledgeArticle } from '@/models/knowledgeTypes';

export const useKnowledgeResources = (userId: string | undefined) => {
  const [userStats, setUserStats] = useState<{
    articles: number;
    questions: number;
    polls: number;
    comments: number;
  }>({
    articles: 0,
    questions: 0,
    polls: 0,
    comments: 0
  });

  // Fetch user contributions (articles, questions, polls)
  const { data: contributions = [], isLoading: isLoadingContributions } = useQuery({
    queryKey: ['knowledgeContributions', userId],
    queryFn: async () => {
      if (!userId) return [];
      
      const { data, error } = await supabase
        .from('knowledge_articles')
        .select(`
          *,
          comments:knowledge_comments(count)
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
        
      if (error) {
        console.error('Error fetching user contributions:', error);
        throw error;
      }
      
      return data || [];
    },
    enabled: !!userId
  });

  // Fetch user comments
  const { data: comments = [], isLoading: isLoadingComments } = useQuery({
    queryKey: ['knowledgeComments', userId],
    queryFn: async () => {
      if (!userId) return [];
      
      const { data, error } = await supabase
        .from('knowledge_comments')
        .select(`
          *,
          article:knowledge_articles(id, title, content_type)
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
        
      if (error) {
        console.error('Error fetching user comments:', error);
        throw error;
      }
      
      return data || [];
    },
    enabled: !!userId
  });

  // Fetch user saved articles (bookmarks) - Note: We'll implement this properly when the table exists
  const { data: savedArticles = [], isLoading: isLoadingSaved } = useQuery({
    queryKey: ['knowledgeSaved', userId],
    queryFn: async () => {
      if (!userId) return [];
      
      // Since knowledge_bookmarks table doesn't exist yet, return an empty array
      // When the table is created later, we can uncomment and use this code
      /*
      try {
        const { data, error } = await supabase
          .from('knowledge_bookmarks')
          .select(`
            id,
            article_id,
            saved_at,
            article:knowledge_articles(*)
          `)
          .eq('user_id', userId)
          .order('saved_at', { ascending: false });
          
        if (error) {
          console.error('Error fetching saved articles:', error);
          throw error;
        }
        
        return data || [];
      } catch (err) {
        console.error('Error in saved articles query:', err);
        return [];
      }
      */
      
      return [];
    },
    enabled: !!userId
  });

  // Calculate stats based on contributions and comments
  useEffect(() => {
    if (contributions && comments) {
      const articleCount = contributions.filter(item => item.content_type === ContentType.ARTICLE).length;
      const questionCount = contributions.filter(item => item.content_type === ContentType.QUESTION).length;
      const pollCount = contributions.filter(item => item.content_type === ContentType.POLL).length;
      
      setUserStats({
        articles: articleCount,
        questions: questionCount,
        polls: pollCount,
        comments: comments.length
      });
    }
  }, [contributions, comments]);

  return {
    userStats,
    contributions,
    comments,
    savedArticles,
    isLoading: isLoadingContributions || isLoadingComments || isLoadingSaved
  };
};
