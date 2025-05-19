
import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/contexts/UserContext';
import { 
  KnowledgeArticle, 
  KnowledgeComment, 
  KnowledgeTag,
  KnowledgeVote,
  VoteType 
} from '@/models/knowledgeTypes';

export const useKnowledgeBase = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { currentUser } = useUser();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Query for fetching articles
  const useArticles = (filters?: { tag?: string, searchQuery?: string, limit?: number }) => {
    const queryKey = ['knowledgeArticles', filters];
    
    return useQuery({
      queryKey,
      queryFn: async () => {
        let query = supabase
          .from('knowledge_articles')
          .select(`
            *,
            profiles:user_id(
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
        
        if (filters?.limit) {
          query = query.limit(filters.limit);
        }
        
        const { data, error } = await query;
        
        if (error) {
          throw error;
        }
        
        // Format author information
        return data.map(article => ({
          ...article,
          author: article.profiles ? {
            name: `${article.profiles.first_name || ''} ${article.profiles.last_name || ''}`.trim(),
            avatar_url: article.profiles.avatar_url || ''
          } : undefined
        })) as KnowledgeArticle[];
      }
    });
  };
  
  // Query for fetching a single article
  const useArticle = (id: string | undefined) => {
    return useQuery({
      queryKey: ['knowledgeArticle', id],
      queryFn: async () => {
        if (!id) throw new Error('Article ID is required');
        
        // Increment view count using a simpler approach
        await supabase
          .from('knowledge_articles')
          .update({ view_count: supabase.rpc('get_article_view_count', { article_id: id }) + 1 })
          .eq('id', id);
        
        const { data, error } = await supabase
          .from('knowledge_articles')
          .select(`
            *,
            profiles:user_id(
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
        
        return {
          ...data,
          author: data.profiles ? {
            name: `${data.profiles.first_name || ''} ${data.profiles.last_name || ''}`.trim(),
            avatar_url: data.profiles.avatar_url || ''
          } : undefined,
          vote_count: voteData || 0,
          user_vote: userVote
        } as KnowledgeArticle;
      },
      enabled: !!id
    });
  };
  
  // Query for fetching tags
  const useTags = () => {
    return useQuery({
      queryKey: ['knowledgeTags'],
      queryFn: async () => {
        const { data, error } = await supabase
          .from('knowledge_tags')
          .select('*')
          .order('name');
        
        if (error) {
          throw error;
        }
        
        return data as KnowledgeTag[];
      }
    });
  };
  
  // Query for fetching comments for an article
  const useComments = (articleId: string | undefined) => {
    return useQuery({
      queryKey: ['knowledgeComments', articleId],
      queryFn: async () => {
        if (!articleId) throw new Error('Article ID is required');
        
        const { data, error } = await supabase
          .from('knowledge_comments')
          .select(`
            *,
            profiles:user_id(
              first_name, 
              last_name, 
              avatar_url
            )
          `)
          .eq('article_id', articleId)
          .order('is_accepted', { ascending: false })
          .order('created_at');
        
        if (error) {
          throw error;
        }
        
        // Get vote counts for comments
        const commentsWithVotes = await Promise.all(data.map(async (comment) => {
          // Get vote count for comment
          const { data: voteData, error: voteError } = await supabase
            .rpc('get_comment_vote_count', { comment_id: comment.id });
            
          if (voteError) {
            console.error('Error fetching vote count:', voteError);
          }
          
          // Get user's vote if authenticated
          let userVote = null;
          if (currentUser) {
            const { data: userVoteData, error: userVoteError } = await supabase
              .from('knowledge_votes')
              .select('vote_type')
              .eq('comment_id', comment.id)
              .eq('user_id', currentUser.id)
              .maybeSingle();
              
            if (!userVoteError && userVoteData) {
              userVote = userVoteData.vote_type;
            }
          }
          
          return {
            ...comment,
            author: comment.profiles ? {
              name: `${comment.profiles.first_name || ''} ${comment.profiles.last_name || ''}`.trim(),
              avatar_url: comment.profiles.avatar_url || ''
            } : undefined,
            vote_count: voteData || 0,
            user_vote: userVote
          };
        }));
        
        return commentsWithVotes as KnowledgeComment[];
      },
      enabled: !!articleId
    });
  };
  
  // Mutation for creating an article
  const createArticle = async (article: { title: string, content: string, tags?: string[] }) => {
    try {
      setIsSubmitting(true);
      
      if (!currentUser) {
        throw new Error('You must be logged in to create an article');
      }
      
      const newArticle = {
        title: article.title,
        content: article.content,
        user_id: currentUser.id,
        tags: article.tags || []
      };
      
      const { data, error } = await supabase
        .from('knowledge_articles')
        .insert(newArticle)
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      // Ensure tags exist
      if (article.tags && article.tags.length > 0) {
        for (const tag of article.tags) {
          // Insert tag if it doesn't exist
          await supabase
            .from('knowledge_tags')
            .insert({ name: tag.toLowerCase(), description: null })
            .select();
        }
      }
      
      queryClient.invalidateQueries({ queryKey: ['knowledgeArticles'] });
      toast({
        title: "Success",
        description: "Article created successfully",
      });
      
      return data as KnowledgeArticle;
    } catch (error: any) {
      toast({
        title: "Error creating article",
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
  
  // Mutation for creating a comment
  const createComment = async (articleId: string, content: string) => {
    try {
      setIsSubmitting(true);
      
      if (!currentUser) {
        throw new Error('You must be logged in to comment');
      }
      
      const { data, error } = await supabase
        .from('knowledge_comments')
        .insert({
          article_id: articleId,
          user_id: currentUser.id,
          content
        })
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      queryClient.invalidateQueries({ queryKey: ['knowledgeComments', articleId] });
      toast({
        title: "Success",
        description: "Comment added successfully",
      });
      
      return data as KnowledgeComment;
    } catch (error: any) {
      toast({
        title: "Error adding comment",
        description: error.message,
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Mutation for updating a comment
  const updateComment = async (id: string, articleId: string, updates: Partial<KnowledgeComment>) => {
    try {
      setIsSubmitting(true);
      
      if (!currentUser) {
        throw new Error('You must be logged in to update a comment');
      }
      
      const { data, error } = await supabase
        .from('knowledge_comments')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      queryClient.invalidateQueries({ queryKey: ['knowledgeComments', articleId] });
      toast({
        title: "Success",
        description: "Comment updated successfully",
      });
      
      return data as KnowledgeComment;
    } catch (error: any) {
      toast({
        title: "Error updating comment",
        description: error.message,
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Mutation for deleting a comment
  const deleteComment = async (id: string, articleId: string) => {
    try {
      setIsSubmitting(true);
      
      if (!currentUser) {
        throw new Error('You must be logged in to delete a comment');
      }
      
      const { error } = await supabase
        .from('knowledge_comments')
        .delete()
        .eq('id', id);
      
      if (error) {
        throw error;
      }
      
      queryClient.invalidateQueries({ queryKey: ['knowledgeComments', articleId] });
      toast({
        title: "Success",
        description: "Comment deleted successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error deleting comment",
        description: error.message,
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Function for voting on an article or comment
  const vote = useCallback(async (
    type: 'article' | 'comment',
    id: string,
    voteType: VoteType
  ) => {
    try {
      if (!currentUser) {
        toast({
          title: "Authentication Required",
          description: "Please log in to vote",
          variant: "destructive"
        });
        return;
      }
      
      const voteValue = voteType === 'upvote' ? 1 : voteType === 'downvote' ? -1 : 0;
      const idField = type === 'article' ? 'article_id' : 'comment_id';
      
      // Check if user has already voted
      const { data: existingVote, error: checkError } = await supabase
        .from('knowledge_votes')
        .select('id, vote_type')
        .eq(idField, id)
        .eq('user_id', currentUser.id)
        .maybeSingle();
      
      if (checkError) {
        throw checkError;
      }
      
      // If user wants to remove vote (same as current)
      if (existingVote && ((existingVote.vote_type === 1 && voteType === 'upvote') || 
                          (existingVote.vote_type === -1 && voteType === 'downvote'))) {
        // Delete the vote
        const { error } = await supabase
          .from('knowledge_votes')
          .delete()
          .eq('id', existingVote.id);
        
        if (error) {
          throw error;
        }
      } 
      // If user already voted but wants to change vote type
      else if (existingVote) {
        // Update the vote
        const { error } = await supabase
          .from('knowledge_votes')
          .update({ vote_type: voteValue })
          .eq('id', existingVote.id);
        
        if (error) {
          throw error;
        }
      } 
      // New vote
      else if (voteType !== 'none') {
        // Create a new vote
        const { error } = await supabase
          .from('knowledge_votes')
          .insert({
            [idField]: id,
            user_id: currentUser.id,
            vote_type: voteValue
          });
        
        if (error) {
          throw error;
        }
      }
      
      // Invalidate queries
      if (type === 'article') {
        queryClient.invalidateQueries({ queryKey: ['knowledgeArticle', id] });
      } else {
        queryClient.invalidateQueries({ queryKey: ['knowledgeComments'] });
      }
    } catch (error: any) {
      toast({
        title: "Error voting",
        description: error.message,
        variant: "destructive"
      });
    }
  }, [currentUser, queryClient, toast]);
  
  // Function for accepting a comment as the answer
  const acceptAnswer = async (commentId: string, articleId: string, accepted: boolean) => {
    try {
      if (!currentUser) {
        throw new Error('You must be logged in to accept an answer');
      }
      
      // Update the comment
      const { error: commentError } = await supabase
        .from('knowledge_comments')
        .update({ is_accepted: accepted })
        .eq('id', commentId);
      
      if (commentError) {
        throw commentError;
      }
      
      // Update the article
      const { error: articleError } = await supabase
        .from('knowledge_articles')
        .update({ is_answered: accepted })
        .eq('id', articleId);
      
      if (articleError) {
        throw articleError;
      }
      
      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: ['knowledgeArticle', articleId] });
      queryClient.invalidateQueries({ queryKey: ['knowledgeComments', articleId] });
      
      toast({
        title: "Success",
        description: accepted 
          ? "Answer marked as accepted" 
          : "Answer unmarked as accepted",
      });
    } catch (error: any) {
      toast({
        title: "Error accepting answer",
        description: error.message,
        variant: "destructive"
      });
      throw error;
    }
  };
  
  return {
    // Queries
    useArticles,
    useArticle,
    useTags,
    useComments,
    
    // Mutations
    createArticle,
    updateArticle,
    deleteArticle,
    createComment,
    updateComment,
    deleteComment,
    vote,
    acceptAnswer,
    
    // State
    isSubmitting
  };
};
