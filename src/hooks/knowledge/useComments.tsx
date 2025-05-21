
import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/contexts/UserContext';
import { KnowledgeComment } from '@/models/knowledgeTypes';

export const useComments = (articleId: string | undefined) => {
  const { currentUser } = useUser();
  
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
        
        // Handle profile data with proper type safety
        const profileData = comment.profiles as {
          first_name?: string;
          last_name?: string;
          avatar_url?: string;
        } | null;
        
        return {
          ...comment,
          author: profileData ? {
            id: comment.user_id,
            name: `${profileData.first_name || ''} ${profileData.last_name || ''}`.trim(),
            avatar_url: profileData.avatar_url || ''
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

export const useCommentMutations = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { currentUser } = useUser();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
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
    createComment,
    updateComment,
    deleteComment,
    acceptAnswer,
    isSubmitting
  };
};
