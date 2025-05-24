import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface PollOption {
  text: string;
}

interface PollData {
  options: PollOption[];
  allowMultipleSelections: boolean;
  duration: string;
}

interface PollVotingProps {
  pollId: string;
  pollData: PollData;
  isOwner?: boolean;
}

interface VoteCount {
  option_index: number;
  count: number;
}

export const PollVoting: React.FC<PollVotingProps> = ({ pollId, pollData, isOwner = false }) => {
  if (!pollData || !Array.isArray(pollData.options)) {
    return <div className="text-destructive p-4">Poll data is missing or invalid.</div>;
  }

  const [selectedOptions, setSelectedOptions] = useState<number[]>([]);
  const [hasVoted, setHasVoted] = useState(false);
  const [voteCounts, setVoteCounts] = useState<VoteCount[]>([]);
  const [totalVotes, setTotalVotes] = useState(0);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const loadVotes = async () => {
    try {
      // Get vote counts for each option
      const { data: votes, error } = await supabase
        .from('poll_votes')
        .select('option_index')
        .eq('poll_id', pollId);

      if (error) throw error;

      // Count votes per option
      const counts: { [key: number]: number } = {};
      votes?.forEach(vote => {
        counts[vote.option_index] = (counts[vote.option_index] || 0) + 1;
      });

      const voteCountsArray = Object.entries(counts).map(([index, count]) => ({
        option_index: parseInt(index),
        count: count as number
      }));

      setVoteCounts(voteCountsArray);
      setTotalVotes(votes?.length || 0);

      // Check if current user has voted
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: userVotes } = await supabase
          .from('poll_votes')
          .select('option_index')
          .eq('poll_id', pollId)
          .eq('user_id', user.id);

        if (userVotes && userVotes.length > 0) {
          setHasVoted(true);
          setSelectedOptions(userVotes.map(v => v.option_index));
        }
      }
    } catch (error) {
      console.error('Error loading votes:', error);
    }
  };

  useEffect(() => {
    loadVotes();
  }, [pollId]);

  const handleVote = async () => {
    if (selectedOptions.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one option",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Remove existing votes if any
      await supabase
        .from('poll_votes')
        .delete()
        .eq('poll_id', pollId)
        .eq('user_id', user.id);

      // Insert new votes
      const votes = selectedOptions.map(optionIndex => ({
        poll_id: pollId,
        user_id: user.id,
        option_index: optionIndex
      }));

      const { error } = await supabase
        .from('poll_votes')
        .insert(votes);

      if (error) throw error;

      setHasVoted(true);
      await loadVotes();

      toast({
        title: "Success!",
        description: "Your vote has been recorded",
      });
    } catch (error: any) {
      console.error('Error voting:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to record vote",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getVoteCount = (optionIndex: number) => {
    return voteCounts.find(vc => vc.option_index === optionIndex)?.count || 0;
  };

  const getVotePercentage = (optionIndex: number) => {
    if (totalVotes === 0) return 0;
    return (getVoteCount(optionIndex) / totalVotes) * 100;
  };

  const handleOptionChange = (optionIndex: number, checked: boolean) => {
    if (pollData.allowMultipleSelections) {
      if (checked) {
        setSelectedOptions([...selectedOptions, optionIndex]);
      } else {
        setSelectedOptions(selectedOptions.filter(i => i !== optionIndex));
      }
    } else {
      setSelectedOptions(checked ? [optionIndex] : []);
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-4">
          {hasVoted || isOwner ? (
            // Show results
            <div className="space-y-3">
              <h4 className="font-medium text-sm text-muted-foreground">Results ({totalVotes} votes)</h4>
              {pollData.options.map((option, index) => {
                const voteCount = getVoteCount(index);
                const percentage = getVotePercentage(index);
                const isSelected = selectedOptions.includes(index);
                
                return (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className={`text-sm ${isSelected ? 'font-medium' : ''}`}>
                        {option.text} {isSelected && '✓'}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {voteCount} ({percentage.toFixed(1)}%)
                      </span>
                    </div>
                    <Progress value={percentage} className="h-2" />
                  </div>
                );
              })}
            </div>
          ) : (
            // Show voting interface
            <div className="space-y-4">
              <h4 className="font-medium text-sm text-muted-foreground">
                {pollData.allowMultipleSelections ? 'Select one or more options:' : 'Select one option:'}
              </h4>
              
              {pollData.allowMultipleSelections ? (
                <div className="space-y-3">
                  {pollData.options.map((option, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Checkbox
                        id={`option-${index}`}
                        checked={selectedOptions.includes(index)}
                        onCheckedChange={(checked) => handleOptionChange(index, checked as boolean)}
                      />
                      <Label htmlFor={`option-${index}`} className="text-sm flex-1">
                        {option.text}
                      </Label>
                    </div>
                  ))}
                </div>
              ) : (
                <RadioGroup
                  value={selectedOptions[0]?.toString() || ''}
                  onValueChange={(value) => setSelectedOptions([parseInt(value)])}
                >
                  {pollData.options.map((option, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                      <Label htmlFor={`option-${index}`} className="text-sm flex-1">
                        {option.text}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              )}
              
              <Button 
                onClick={handleVote} 
                disabled={loading || selectedOptions.length === 0}
                className="w-full"
              >
                {loading ? 'Voting...' : 'Vote'}
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
