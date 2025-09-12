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
          .select('user_id, first_name, last_name, full_name, avatar_url')
          .in('user_id', userIds);
          
        if (profileError) {
          console.error('Error fetching comment author profiles:', profileError);
        }
        
        // Create profile map
        const profileMap = (profiles || []).reduce((acc: any, profile: any) => {
          acc[profile.user_id] = profile;
          return acc;
        }, {});

        // Transform comments with authors
        const enhancedComments = (comments as any[]).map((comment: any) => {
          const profile = profileMap[comment.author_id];

          return {
            ...comment,
            author: {
              id: comment.author_id,
              name: profile?.full_name || `${profile?.first_name || ''} ${profile?.last_name || ''}`.trim() || 'Anonymous',
              avatar_url: profile?.avatar_url
            },
            mentions: [], // Empty for now since mention table doesn't exist
            user_id: comment.author_id, // Add for compatibility
            is_accepted: comment.is_accepted_answer
          } as any;
        });

        return enhancedComments;
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

export const useUserComments = () => {
  const { currentUser } = useUser();
  
  return useQuery({
    queryKey: ['userComments', currentUser?.id],
    queryFn: async () => {
      if (!currentUser) return [];

      try {
        const { data: comments, error } = await supabase
          .from('knowledge_comments' as any)
          .select('*')
          .eq('author_id', currentUser.id)
          .order('created_at', { ascending: false });

        if (error) throw error;

        return (comments as any[]).filter((comment: any) => {
          if (!currentUser) return false;
          return comment.author_id === currentUser.id;
        });
      } catch (error) {
        console.error('Error fetching user comments:', error);
        return [];
      }
    },
    enabled: !!currentUser,
  });
};

export const useEnhancedCommentMutations = () => {
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
      console.log('Creating enhanced comment for article:', articleId);
      
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

      if (error) throw error;

      // Process mentions - placeholder for now
      const mentionedUsers = extractMentionsFromContent(content);
      if (mentionedUsers.length > 0) {
        console.log('Mentions detected:', mentionedUsers);
        // Would insert to knowledge_comment_mentions table when it exists
      }
      
      await queryClient.invalidateQueries({ queryKey: ['enhancedComments', articleId] });
      
      toast({
        title: "Comment posted",
        description: "Your comment has been posted successfully"
      });
      
      return comment;
    } catch (error: any) {
      console.error('Enhanced comment creation error:', error);
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
  
  const updateComment = async (commentId: string, content: string, articleId: string) => {
    if (!currentUser) {
      toast({
        title: "Authentication required",
        description: "You must be logged in to update a comment",
        variant: "destructive"
      });
      throw new Error('Authentication required');
    }
    
    try {
      setIsSubmitting(true);
      
      const { error } = await supabase
        .from('knowledge_comments' as any)
        .update({ content, updated_at: new Date().toISOString() })
        .eq('id', commentId)
        .eq('author_id', currentUser.id);

      if (error) throw error;

      await queryClient.invalidateQueries({ queryKey: ['enhancedComments', articleId] });
      
      toast({
        title: "Comment updated",
        description: "Your comment has been updated successfully"
      });
    } catch (error: any) {
      toast({
        title: "Failed to update comment",
        description: error.message,
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
        .from('knowledge_comments' as any)
        .delete()
        .eq('id', commentId);

      if (error) throw error;
      
      await queryClient.invalidateQueries({ queryKey: ['enhancedComments', articleId] });
      
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
        .from('knowledge_comments' as any)
        .update({ is_accepted_answer: isAccepted })
        .eq('id', commentId);

      if (error) throw error;

      // If accepting, update the article
      if (isAccepted) {
        const { error: articleError } = await supabase
          .from('knowledge_articles' as any)
          .update({ has_accepted_answer: true })
          .eq('id', articleId);

        if (articleError) {
          console.error('Failed to update article:', articleError);
        }
      }
      
      await queryClient.invalidateQueries({ queryKey: ['enhancedComments', articleId] });
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
    updateComment,
    deleteComment,
    acceptAnswer,
    isSubmitting
  };
};

// Helper function to extract mentions from content
const extractMentionsFromContent = (content: string): Array<{id: string, username: string}> => {
  const mentionRegex = /@(\w+)/g;
  const mentions: Array<{id: string, username: string}> = [];
  let match;
  
  while ((match = mentionRegex.exec(content)) !== null) {
    mentions.push({
      id: match[1], // This would need proper user lookup
      username: match[1]
    });
  }
  
  return mentions;
};

// Hook for searching users for mentions
export const useUserSearch = () => {
  const searchUsers = async (query: string) => {
    if (!query || query.length < 2) return [];
    
    try {
      const { data: users, error } = await supabase
        .from('profiles')
        .select('user_id, first_name, last_name, full_name, avatar_url')
        .or(`first_name.ilike.%${query}%,last_name.ilike.%${query}%,full_name.ilike.%${query}%`)
        .limit(10);

      if (error) throw error;

      return (users || []).map((user: any) => ({
        id: user.user_id,
        name: user.full_name || `${user.first_name || ''} ${user.last_name || ''}`.trim(),
        avatar_url: user.avatar_url,
        username: user.full_name || 'user' // Placeholder
      }));
    } catch (error) {
      console.error('Error searching users:', error);
      return [];
    }
  };
  
  return { searchUsers };
};