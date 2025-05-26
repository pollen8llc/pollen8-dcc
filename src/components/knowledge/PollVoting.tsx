
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

interface ResponseCount {
  option_index: number;
  count: number;
}

export const PollVoting: React.FC<PollVotingProps> = ({ pollId, pollData, isOwner = false }) => {
  const [selectedOptions, setSelectedOptions] = useState<number[]>([]);
  const [hasResponded, setHasResponded] = useState(false);
  const [responseCounts, setResponseCounts] = useState<ResponseCount[]>([]);
  const [totalResponses, setTotalResponses] = useState(0);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const loadResponses = async () => {
    try {
      // Get response counts for each option
      const { data: responses, error } = await supabase
        .from('poll_responses')
        .select('option_index')
        .eq('poll_id', pollId);

      if (error) throw error;

      // Count responses per option
      const counts: { [key: number]: number } = {};
      responses?.forEach(response => {
        counts[response.option_index] = (counts[response.option_index] || 0) + 1;
      });

      const responseCountsArray = Object.entries(counts).map(([index, count]) => ({
        option_index: parseInt(index),
        count: count as number
      }));

      setResponseCounts(responseCountsArray);
      setTotalResponses(responses?.length || 0);

      // Check if current user has responded
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: userResponses } = await supabase
          .from('poll_responses')
          .select('option_index')
          .eq('poll_id', pollId)
          .eq('user_id', user.id);

        if (userResponses && userResponses.length > 0) {
          setHasResponded(true);
          setSelectedOptions(userResponses.map(r => r.option_index));
        }
      }
    } catch (error) {
      console.error('Error loading responses:', error);
    }
  };

  useEffect(() => {
    loadResponses();
  }, [pollId]);

  const handleSubmitResponse = async () => {
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

      // Remove existing responses if any
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

      setHasResponded(true);
      await loadResponses();

      toast({
        title: "Success!",
        description: "Your response has been recorded",
      });
    } catch (error: any) {
      console.error('Error submitting response:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to record response",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getResponseCount = (optionIndex: number) => {
    return responseCounts.find(rc => rc.option_index === optionIndex)?.count || 0;
  };

  const getResponsePercentage = (optionIndex: number) => {
    if (totalResponses === 0) return 0;
    return (getResponseCount(optionIndex) / totalResponses) * 100;
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
          {hasResponded || isOwner ? (
            // Show results
            <div className="space-y-3">
              <h4 className="font-medium text-sm text-muted-foreground">Results ({totalResponses} responses)</h4>
              {pollData.options.map((option, index) => {
                const responseCount = getResponseCount(index);
                const percentage = getResponsePercentage(index);
                const isSelected = selectedOptions.includes(index);
                
                return (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className={`text-sm ${isSelected ? 'font-medium' : ''}`}>
                        {option.text} {isSelected && '✓'}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {responseCount} ({percentage.toFixed(1)}%)
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
                onClick={handleSubmitResponse} 
                disabled={loading || selectedOptions.length === 0}
                className="w-full"
              >
                {loading ? 'Submitting...' : 'Submit Response'}
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
