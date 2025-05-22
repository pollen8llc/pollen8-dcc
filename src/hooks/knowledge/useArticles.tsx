
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/contexts/UserContext';
import { KnowledgeArticle, ContentType } from '@/models/knowledgeTypes';

export const useArticles = (filters?: { tag?: string | null, searchQuery?: string, limit?: number, type?: string | null }) => {
  const queryKey = ['knowledgeArticles', filters];
  const queryClient = useQueryClient();
  
  return useQuery({
    queryKey,
    queryFn: async () => {
      console.log('Fetching articles with filters:', filters);
      
      // First fetch the articles without trying to join with profiles
      let query = supabase
        .from('knowledge_articles')
        .select(`
          id, 
          title,
          content,
          created_at,
          updated_at,
          view_count,
          is_answered,
          tags,
          content_type,
          user_id
        `)
        .order('created_at', { ascending: false });
      
      if (filters?.tag) {
        query = query.contains('tags', [filters.tag]);
      }
      
      if (filters?.searchQuery) {
        query = query.or(`title.ilike.%${filters.searchQuery}%,content.ilike.%${filters.searchQuery}%`);
      }
      
      // Only filter by type if it's not null/undefined and not 'all'
      if (filters?.type && filters?.type !== 'all') {
        query = query.eq('content_type', filters.type);
      }
      
      if (filters?.limit) {
        query = query.limit(filters.limit);
      }
      
      const { data: articles, error } = await query;
      
      if (error) {
        console.error('Error fetching articles:', error);
        throw error;
      }
      
      console.log('Articles fetched successfully:', articles?.length || 0);
      
      // If no articles, return empty array
      if (!articles || articles.length === 0) {
        return [] as KnowledgeArticle[];
      }
      
      // Extract all unique user_ids to fetch their profiles
      const userIds = [...new Set(articles.map(article => article.user_id))];
      
      // Fetch profiles for all authors in a single query
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, avatar_url')
        .in('id', userIds);
      
      if (profilesError) {
        console.error('Error fetching author profiles:', profilesError);
        // Continue with articles even if profiles fetch fails
      }
      
      // Create a map of user_id to profile for easy lookup
      const profilesMap = (profiles || []).reduce((map, profile) => {
        map[profile.id] = profile;
        return map;
      }, {} as Record<string, any>);
      
      // Format the articles with author information and add missing fields
      return articles.map(article => {
        const profileData = profilesMap[article.user_id];
        
        return {
          ...article,
          content_type: article.content_type || ContentType.ARTICLE,
          like_count: 0, // Add missing fields required by KnowledgeArticle type
          is_pinned: false, // Add missing fields required by KnowledgeArticle type
          author: profileData ? {
            id: article.user_id,
            name: `${profileData.first_name || ''} ${profileData.last_name || ''}`.trim(),
            avatar_url: profileData.avatar_url || '',
            is_admin: false // Add missing field
          } : undefined
        } as KnowledgeArticle;
      });
    },
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    staleTime: 1000 * 60 * 5, // 5 minutes
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
      
      // Fetch the article without joining with profiles
      const { data: article, error } = await supabase
        .from('knowledge_articles')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) {
        throw error;
      }
      
      // Now fetch the profile data separately
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, avatar_url')
        .eq('id', article.user_id)
        .maybeSingle();
      
      if (profileError) {
        console.error('Error fetching author profile:', profileError);
        // Continue with article even if profile fetch fails
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
      
      // Format author information
      const profileData = profile;
      
      // Add missing fields required by KnowledgeArticle type
      return {
        ...article,
        content_type: article.content_type || ContentType.ARTICLE,
        like_count: 0,
        is_pinned: false,
        author: profileData ? {
          id: article.user_id,
          name: `${profileData.first_name || ''} ${profileData.last_name || ''}`.trim(),
          avatar_url: profileData.avatar_url || '',
          is_admin: false
        } : undefined,
        vote_count: voteData || 0,
        user_vote: userVote,
        is_featured: false
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
      
      // Immediately invalidate relevant queries to force a refetch
      await queryClient.invalidateQueries({ queryKey: ['knowledgeArticles'] });
      await queryClient.invalidateQueries({ queryKey: ['knowledgeTags'] });
      
      // Force refetch all article queries
      await queryClient.refetchQueries({ queryKey: ['knowledgeArticles'] });
      
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
