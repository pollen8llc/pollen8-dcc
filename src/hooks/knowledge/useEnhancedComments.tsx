import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/contexts/UserContext';
import type { KnowledgeComment, KnowledgeCommentMention } from '@/models/knowledgeTypes';
import { useState } from 'react';

export const useEnhancedComments = (articleId: string | undefined) => {
  return useQuery({
    queryKey: ['enhancedComments', articleId],
    queryFn: async () => {
      if (!articleId) return [];
      
      console.log('Fetching enhanced comments for article:', articleId);
      
      try {
        // Fetch all comments (both parent and replies)
        const { data: comments, error } = await supabase
          .from('knowledge_comments')
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
        
        // Fetch mentions for all comments
        const commentIds = comments.map(c => c.id);
        const { data: mentions } = await supabase
          .from('knowledge_comment_mentions')
          .select('*')
          .in('comment_id', commentIds);
        
        // Extract all unique user IDs
        const userIds = [...new Set(comments.map(comment => comment.user_id))];
        
        // Fetch all author profiles in a single query
        const { data: profiles, error: profileError } = await supabase
          .from('profiles')
          .select('id, first_name, last_name, username, avatar_url')
          .in('id', userIds);
          
        if (profileError) {
          console.error('Error fetching comment author profiles:', profileError);
        }
        
        // Create a map of user_id to profile for easy lookup
        const profileMap = (profiles || []).reduce((map, profile) => {
          map[profile.id] = profile;
          return map;
        }, {} as Record<string, any>);
        
        // Get current user id for user context
        const { data: { user } } = await supabase.auth.getUser();
        const currentUserId = user?.id;
        
        // Enhance comments with all data
        const enhancedComments = comments.map(comment => {
          const profile = profileMap[comment.user_id];
          const commentMentions = mentions?.filter(m => m.comment_id === comment.id) || [];
          
          return {
            ...comment,
            author: profile ? {
              id: comment.user_id,
              name: (() => {
                const fullName = `${profile.first_name || ''} ${profile.last_name || ''}`.trim();
                return fullName || profile.username || 'Anonymous User';
              })(),
              avatar_url: profile.avatar_url
            } : {
              id: comment.user_id,
              name: 'Anonymous User',
              avatar_url: null
            },
            mentions: commentMentions
          } as KnowledgeComment;
        });

        // Organize comments into parent-child structure
        const parentComments = enhancedComments.filter(comment => !comment.parent_comment_id);
        const replyComments = enhancedComments.filter(comment => comment.parent_comment_id);
        
        // Attach replies to their parent comments
        const organizedComments = parentComments.map(parent => ({
          ...parent,
          replies: replyComments.filter(reply => reply.parent_comment_id === parent.id)
        }));
        
        console.log('Enhanced comments organized:', organizedComments);
        return organizedComments;
      } catch (error) {
        console.error('Error processing enhanced comments:', error);
        throw error;
      }
    },
    enabled: !!articleId,
    staleTime: 1000 * 60,
    retry: 2
  });
};

export const useEnhancedCommentMutations = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { currentUser } = useUser();
  
  const createComment = async ({ 
    articleId, 
    content, 
    parentCommentId, 
    mentions 
  }: { 
    articleId: string; 
    content: string; 
    parentCommentId?: string; 
    mentions?: string[] 
  }) => {
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
      console.log('Creating enhanced comment for article:', articleId);
      
      if (!content.trim()) {
        throw new Error('Comment content cannot be empty');
      }
      
      if (!articleId) {
        throw new Error('Article ID is required');
      }
      
      const { data: comment, error } = await supabase
        .from('knowledge_comments')
        .insert({
          article_id: articleId,
          user_id: currentUser.id,
          content: content.trim(),
          parent_comment_id: parentCommentId || null
        })
        .select()
        .single();
        
      if (error) {
        console.error('Error creating comment:', error);
        throw error;
      }
      
      // Insert mentions if provided
      if (mentions && mentions.length > 0) {
        const mentionInserts = mentions.map(username => ({
          comment_id: comment.id,
          mentioned_user_id: null,
          mentioned_username: username
        }));

        const { error: mentionError } = await supabase
          .from('knowledge_comment_mentions')
          .insert(mentionInserts);

        if (mentionError) {
          console.warn('Error creating mentions:', mentionError);
        }
      }
      
      // Invalidate related queries
      await queryClient.invalidateQueries({ queryKey: ['enhancedComments', articleId] });
      await queryClient.invalidateQueries({ queryKey: ['articleComments', articleId] });
      
      toast({
        title: parentCommentId ? "Reply posted" : "Comment posted",
        description: parentCommentId ? "Your reply has been posted successfully" : "Your comment has been posted successfully"
      });
      
      return comment;
    } catch (error: any) {
      console.error('Comment creation error:', error);
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
      
      const { error } = await supabase
        .from('knowledge_comments')
        .delete()
        .eq('id', commentId);
        
      if (error) {
        console.error('Error deleting comment:', error);
        throw error;
      }
      
      // Invalidate related queries
      await queryClient.invalidateQueries({ queryKey: ['enhancedComments', articleId] });
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
      
      const { error } = await supabase
        .from('knowledge_comments')
        .update({ is_accepted: isAccepted })
        .eq('id', commentId);
        
      if (error) {
        console.error('Error accepting answer:', error);
        throw error;
      }
      
      if (isAccepted) {
        const { error: articleError } = await supabase
          .from('knowledge_articles')
          .update({ is_answered: true })
          .eq('id', articleId);
          
        if (articleError) {
          console.error('Error updating article answered status:', articleError);
        }
      }
      
      // Invalidate related queries
      await queryClient.invalidateQueries({ queryKey: ['enhancedComments', articleId] });
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

// Hook to search users for mentions
export const useUserSearch = () => {
  const searchUsers = async (query: string) => {
    if (!query.trim() || query.length < 2) return [];
    
    const { data, error } = await supabase
      .from('profiles')
      .select('id, first_name, last_name, username, avatar_url')
      .or(`first_name.ilike.%${query}%,last_name.ilike.%${query}%,username.ilike.%${query}%`)
      .limit(10);
    
    if (error) {
      console.error('Error searching users:', error);
      return [];
    }
    
    return data?.map(user => ({
      id: user.id,
      name: `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.username || 'Unknown User',
      username: user.username || '',
      avatar_url: user.avatar_url
    })) || [];
  };
  
  return { searchUsers };
};