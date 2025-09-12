import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { KnowledgeArticle, ContentType } from '@/models/knowledgeTypes';
import { useUser } from '@/contexts/UserContext';
import { useState } from 'react';

interface UseArticlesParams {
  searchQuery?: string;
  tag?: string;
  type?: string;
  sort?: string;
}

export const useArticles = (params: UseArticlesParams = {}) => {
  return useQuery({
    queryKey: ['knowledgeArticles', params],
    queryFn: async () => {
      console.log('Fetching articles with params:', params);
      
      const { data: { user } } = await supabase.auth.getUser();
      
      const { data: articles, error } = await supabase.rpc('get_knowledge_articles', {
        p_search_query: params.searchQuery || null,
        p_tag: params.tag || null,
        p_content_type: params.type || null,
        p_sort_by: params.sort || 'created_at',
        p_limit: 20,
        p_offset: 0,
        p_user_id: user?.id || null
      });

      if (error) {
        console.error('Error fetching articles:', error);
        throw error;
      }

// Transform the data to include proper author object with enhanced fields
      return (articles || []).map((article: any) => ({
        ...article,
        content_type: article.content_type as ContentType,
        author: {
          id: article.author_id,
          name: article.author_name || 'Anonymous',
          avatar_url: article.author_avatar_url,
          is_admin: false // Will be enhanced later when we add role data
        }
      }));
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
  });
};

export const useArticle = (id: string) => {
  return useQuery({
    queryKey: ['knowledgeArticle', id],
    queryFn: async () => {
      if (!id) return null;
      
      const { data: { user } } = await supabase.auth.getUser();
      
      // Fetch article first
      const { data: article, error } = await supabase
        .from('knowledge_articles')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching article:', error);
        throw error;
      }

      if (!article) return null;

      // Separately fetch author info to handle RLS policies properly
      let authorProfile = null;
      if (article.author_id) {
        const { data: authorData } = await supabase
          .from('profiles')
          .select('user_id, full_name, first_name, last_name, avatar_url, role')
          .eq('user_id', article.author_id)
          .maybeSingle();
        
        authorProfile = authorData;
      }

      // Get user's vote for this article
      let userVote = null;
      if (user) {
        const { data: vote } = await supabase
          .from('knowledge_votes')
          .select('vote_type')
          .eq('article_id', id)
          .eq('user_id', user.id)
          .maybeSingle();
        
        userVote = vote?.vote_type || null;
      }

      // Transform data to match KnowledgeArticle interface
      return {
        ...article,
        user_vote: userVote,
        author: authorProfile ? {
          id: authorProfile.user_id,
          name: authorProfile.full_name || `${authorProfile.first_name || ''} ${authorProfile.last_name || ''}`.trim() || 'Anonymous',
          avatar_url: authorProfile.avatar_url,
          is_admin: authorProfile.role === 'ADMIN'
        } : {
          id: article.author_id,
          name: 'Unknown User',
          avatar_url: null,
          is_admin: false
        }
      };
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
};

export const useCreateArticle = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (articleData: Partial<KnowledgeArticle>) => {
      // Always resolve the authenticated user directly from Supabase to avoid stale context
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('You must be signed in to create an article.');
      }

      const payload = {
        title: articleData.title,
        subtitle: articleData.subtitle,
        content: articleData.content,
        content_type: articleData.content_type || ContentType.ARTICLE,
        author_id: user.id,
        tags: (articleData.tags as string[]) || [],
        is_published: articleData.is_published ?? true,
        category: articleData.category,
        options: articleData.options
      };

      const { data: article, error } = await supabase
        .from('knowledge_articles')
        .insert(payload)
        .select()
        .single();

      if (error) {
        console.error('Error creating article:', error, payload);
        throw error;
      }

      return article;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['knowledgeArticles'] });
      toast({
        title: "Article Created",
        description: "Your article has been published successfully.",
      });
    },
    onError: (error: any) => {
      console.error('Error creating article:', error);
      toast({
        title: "Error Creating Article",
        description: error.message || "Failed to create article.",
        variant: "destructive",
      });
    },
  });
};

