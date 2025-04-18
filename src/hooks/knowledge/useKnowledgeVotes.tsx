
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useKnowledgeVotes = (articleId?: string, commentId?: string) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const voteOnContent = useMutation({
    mutationFn: async ({ voteType }: { voteType: 1 | -1 }) => {
      const { data, error } = await supabase
        .from('knowledge_votes')
        .upsert({
          article_id: articleId,
          comment_id: commentId,
          vote_type: voteType,
        })
        .select();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      if (articleId) {
        queryClient.invalidateQueries({ queryKey: ['knowledge-article', articleId] });
      }
      if (commentId) {
        queryClient.invalidateQueries({ queryKey: ['knowledge-comments', commentId] });
      }
    },
    onError: (error) => {
      console.error('Error voting:', error);
      toast({
        title: "Error",
        description: "Failed to record vote. Please try again.",
        variant: "destructive",
      });
    },
  });

  return {
    voteOnContent,
  };
};
