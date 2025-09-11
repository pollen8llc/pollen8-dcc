import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  BarChart3, 
  Users, 
  Vote, 
  Check, 
  TrendingUp,
  ChevronRight,
  Clock,
  CheckCircle2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

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

interface PollStats {
  optionCounts: { [key: number]: number };
  totalVotes: number;
  userSelections: number[];
  hasVoted: boolean;
}

export const ModernPollVoting: React.FC<PollVotingProps> = ({ 
  pollId, 
  pollData, 
  isOwner = false 
}) => {
  const [selectedOptions, setSelectedOptions] = useState<number[]>([]);
  const [stats, setStats] = useState<PollStats>({
    optionCounts: {},
    totalVotes: 0,
    userSelections: [],
    hasVoted: false
  });
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const { toast } = useToast();

  // Streamlined data fetching
  const fetchPollData = async () => {
    try {
      setLoading(true);
      
      // Get poll counts via RPC function
      const { data: pollCounts, error: countsError } = await supabase
        .rpc('get_poll_counts' as any, { poll_id: pollId });
      
      if (countsError) {
        console.error('Error fetching poll counts:', countsError);
        // Continue without showing error to user - just show empty poll
      }

      // Build option counts object
      const optionCounts: { [key: number]: number } = {};
      pollData.options.forEach((_, index) => {
        optionCounts[index] = 0;
      });
      
      if (pollCounts && Array.isArray(pollCounts)) {
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
        const { data: userResponses } = await supabase
          .from('poll_responses' as any)
          .select('option_index')
          .eq('poll_id', pollId)
          .eq('user_id', user.id);

        if (userResponses && userResponses.length > 0) {
          userSelections = userResponses.map((r: any) => r.option_index);
          hasVoted = true;
        }
      }

      setStats({
        optionCounts,
        totalVotes,
        userSelections,
        hasVoted
      });

      setSelectedOptions(userSelections);
      setShowResults(true);

    } catch (error) {
      console.error('Error fetching poll data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPollData();
  }, [pollId]);

  const handleVote = async () => {
    if (selectedOptions.length === 0) {
      toast({
        title: "Selection Required",
        description: "Please select at least one option before voting",
        variant: "destructive"
      });
      return;
    }

    try {
      setLoading(true);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Authentication Required",
          description: "Please log in to vote",
          variant: "destructive"
        });
        return;
      }

      // Remove existing responses
      await supabase
        .from('poll_responses' as any)
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
        .from('poll_responses' as any)
        .insert(responses);

      if (error) throw error;

      // Refresh data
      await fetchPollData();

      toast({
        title: "Vote Recorded!",
        description: "Your vote has been successfully recorded",
      });
    } catch (error: any) {
      console.error('Error voting:', error);
      toast({
        title: "Vote Failed",
        description: error.message || "Failed to record your vote",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOptionSelect = (optionIndex: number, checked: boolean) => {
    if (stats.hasVoted) return; // Prevent voting if already voted

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

  const getPercentage = (optionIndex: number) => {
    if (stats.totalVotes === 0) return 0;
    return (stats.optionCounts[optionIndex] || 0) / stats.totalVotes * 100;
  };

  const PollOption = ({ option, index }: { option: PollOption; index: number }) => {
    const count = stats.optionCounts[index] || 0;
    const percentage = getPercentage(index);
    const isSelected = selectedOptions.includes(index);
    const wasUserChoice = stats.userSelections.includes(index);
    const isTopChoice = stats.totalVotes > 0 && count === Math.max(...Object.values(stats.optionCounts));

    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        className={cn(
          "relative overflow-hidden rounded-lg border transition-all duration-200",
          wasUserChoice 
            ? "border-primary bg-primary/5 shadow-sm" 
            : "border-border hover:border-primary/30",
          !stats.hasVoted && "cursor-pointer hover:shadow-md"
        )}
      >
        {/* Background progress bar */}
        <div 
          className={cn(
            "absolute inset-0 transition-all duration-1000 ease-out",
            wasUserChoice ? "bg-primary/10" : "bg-muted/30"
          )}
          style={{ 
            width: showResults ? `${percentage}%` : '0%',
            transitionDelay: `${index * 100}ms`
          }}
        />
        
        {/* Option content */}
        <div className="relative p-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-3 flex-1">
              {!stats.hasVoted && (
                <div className="flex-shrink-0">
                  {pollData.allowMultipleSelections ? (
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={(checked) => handleOptionSelect(index, checked as boolean)}
                      className="data-[state=checked]:bg-primary"
                    />
                  ) : (
                    <RadioGroup
                      value={selectedOptions[0]?.toString() || ''}
                      onValueChange={(value) => setSelectedOptions([parseInt(value)])}
                    >
                      <RadioGroupItem value={index.toString()} />
                    </RadioGroup>
                  )}
                </div>
              )}
              
              <div className="flex-1">
                <Label 
                  className={cn(
                    "text-sm font-medium cursor-pointer leading-relaxed",
                    wasUserChoice && "text-primary"
                  )}
                >
                  {option.text}
                </Label>
              </div>
            </div>

            {/* Results section - stacked on mobile, inline on desktop */}
            <div className="flex items-center justify-between sm:justify-end gap-3">
              <div className="flex items-center gap-2">
                {wasUserChoice && (
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                )}
                
                {isTopChoice && stats.totalVotes > 1 && (
                  <TrendingUp className="h-4 w-4 text-green-500" />
                )}
              </div>
              
              <div className="text-right">
                <div className="text-sm font-semibold">
                  {percentage.toFixed(1)}%
                </div>
                <div className="text-xs text-muted-foreground">
                  {count} {count === 1 ? 'vote' : 'votes'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  if (loading && !showResults) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-muted rounded w-1/3"></div>
            <div className="space-y-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-16 bg-muted rounded"></div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-lg">Poll Results</h3>
          </div>
          
          <div className="flex items-center gap-4">
            {stats.hasVoted && (
              <div className="flex items-center gap-1 text-sm text-green-600 dark:text-green-400">
                <Check className="h-4 w-4" />
                <span>Voted</span>
              </div>
            )}
            
            <div className="flex items-center gap-1 text-sm text-muted-foreground bg-muted px-3 py-1 rounded-full">
              <Users className="h-4 w-4" />
              <span>{stats.totalVotes} {stats.totalVotes === 1 ? 'response' : 'responses'}</span>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="space-y-3">
          <AnimatePresence>
            {pollData.options.map((option, index) => (
              <PollOption
                key={index}
                option={option}
                index={index}
              />
            ))}
          </AnimatePresence>
        </div>

        {!stats.hasVoted && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-6 pt-4 border-t border-border"
          >
            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
              <p className="text-sm text-muted-foreground">
                {pollData.allowMultipleSelections 
                  ? "Select one or more options and submit your vote"
                  : "Select one option and submit your vote"
                }
              </p>
              
              <Button 
                onClick={handleVote}
                disabled={loading || selectedOptions.length === 0}
                className="w-full sm:w-auto"
                size="lg"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Vote className="h-4 w-4 mr-2" />
                    Submit Vote
                  </>
                )}
              </Button>
            </div>
          </motion.div>
        )}

        {stats.hasVoted && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-6 pt-4 border-t border-border"
          >
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <span>Thank you for participating in this poll!</span>
            </div>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
};