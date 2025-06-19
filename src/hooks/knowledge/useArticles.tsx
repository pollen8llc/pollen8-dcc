
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
      
      let query = supabase
        .from('knowledge_articles')
        .select(`
          *,
          author:profiles!knowledge_articles_user_id_fkey(
            id,
            first_name,
            last_name,
            avatar_url
          )
        `);

      // Apply filters
      if (params.searchQuery) {
        query = query.or(`title.ilike.%${params.searchQuery}%,content.ilike.%${params.searchQuery}%`);
      }

      if (params.tag) {
        query = query.contains('tags', [params.tag]);
      }

      if (params.type && params.type !== 'all') {
        query = query.eq('content_type', params.type);
      }

      // Apply sorting
      switch (params.sort) {
        case 'oldest':
          query = query.order('created_at', { ascending: true });
          break;
        case 'most_voted':
          query = query.order('vote_count', { ascending: false });
          break;
        case 'newest':
        default:
          query = query.order('created_at', { ascending: false });
          break;
      }

      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching articles:', error);
        throw error;
      }

      return data?.map(article => ({
        ...article,
        author: article.author ? {
          id: article.author.id,
          name: `${article.author.first_name || ''} ${article.author.last_name || ''}`.trim(),
          avatar_url: article.author.avatar_url
        } : {
          id: article.user_id,
          name: 'Unknown User',
          avatar_url: null
        }
      })) as KnowledgeArticle[] || [];
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 2
  });
};

export const useArticle = (id: string | undefined) => {
  return useQuery({
    queryKey: ['knowledgeArticle', id],
    queryFn: async () => {
      if (!id) return null;
      
      console.log('Fetching article:', id);
      
      const { data, error } = await supabase
        .from('knowledge_articles')
        .select(`
          *,
          author:profiles!knowledge_articles_user_id_fkey(
            id,
            first_name,
            last_name,
            avatar_url
          )
        `)
        .eq('id', id)
        .maybeSingle();
        
      if (error) {
        console.error('Error fetching article:', error);
        throw error;
      }
      
      if (!data) return null;
      
      return {
        ...data,
        author: data.author ? {
          id: data.author.id,
          name: `${data.author.first_name || ''} ${data.author.last_name || ''}`.trim(),
          avatar_url: data.author.avatar_url
        } : {
          id: data.user_id,
          name: 'Unknown User',
          avatar_url: null
        }
      } as KnowledgeArticle;
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 2
  });
};

export const useArticleMutations = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { currentUser } = useUser();

  const createArticle = async (data: any) => {
    if (!currentUser) {
      toast({
        title: "Authentication required",
        description: "You must be logged in to create an article",
        variant: "destructive"
      });
      throw new Error('Authentication required');
    }

    try {
      setIsSubmitting(true);
      
      const { data: article, error } = await supabase
        .from('knowledge_articles')
        .insert({
          user_id: currentUser.id,
          title: data.title,
          content: data.content,
          tags: data.tags,
          content_type: data.content_type || ContentType.ARTICLE
        })
        .select()
        .single();

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ['knowledgeArticles'] });
      
      toast({
        title: "Article created",
        description: "Your article has been published successfully"
      });

      return article;
    } catch (error: any) {
      toast({
        title: "Failed to create article",
        description: error.message,
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateArticle = async ({ id, data }: { id: string; data: any }) => {
    if (!currentUser) {
      toast({
        title: "Authentication required",
        description: "You must be logged in to update an article",
        variant: "destructive"
      });
      throw new Error('Authentication required');
    }

    try {
      setIsSubmitting(true);
      
      const { error } = await supabase
        .from('knowledge_articles')
        .update({
          title: data.title,
          content: data.content,
          tags: data.tags
        })
        .eq('id', id);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ['knowledgeArticle', id] });
      queryClient.invalidateQueries({ queryKey: ['knowledgeArticles'] });
      
      toast({
        title: "Article updated",
        description: "Your article has been updated successfully"
      });
    } catch (error: any) {
      toast({
        title: "Failed to update article",
        description: error.message,
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteArticle = async (id: string) => {
    if (!currentUser) {
      toast({
        title: "Authentication required",
        description: "You must be logged in to delete an article",
        variant: "destructive"
      });
      throw new Error('Authentication required');
    }

    try {
      setIsSubmitting(true);
      
      const { error } = await supabase
        .from('knowledge_articles')
        .delete()
        .eq('id', id);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ['knowledgeArticles'] });
      
      toast({
        title: "Article deleted",
        description: "The article has been deleted successfully"
      });
    } catch (error: any) {
      toast({
        title: "Failed to delete article",
        description: error.message,
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  const archiveArticle = async (id: string) => {
    try {
      setIsSubmitting(true);
      
      const { error } = await supabase
        .from('knowledge_articles')
        .update({ is_archived: true })
        .eq('id', id);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ['knowledgeArticle', id] });
      queryClient.invalidateQueries({ queryKey: ['knowledgeArticles'] });
      
      toast({
        title: "Article archived",
        description: "The article has been archived"
      });
    } catch (error: any) {
      toast({
        title: "Failed to archive article",
        description: error.message,
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  const unarchiveArticle = async (id: string) => {
    try {
      setIsSubmitting(true);
      
      const { error } = await supabase
        .from('knowledge_articles')
        .update({ is_archived: false })
        .eq('id', id);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ['knowledgeArticle', id] });
      queryClient.invalidateQueries({ queryKey: ['knowledgeArticles'] });
      
      toast({
        title: "Article unarchived",
        description: "The article has been unarchived"
      });
    } catch (error: any) {
      toast({
        title: "Failed to unarchive article",
        description: error.message,
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    createArticle,
    updateArticle,
    deleteArticle,
    archiveArticle,
    unarchiveArticle,
    isSubmitting
  };
};
