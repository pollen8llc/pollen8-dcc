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
      
      // For now, return empty array as knowledge_articles table doesn't exist yet
      return [];
    },
    enabled: false // Disable until knowledge_articles table is created
  });
};

export const useArticle = (id: string) => {
  return useQuery({
    queryKey: ['knowledgeArticle', id],
    queryFn: async () => {
      // For now, return null as knowledge_articles table doesn't exist yet
      return null;
    },
    enabled: false // Disable until knowledge_articles table is created
  });
};

export const useCreateArticle = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { currentUser } = useUser();

  return useMutation({
    mutationFn: async (articleData: Partial<KnowledgeArticle>) => {
      // For now, throw error as knowledge_articles table doesn't exist yet
      throw new Error('Knowledge articles feature not yet implemented');
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
      // For now, throw error as knowledge_articles table doesn't exist yet
      throw new Error('Knowledge articles feature not yet implemented');
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
      // For now, throw error as knowledge_articles table doesn't exist yet
      throw new Error('Knowledge articles feature not yet implemented');
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

  return useMutation({
    mutationFn: async ({ articleId, isBookmarked }: { articleId: string; isBookmarked: boolean }) => {
      // For now, throw error as feature not implemented
      throw new Error('Bookmark feature not yet implemented');
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
      // For now, throw error as feature not implemented
      throw new Error('Feature article not yet implemented');
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
      // For now, just track locally
      if (!viewedArticles.has(articleId)) {
        setViewedArticles(prev => new Set([...prev, articleId]));
      }
      return articleId;
    },
  });
};