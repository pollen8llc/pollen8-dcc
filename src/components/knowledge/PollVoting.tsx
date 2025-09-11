import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Circle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ResponseCount {
  option_index: number;
  count: number;
}

interface PollData {
  id: string;
  question: string;
  options: string[];
  totalVotes?: number;
  userVote?: number;
}

interface PollVotingProps {
  pollData: PollData;
  pollId: string;
  className?: string;
}

const PollVoting: React.FC<PollVotingProps> = ({ 
  pollData, 
  pollId, 
  className 
}) => {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [responseCounts, setResponseCounts] = useState<ResponseCount[]>([]);
  const [totalResponses, setTotalResponses] = useState(0);
  const [isVoting, setIsVoting] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const { toast } = useToast();

  // Initialize empty poll data
  useEffect(() => {
    setResponseCounts([]);
    setTotalResponses(0);
    setSelectedOption(null);
    setHasLoaded(true);
  }, [pollId]);

  const handleVote = async (optionIndex: number) => {
    // Voting functionality not yet implemented
    toast({
      title: "Feature Coming Soon",
      description: "Poll voting will be available after database setup is complete.",
      variant: "default",
    });
  };

  const getVoteCount = (optionIndex: number): number => {
    const response = responseCounts.find(r => r.option_index === optionIndex);
    return response ? response.count : 0;
  };

  const getPercentage = (optionIndex: number): number => {
    if (totalResponses === 0) return 0;
    const count = getVoteCount(optionIndex);
    return Math.round((count / totalResponses) * 100);
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">{pollData.question}</CardTitle>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-xs">
            {totalResponses} {totalResponses === 1 ? 'vote' : 'votes'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {pollData.options.map((option, index) => {
          const voteCount = getVoteCount(index);
          const percentage = getPercentage(index);
          const isSelected = selectedOption === index;

          return (
            <div key={index} className="space-y-2">
              <Button
                variant={isSelected ? "default" : "outline"}
                className="w-full justify-start text-left h-auto p-4 relative overflow-hidden"
                onClick={() => handleVote(index)}
                disabled={isVoting}
              >
                <div className="flex items-center gap-3 w-full relative z-10">
                  {isSelected ? (
                    <CheckCircle2 className="h-5 w-5 text-primary-foreground" />
                  ) : (
                    <Circle className="h-5 w-5" />
                  )}
                  
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{option}</div>
                  </div>
                  
                  <div className="text-sm font-medium">
                    {voteCount} ({percentage}%)
                  </div>
                </div>
                
                {/* Background progress bar */}
                {totalResponses > 0 && (
                  <div 
                    className="absolute left-0 top-0 h-full bg-muted/30 transition-all duration-300 ease-out"
                    style={{ width: `${percentage}%` }}
                  />
                )}
              </Button>
            </div>
          );
        })}
        
        {!hasLoaded && (
          <div className="text-center py-4">
            <div className="animate-pulse text-muted-foreground">Loading poll data...</div>
          </div>
        )}
        
        {hasLoaded && totalResponses === 0 && (
          <div className="text-center py-4 text-muted-foreground">
            <Circle className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Be the first to vote!</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PollVoting;