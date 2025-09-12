import { useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/contexts/UserContext';
import { VoteType } from '@/models/knowledgeTypes';

export const useVote = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { currentUser } = useUser();
  
  const vote = useCallback(async (
    type: 'article' | 'comment',
    id: string,
    voteType: VoteType,
    articleId?: string
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
      
      const voteValue = voteType === 'upvote' ? 'upvote' : voteType === 'downvote' ? 'downvote' : 'none';
      const idField = type === 'article' ? 'article_id' : 'comment_id';
      
      // Check if user has already voted
      const { data: existingVote, error: checkError } = await supabase
        .from('knowledge_votes' as any)
        .select('id, vote_type')
        .eq(idField, id)
        .eq('user_id', currentUser.id)
        .maybeSingle();
      
      if (checkError) {
        throw checkError;
      }

      // If user wants to remove vote (same as current)
      if ((existingVote as any) && (existingVote as any).vote_type === voteValue) {
        // Delete the vote
        const { error } = await supabase
          .from('knowledge_votes' as any)
          .delete()
          .eq('id', (existingVote as any).id);
        
        if (error) {
          throw error;
        }
      } 
      // If user already voted but wants to change vote type
      else if (existingVote as any) {
        // Update the vote
        const { error } = await supabase
          .from('knowledge_votes' as any)
          .update({ vote_type: voteValue })
          .eq('id', (existingVote as any).id);
        
        if (error) {
          throw error;
        }
      } 
      // New vote
      else if (voteType !== 'none') {
        // Create a new vote
        const { error } = await supabase
          .from('knowledge_votes' as any)
          .insert({
            [idField]: id,
            user_id: currentUser.id,
            vote_type: voteValue
          } as any);
        
        if (error) {
          throw error;
        }
      }
      
      // Invalidate queries
      if (type === 'article') {
        queryClient.invalidateQueries({ queryKey: ['knowledgeArticle', id] });
        queryClient.invalidateQueries({ queryKey: ['knowledgeArticles'] });
      }
    } catch (error: any) {
      toast({
        title: "Error voting",
        description: error.message,
        variant: "destructive"
      });
    }
  }, [currentUser, queryClient, toast]);

  return { vote };
};