export const useUpdateArticle = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<KnowledgeArticle> }) => {
      const { data: article, error } = await supabase
        .from('knowledge_articles')
        .update({
          title: updates.title,
          subtitle: updates.subtitle,
          content: updates.content,
          content_type: updates.content_type,
          tags: updates.tags,
          is_published: updates.is_published,
          category: updates.category,
          options: updates.options,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating article:', error);
        throw error;
      }

      return article;
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['knowledgeArticles'] });
      queryClient.invalidateQueries({ queryKey: ['knowledgeArticle', id] });
      toast({
        title: "Article Updated",
        description: "Your article has been updated successfully.",
      });
    },
    onError: (error: any) => {
      console.error('Error updating article:', error);
      toast({
        title: "Error Updating Article",
        description: error.message || "Failed to update article.",
        variant: "destructive",
      });
    },
  });
};

export const useDeleteArticle = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('knowledge_articles')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting article:', error);
        throw error;
      }

      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['knowledgeArticles'] });
      toast({
        title: "Article Deleted",
        description: "Your article has been deleted successfully.",
      });
    },
    onError: (error: any) => {
      console.error('Error deleting article:', error);
      toast({
        title: "Error Deleting Article",
        description: error.message || "Failed to delete article.",
        variant: "destructive",
      });
    },
  });
};

export const useToggleBookmark = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { currentUser } = useUser();

  return useMutation({
    mutationFn: async ({ articleId, isBookmarked }: { articleId: string; isBookmarked: boolean }) => {
      if (!currentUser) {
        throw new Error('Authentication required');
      }

      if (isBookmarked) {
        // Remove bookmark
        const { error } = await supabase
          .from('knowledge_saved_articles')
          .delete()
          .eq('article_id', articleId)
          .eq('user_id', currentUser.id);

        if (error) throw error;
      } else {
        // Add bookmark
        const { error } = await supabase
          .from('knowledge_saved_articles')
          .insert({
            article_id: articleId,
            user_id: currentUser.id
          });

        if (error) throw error;
      }

      return { articleId, isBookmarked: !isBookmarked };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['knowledgeArticles'] });
      queryClient.invalidateQueries({ queryKey: ['savedArticles'] });
    },
    onError: (error: any) => {
      console.error('Error toggling bookmark:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update bookmark.",
        variant: "destructive",
      });
    },
  });
};

export const useFeatureArticle = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ articleId, featured }: { articleId: string; featured: boolean }) => {
      const { data: article, error } = await supabase
        .from('knowledge_articles')
        .update({ is_featured: featured })
        .eq('id', articleId)
        .select()
        .single();

      if (error) {
        console.error('Error featuring article:', error);
        throw error;
      }

      return article;
    },
    onSuccess: (_, { featured }) => {
      queryClient.invalidateQueries({ queryKey: ['knowledgeArticles'] });
      toast({
        title: featured ? "Article Featured" : "Article Unfeatured",
        description: featured ? "Article has been featured." : "Article is no longer featured.",
      });
    },
    onError: (error: any) => {
      console.error('Error featuring article:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update featured status.",
        variant: "destructive",
      });
    },
  });
};

export const useIncrementViewCount = () => {
  const [viewedArticles, setViewedArticles] = useState<Set<string>>(new Set());

  return useMutation({
    mutationFn: async (articleId: string) => {
      // Only increment if not already viewed in this session
      if (!viewedArticles.has(articleId)) {
        setViewedArticles(prev => new Set([...prev, articleId]));
        
        const { error } = await supabase.rpc('increment_view_count', {
          article_id: articleId
        });

        if (error) {
          console.error('Error incrementing view count:', error);
          throw error;
        }
      }
      return articleId;
    },
  });
};