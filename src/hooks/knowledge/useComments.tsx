
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { KnowledgeComment } from '@/models/knowledgeTypes';
import { useUser } from '@/contexts/UserContext';
import { useState } from 'react';

export const useComments = (articleId: string | undefined) => {
  return useQuery({
    queryKey: ['articleComments', articleId],
    queryFn: async () => {
      if (!articleId) return [];
      
      console.log('Fetching comments for article:', articleId);
      
      try {
        // First fetch the comments
        const { data: comments, error } = await supabase
          .from('knowledge_comments' as any)
          .select('*')
          .eq('article_id', articleId)
          .order('created_at', { ascending: true });
          
        if (error) {
          console.error('Error fetching comments:', error);
          throw error;
        }
        
        if (!comments || comments.length === 0) {
          return [] as KnowledgeComment[];
        }
        
        // Extract all unique user IDs
        const userIds = [...new Set((comments as any[]).map((comment: any) => comment.author_id))];
        
        // Fetch all author profiles in a single query
        const { data: profiles, error: profileError } = await supabase
          .from('profiles')
          .select('id, user_id, first_name, last_name, full_name, avatar_url')
          .in('user_id', userIds);
          
        if (profileError) {
          console.error('Error fetching comment author profiles:', profileError);
          // Continue even if profile fetch fails
        }
        
        // Create a map of user_id to profile for easy lookup
        const profileMap = (profiles || []).reduce((map: any, profile: any) => {
          map[profile.user_id] = profile;
          return map;
        }, {} as Record<string, any>);
        
        // Get vote counts for all comments in a single call
        const commentIds = (comments as any[]).map((comment: any) => comment.id);
        
        // Fetch all votes in one query
        const { data: votes, error: votesError } = await supabase
          .from('knowledge_votes' as any)
          .select('comment_id, vote_type, user_id')
          .in('comment_id', commentIds);
          
        if (votesError) {
          console.error('Error fetching comment votes:', votesError);
          // Continue even if vote fetch fails
        }
        
        // Calculate vote totals and user votes
        const voteMap = new Map();
        const userVoteMap = new Map();
        
        if (votes) {
          // Calculate total votes per comment
          (votes as any[]).forEach((vote: any) => {
            const commentId = vote.comment_id;
            if (!voteMap.has(commentId)) {
              voteMap.set(commentId, 0);
            }
            const voteValue = vote.vote_type === 'up' ? 1 : -1;
            voteMap.set(commentId, voteMap.get(commentId) + voteValue);
            
            // Also track each user's vote for each comment
            const key = `${vote.comment_id}_${vote.user_id}`;
            userVoteMap.set(key, vote.vote_type);
          });
        }
        
        // Get current user id for user votes
        const { data: { user } } = await supabase.auth.getUser();
        const currentUserId = user?.id;
        
        // Enhance comments with author and vote data
        return (comments as any[]).map((comment: any) => {
          const profile = profileMap[comment.author_id];
          
          return {
            ...comment,
            author: profile ? {
              id: comment.author_id,
              name: profile.full_name || `${profile.first_name || ''} ${profile.last_name || ''}`.trim(),
              avatar_url: profile.avatar_url
            } : {
              id: comment.author_id,
              name: 'Unknown User',
              avatar_url: null
            },
            vote_count: voteMap.get(comment.id) || 0,
            user_vote: userVoteMap.get(`${comment.id}_${currentUserId}`) || null
          } as any;
        });
      } catch (error) {
        console.error('Error processing comments:', error);
        throw error;
      }
    },
    enabled: !!articleId,
    staleTime: 1000 * 60, // 1 minute
    retry: 2
  });
};

