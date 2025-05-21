import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/contexts/UserContext';
import { KnowledgeArticle, ContentType } from '@/models/knowledgeTypes';

export const useArticles = (filters?: { tag?: string | null, searchQuery?: string, limit?: number, type?: string }) => {
  const queryKey = ['knowledgeArticles', filters];
  
  return useQuery({
    queryKey,
    queryFn: async () => {
      let query = supabase
        .from('knowledge_articles')
        .select(`
          *,
          profiles:user_id (
            first_name,
            last_name,
            avatar_url
          )
        `)
        .order('created_at', { ascending: false });
      
      if (filters?.tag) {
        query = query.contains('tags', [filters.tag]);
      }
      
      if (filters?.searchQuery) {
        query = query.or(`title.ilike.%${filters.searchQuery}%,content.ilike.%${filters.searchQuery}%`);
      }
      
      if (filters?.type) {
        query = query.eq('content_type', filters.type);
      }
      
      if (filters?.limit) {
        query = query.limit(filters.limit);
      }
      
      const { data, error } = await query;
      
      if (error) {
        throw error;
      }
      
      // Format author information with proper type safety
      return data.map(article => {
        const profileData = article.profiles as { 
          first_name?: string; 
          last_name?: string; 
          avatar_url?: string 
        } | null;
        
        return {
          ...article,
          content_type: article.content_type || ContentType.ARTICLE,
          author: profileData ? {
            id: article.user_id,
            name: `${profileData.first_name || ''} ${profileData.last_name || ''}`.trim(),
            avatar_url: profileData.avatar_url || ''
          } : undefined
        };
      }) as KnowledgeArticle[];
    }
  });
};

export const useArticle = (id: string | undefined) => {
  const { currentUser } = useUser();
  
  return useQuery({
    queryKey: ['knowledgeArticle', id],
    queryFn: async () => {
      if (!id) throw new Error('Article ID is required');
      
      // Increment view count using the dedicated RPC function
      await supabase.rpc('increment_view_count', { article_id: id });
      
      const { data, error } = await supabase
        .from('knowledge_articles')
        .select(`
          *,
          profiles:user_id (
            first_name, 
            last_name, 
            avatar_url
          )
        `)
        .eq('id', id)
        .single();
      
      if (error) {
        throw error;
      }
      
      // Get vote count for article
      const { data: voteData, error: voteError } = await supabase
        .rpc('get_article_vote_count', { article_id: id });
        
      if (voteError) {
        console.error('Error fetching vote count:', voteError);
      }
      
      // Get user's vote if authenticated
      let userVote = null;
      if (currentUser) {
        const { data: userVoteData, error: userVoteError } = await supabase
          .from('knowledge_votes')
          .select('vote_type')
          .eq('article_id', id)
          .eq('user_id', currentUser.id)
          .maybeSingle();
          
        if (!userVoteError && userVoteData) {
          userVote = userVoteData.vote_type;
        }
      }
      
      // Format author information with proper type safety
      const profileData = data.profiles as {
        first_name?: string;
        last_name?: string;
        avatar_url?: string;
      } | null;
      
      return {
        ...data,
        content_type: ContentType.ARTICLE, // Default to ARTICLE type
        author: profileData ? {
          id: data.user_id,
          name: `${profileData.first_name || ''} ${profileData.last_name || ''}`.trim(),
          avatar_url: profileData.avatar_url || ''
        } : undefined,
        vote_count: voteData || 0,
        user_vote: userVote
      } as KnowledgeArticle;
    },
    enabled: !!id
  });
};

export const useArticleMutations = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { currentUser } = useUser();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mutation for creating an article
  const createArticle = async (article: { 
    title: string, 
    content: string, 
    tags?: string[], 
    content_type?: ContentType,
    subtitle?: string,
    source?: string,
    options?: string[] 
  }) => {
    try {
      setIsSubmitting(true);
      
      if (!currentUser) {
        throw new Error('You must be logged in to create content');
      }
      
      // Build the article object with all required fields
      const newArticle = {
        title: article.title,
        content: article.content,
        user_id: currentUser.id,
        tags: article.tags || [],
        content_type: article.content_type || ContentType.ARTICLE,
        // Additional fields for specific content types
        ...(article.subtitle && { subtitle: article.subtitle }),
        ...(article.source && { source: article.source }),
        ...(article.options && { options: article.options })
      };
      
      console.log('Creating new article:', newArticle);
      
      const { data, error } = await supabase
        .from('knowledge_articles')
        .insert(newArticle)
        .select()
        .single();
      
      if (error) {
        console.error('Error inserting article:', error);
        throw error;
      }
      
      // Ensure tags exist
      if (article.tags && article.tags.length > 0) {
        const uniqueTags = [...new Set(article.tags)];
        for (const tag of uniqueTags) {
          // Skip empty tags
          if (!tag.trim()) continue;
          
          // Insert tag if it doesn't exist (using upsert with on_conflict: nothing)
          const { error: tagError } = await supabase
            .from('knowledge_tags')
            .upsert(
              { name: tag.toLowerCase().trim(), description: null },
              { onConflict: 'name', ignoreDuplicates: true }
            );
            
          if (tagError) {
            console.warn('Error upserting tag:', tagError);
          }
        }
      }
      
      // Invalidate relevant queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['knowledgeArticles'] });
      queryClient.invalidateQueries({ queryKey: ['knowledgeTags'] });
      
      toast({
        title: "Success",
        description: "Content created successfully",
      });
      
      return data as KnowledgeArticle;
    } catch (error: any) {
      toast({
        title: "Error creating content",
        description: error.message,
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Mutation for updating an article
  const updateArticle = async (id: string, updates: { title?: string, content?: string, tags?: string[] }) => {
    try {
      setIsSubmitting(true);
      
      if (!currentUser) {
        throw new Error('You must be logged in to update an article');
      }
      
      const articleUpdates = {
        ...(updates.title && { title: updates.title }),
        ...(updates.content && { content: updates.content }),
        ...(updates.tags && { tags: updates.tags })
      };
      
      const { data, error } = await supabase
        .from('knowledge_articles')
        .update(articleUpdates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      // Ensure tags exist
      if (updates.tags && updates.tags.length > 0) {
        for (const tag of updates.tags) {
          // Insert tag if it doesn't exist
          await supabase
            .from('knowledge_tags')
            .insert({ name: tag.toLowerCase(), description: null })
            .select();
        }
      }
      
      queryClient.invalidateQueries({ queryKey: ['knowledgeArticle', id] });
      queryClient.invalidateQueries({ queryKey: ['knowledgeArticles'] });
      toast({
        title: "Success",
        description: "Article updated successfully",
      });
      
      return data as KnowledgeArticle;
    } catch (error: any) {
      toast({
        title: "Error updating article",
        description: error.message,
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Mutation for deleting an article
  const deleteArticle = async (id: string) => {
    try {
      setIsSubmitting(true);
      
      if (!currentUser) {
        throw new Error('You must be logged in to delete an article');
      }
      
      const { error } = await supabase
        .from('knowledge_articles')
        .delete()
        .eq('id', id);
      
      if (error) {
        throw error;
      }
      
      queryClient.invalidateQueries({ queryKey: ['knowledgeArticles'] });
      toast({
        title: "Success",
        description: "Article deleted successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error deleting article",
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
    isSubmitting
  };
};
