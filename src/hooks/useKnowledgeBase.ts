
import { useState } from 'react';
import { KnowledgeArticle, KnowledgeTag, KnowledgeQueryOptions } from '@/models/knowledgeTypes';
import { getMockArticles, getMockTags } from '@/data/mockKnowledgeData';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';

export const useKnowledgeBase = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Hook to fetch tags
  const useTags = () => {
    return useQuery({
      queryKey: ['knowledgeTags'],
      queryFn: () => getMockTags()
    });
  };
  
  // Hook to fetch all articles with filtering options
  const useArticles = (options?: KnowledgeQueryOptions) => {
    return useQuery({
      queryKey: ['knowledgeArticles', options],
      queryFn: () => getMockArticles(options)
    });
  };
  
  // Hook to fetch a single article by ID
  const useArticle = (id: string) => {
    return useQuery({
      queryKey: ['knowledgeArticle', id],
      queryFn: async () => {
        const articles = await getMockArticles();
        const article = articles.find(a => a.id === id);
        if (!article) {
          throw new Error('Article not found');
        }
        return article;
      },
      enabled: !!id
    });
  };
  
  // Function to create a new article
  const createArticle = async (data: Partial<KnowledgeArticle>) => {
    setIsSubmitting(true);
    
    try {
      // This would be an API call in a real application
      console.log('Creating article:', data);
      
      // Simulate successful creation
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ['knowledgeArticles'] });
        toast({
          title: "Success",
          description: "Your content has been created successfully",
        });
      }, 1000);
      
      return { id: 'new-article-id', ...data };
    } catch (error) {
      console.error('Error creating article:', error);
      toast({
        title: "Error",
        description: "Failed to create content. Please try again.",
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Function to update an existing article
  const updateArticle = async (id: string, data: Partial<KnowledgeArticle>) => {
    setIsSubmitting(true);
    
    try {
      // This would be an API call in a real application
      console.log(`Updating article ${id}:`, data);
      
      // Simulate successful update
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ['knowledgeArticle', id] });
        queryClient.invalidateQueries({ queryKey: ['knowledgeArticles'] });
        toast({
          title: "Success",
          description: "Your content has been updated successfully",
        });
      }, 1000);
      
      return { id, ...data };
    } catch (error) {
      console.error('Error updating article:', error);
      toast({
        title: "Error",
        description: "Failed to update content. Please try again.",
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Function to delete an article
  const deleteArticle = async (id: string) => {
    setIsSubmitting(true);
    
    try {
      // This would be an API call in a real application
      console.log(`Deleting article ${id}`);
      
      // Simulate successful deletion
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ['knowledgeArticles'] });
        toast({
          title: "Success",
          description: "Content deleted successfully",
        });
      }, 1000);
      
      return true;
    } catch (error) {
      console.error('Error deleting article:', error);
      toast({
        title: "Error",
        description: "Failed to delete content. Please try again.",
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Function to cast a vote on an article
  const voteOnArticle = async (articleId: string, voteType: 'up' | 'down') => {
    try {
      // This would be an API call in a real application
      console.log(`Voting ${voteType} on article ${articleId}`);
      
      // Simulate successful vote
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ['knowledgeArticle', articleId] });
        toast({
          title: "Vote recorded",
          description: `Your ${voteType} vote has been recorded`,
        });
      }, 500);
      
      return true;
    } catch (error) {
      console.error('Error voting on article:', error);
      toast({
        title: "Error",
        description: "Failed to record vote. Please try again.",
        variant: "destructive"
      });
      throw error;
    }
  };
  
  return {
    useTags,
    useArticles,
    useArticle,
    createArticle,
    updateArticle,
    deleteArticle,
    voteOnArticle,
    isSubmitting
  };
};
