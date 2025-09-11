import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Circle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PollData {
  id: string;
  question: string;
  options: string[];
  totalVotes?: number;
  userVote?: number;
}

interface ModernPollVotingProps {
  pollData: PollData;
  pollId: string;
  className?: string;
}

const ModernPollVoting: React.FC<ModernPollVotingProps> = ({ 
  pollData, 
  pollId, 
  className 
}) => {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [voteCounts, setVoteCounts] = useState<{ [key: number]: number }>({});
  const [totalVotes, setTotalVotes] = useState(0);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Initialize empty poll data
  useEffect(() => {
    const counts: { [key: number]: number } = {};
    pollData.options.forEach((_, index) => {
      counts[index] = 0;
    });
    setVoteCounts(counts);
    setTotalVotes(0);
    setSelectedOption(null);
  }, [pollData.options]);

  const handleVote = async (optionIndex: number) => {
    // Voting functionality not yet implemented - polls feature coming soon
    toast({
      title: "Feature Coming Soon",
      description: "Poll voting will be available after the database setup is complete.",
      variant: "default"
    });
  };

  const getPercentage = (optionIndex: number) => {
    if (totalVotes === 0) return 0;
    return Math.round((voteCounts[optionIndex] / totalVotes) * 100);
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-lg">{pollData.question}</CardTitle>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Badge variant="outline">{totalVotes} votes</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {pollData.options.map((option, index) => {
          const percentage = getPercentage(index);
          const isSelected = selectedOption === index;
          const voteCount = voteCounts[index] || 0;

          return (
            <div key={index} className="space-y-2">
              <Button
                variant={isSelected ? "default" : "outline"}
                className="w-full justify-start text-left h-auto p-4"
                onClick={() => handleVote(index)}
                disabled={loading}
              >
                <div className="flex items-center gap-3 w-full">
                  {isSelected ? (
                    <CheckCircle className="h-5 w-5 text-primary" />
                  ) : (
                    <Circle className="h-5 w-5" />
                  )}
                  <div className="flex-1">
                    <div className="font-medium">{option}</div>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {voteCount} votes ({percentage}%)
                  </div>
                </div>
              </Button>
              
              {totalVotes > 0 && (
                <div className="px-4">
                  <Progress value={percentage} className="h-2" />
                </div>
              )}
            </div>
          );
        })}
        
        {totalVotes === 0 && (
          <p className="text-center text-muted-foreground text-sm mt-4">
            Be the first to vote on this poll!
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default ModernPollVoting;