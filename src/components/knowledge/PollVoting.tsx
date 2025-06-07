import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle2, TrendingUp } from 'lucide-react';

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

// Custom hook for animated counting
const useAnimatedCounter = (target: number, duration: number = 1000) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const startTime = Date.now();
    const startCount = count;
    
    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentCount = Math.floor(startCount + (target - startCount) * easeOutQuart);
      
      setCount(currentCount);
      
      if (progress >= 1) {
        clearInterval(timer);
        setCount(target);
      }
    }, 16);

    return () => clearInterval(timer);
  }, [target, duration]);

  return count;
};

export const PollVoting: React.FC<PollVotingProps> = ({ pollId, pollData, isOwner = false }) => {
  const [selectedOptions, setSelectedOptions] = useState<number[]>([]);
  const [hasResponded, setHasResponded] = useState(false);
  const [responseCounts, setResponseCounts] = useState<ResponseCount[]>([]);
  const [totalResponses, setTotalResponses] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
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

  // Trigger results animation after data loads
  useEffect(() => {
    if ((hasResponded || isOwner) && responseCounts.length > 0) {
      setTimeout(() => setShowResults(true), 300);
    }
  }, [hasResponded, isOwner, responseCounts]);

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

  // Animated Result Option Component
  const AnimatedResultOption = ({ option, index, delay }: { option: PollOption, index: number, delay: number }) => {
    const responseCount = getResponseCount(index);
    const percentage = getResponsePercentage(index);
    const isSelected = selectedOptions.includes(index);
    const animatedCount = useAnimatedCounter(responseCount, 1200);
    const animatedPercentage = useAnimatedCounter(percentage, 1500);
    
    return (
      <div 
        className={`space-y-3 p-4 rounded-lg border transition-all duration-500 hover:shadow-md ${
          isSelected 
            ? 'bg-gradient-to-r from-primary/10 to-primary/5 border-primary/30 shadow-sm' 
            : 'bg-background hover:bg-muted/30'
        }`}
        style={{ 
          animationDelay: `${delay}ms`,
          animation: showResults ? 'fade-in 0.6s ease-out forwards' : 'none',
          opacity: showResults ? 1 : 0,
          transform: showResults ? 'translateY(0)' : 'translateY(20px)'
        }}
      >
        <div className="flex justify-between items-start">
          <div className="flex items-start gap-3 flex-1">
            {isSelected && (
              <CheckCircle2 
                className="h-5 w-5 text-primary mt-0.5 animate-scale-in" 
                style={{ animationDelay: `${delay + 200}ms` }}
              />
            )}
            <span className={`text-sm leading-relaxed ${isSelected ? 'font-medium text-primary' : 'text-foreground'}`}>
              {option.text}
            </span>
          </div>
          
          <div className="flex items-center gap-3 text-right">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3" />
              <span className="font-mono font-medium">
                {showResults ? animatedCount : 0}
              </span>
            </div>
            <div className={`text-sm font-semibold ${isSelected ? 'text-primary' : 'text-muted-foreground'}`}>
              {showResults ? `${animatedPercentage.toFixed(1)}%` : '0.0%'}
            </div>
          </div>
        </div>
        
        <div className="relative">
          <Progress 
            value={showResults ? percentage : 0} 
            className="h-3 transition-all duration-1000 ease-out" 
            style={{ transitionDelay: `${delay + 100}ms` }}
            indicatorClassName={isSelected ? 'bg-primary' : 'bg-muted-foreground/60'}
          />
          {percentage > 0 && (
            <div 
              className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"
              style={{ 
                width: `${percentage}%`,
                animationDelay: `${delay + 300}ms`,
                animationDuration: '2s'
              }}
            />
          )}
        </div>
      </div>
    );
  };

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        <div className="space-y-4">
          {hasResponded || isOwner ? (
            // Show animated results
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-6">
                <h4 className="font-semibold text-lg flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Poll Results
                </h4>
                <div className="text-sm text-muted-foreground bg-muted px-3 py-1 rounded-full">
                  {totalResponses} {totalResponses === 1 ? 'response' : 'responses'}
                </div>
              </div>
              
              <div className="space-y-3">
                {pollData.options.map((option, index) => (
                  <AnimatedResultOption
                    key={index}
                    option={option}
                    index={index}
                    delay={index * 150}
                  />
                ))}
              </div>
            </div>
          ) : (
            // Show voting interface
            <div className="space-y-6">
              <h4 className="font-medium text-base text-muted-foreground">
                {pollData.allowMultipleSelections ? 'Select one or more options:' : 'Select one option:'}
              </h4>
              
              {pollData.allowMultipleSelections ? (
                <div className="space-y-3">
                  {pollData.options.map((option, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                      <Checkbox
                        id={`option-${index}`}
                        checked={selectedOptions.includes(index)}
                        onCheckedChange={(checked) => handleOptionChange(index, checked as boolean)}
                      />
                      <Label htmlFor={`option-${index}`} className="text-sm flex-1 cursor-pointer">
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
                    <div key={index} className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                      <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                      <Label htmlFor={`option-${index}`} className="text-sm flex-1 cursor-pointer">
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