export const useCommentMutations = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { currentUser } = useUser();
  
  const createComment = async (articleId: string, content: string) => {
    if (!currentUser) {
      toast({
        title: "Authentication required",
        description: "You must be logged in to comment",
        variant: "destructive"
      });
      throw new Error('Authentication required');
    }
    
    try {
      setIsSubmitting(true);
      console.log('Creating comment for article:', articleId);
      console.log('Current user:', currentUser);
      
      // Verify we have all the required data
      if (!content.trim()) {
        throw new Error('Comment content cannot be empty');
      }
      
      if (!articleId) {
        throw new Error('Article ID is required');
      }
      
      const { data: comment, error } = await supabase
        .from('knowledge_comments' as any)
        .insert({
          article_id: articleId,
          author_id: currentUser.id,
          content
        })
        .select()
        .single();
        
      if (error) {
        console.error('Error creating comment:', error);
        
        // Log more detailed information to help troubleshoot
        console.error('Error details:', {
          message: error.message,
          code: error.code,
          details: error.details,
          hint: error.hint
        });
        
        // Handle specific error types
        if (error.code === '42501') {
          throw new Error('Permission denied: you do not have the right permissions to add comments');
        }
        
        if (error.code === '23503') {
          throw new Error('Invalid article reference: the article may have been deleted');
        }
        
        throw error;
      }
      
      // Invalidate related queries
      await queryClient.invalidateQueries({ queryKey: ['articleComments', articleId] });
      
      toast({
        title: "Comment posted",
        description: "Your comment has been posted successfully"
      });
      
      return comment;
    } catch (error: any) {
      console.error('Comment creation error details:', error);
      toast({
        title: "Failed to post comment",
        description: error.message || "An unexpected error occurred",
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const deleteComment = async (commentId: string, articleId: string) => {
    if (!currentUser) {
      toast({
        title: "Authentication required",
        description: "You must be logged in to delete a comment",
        variant: "destructive"
      });
      throw new Error('Authentication required');
    }
    
    try {
      setIsSubmitting(true);
      
      // Delete the comment - we no longer need to check for user_id
      // as the RLS policy will handle access control
      const { error } = await supabase
        .from('knowledge_comments' as any)
        .delete()
        .eq('id', commentId);
        
      if (error) {
        console.error('Error deleting comment:', error);
        throw error;
      }
      
      // Invalidate related queries
      await queryClient.invalidateQueries({ queryKey: ['articleComments', articleId] });
      
      toast({
        title: "Comment deleted",
        description: "The comment has been deleted successfully"
      });
    } catch (error: any) {
      toast({
        title: "Failed to delete comment",
        description: error.message,
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const acceptAnswer = async (commentId: string, articleId: string, isAccepted: boolean) => {
    if (!currentUser) {
      toast({
        title: "Authentication required",
        description: "You must be logged in to accept an answer",
        variant: "destructive"
      });
      throw new Error('Authentication required');
    }
    
    try {
      setIsSubmitting(true);
      
      // Update the comment
      const { error } = await supabase
        .from('knowledge_comments' as any)
        .update({ is_accepted_answer: isAccepted })
        .eq('id', commentId);
        
      if (error) {
        console.error('Error accepting answer:', error);
        throw error;
      }
      
      // If accepting an answer, also update the article to mark it as answered
      if (isAccepted) {
        const { error: articleError } = await supabase
          .from('knowledge_articles' as any)
          .update({ has_accepted_answer: true })
          .eq('id', articleId);
          
        if (articleError) {
          console.error('Error updating article answered status:', articleError);
        }
      }
      
      // Invalidate related queries
      await queryClient.invalidateQueries({ queryKey: ['articleComments', articleId] });
      await queryClient.invalidateQueries({ queryKey: ['knowledgeArticle', articleId] });
      
      toast({
        title: isAccepted ? "Answer accepted" : "Answer unaccepted",
        description: isAccepted ? "You've marked this as the accepted answer" : "You've removed this as the accepted answer"
      });
    } catch (error: any) {
      toast({
        title: "Action failed",
        description: error.message,
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return {
    createComment,
    deleteComment,
    acceptAnswer,
    isSubmitting
  };
};
