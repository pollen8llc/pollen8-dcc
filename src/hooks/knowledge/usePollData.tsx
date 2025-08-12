import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface PollStats {
  optionCounts: { [key: number]: number };
  totalVotes: number;
  userSelections: number[];
  hasVoted: boolean;
}

interface VotePayload {
  pollId: string;
  selectedOptions: number[];
}

export const usePollData = (pollId: string, optionCount: number) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch poll statistics
  const { data: stats, isLoading, error, refetch } = useQuery({
    queryKey: ['poll-stats', pollId],
    queryFn: async (): Promise<PollStats> => {
      try {
        // Get poll counts via RPC function
        const { data: pollCounts, error: countsError } = await supabase
          .rpc('get_poll_counts', { poll_id: pollId });
        
        if (countsError) {
          console.error('Error fetching poll counts:', countsError);
          // Continue without throwing error - just return empty data
        }

        // Initialize option counts
        const optionCounts: { [key: number]: number } = {};
        for (let i = 0; i < optionCount; i++) {
          optionCounts[i] = 0;
        }
        
        // Fill in actual counts
        if (pollCounts) {
          pollCounts.forEach((count: any) => {
            optionCounts[count.option_index] = count.count || 0;
          });
        }

        const totalVotes = Object.values(optionCounts).reduce((sum, count) => sum + count, 0);

        // Get user's selections if authenticated
        const { data: { user } } = await supabase.auth.getUser();
        let userSelections: number[] = [];
        let hasVoted = false;

        if (user) {
          const { data: userResponses, error: userError } = await supabase
            .from('poll_responses')
            .select('option_index')
            .eq('poll_id', pollId)
            .eq('user_id', user.id);

          if (!userError && userResponses && userResponses.length > 0) {
            userSelections = userResponses.map(r => r.option_index);
            hasVoted = true;
          }
        }

        return {
          optionCounts,
          totalVotes,
          userSelections,
          hasVoted
        };
      } catch (error) {
        console.error('Error in poll data fetch:', error);
        // Return default data instead of throwing
        const optionCounts: { [key: number]: number } = {};
        for (let i = 0; i < optionCount; i++) {
          optionCounts[i] = 0;
        }
        return {
          optionCounts,
          totalVotes: 0,
          userSelections: [],
          hasVoted: false
        };
      }
    },
    refetchInterval: 30000, // Refetch every 30 seconds for live updates
    staleTime: 10000, // Consider data stale after 10 seconds
  });

  // Vote mutation
  const voteMutation = useMutation({
    mutationFn: async ({ pollId, selectedOptions }: VotePayload) => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('Authentication required');
      }

      if (selectedOptions.length === 0) {
        throw new Error('Please select at least one option');
      }

      // Remove existing responses
      await supabase
        .from('poll_responses')
        .delete()
        .eq('poll_id', pollId)
        .eq('user_id', user.id);

      // Insert new responses
      const responses = selectedOptions.map(optionIndex => ({
        poll_id: pollId,
        user_id: user.id,
        option_index: optionIndex
      }));

      const { error } = await supabase
        .from('poll_responses')
        .insert(responses);

      if (error) throw error;

      return { success: true };
    },
    onSuccess: () => {
      // Invalidate and refetch poll data
      queryClient.invalidateQueries({ queryKey: ['poll-stats', pollId] });
      
      toast({
        title: "Vote Recorded!",
        description: "Your vote has been successfully recorded",
      });
    },
    onError: (error: any) => {
      console.error('Error voting:', error);
      toast({
        title: "Vote Failed",
        description: error.message || "Failed to record your vote",
        variant: "destructive"
      });
    },
  });

  return {
    stats: stats || {
      optionCounts: {},
      totalVotes: 0,
      userSelections: [],
      hasVoted: false
    },
    isLoading,
    error,
    vote: (selectedOptions: number[]) => 
      voteMutation.mutate({ pollId, selectedOptions }),
    isVoting: voteMutation.isPending,
    refetch
  };
};