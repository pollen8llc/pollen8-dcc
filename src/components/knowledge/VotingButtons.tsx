
import React from 'react';
import { Button } from '@/components/ui/button';
import { ThumbsUp, ThumbsDown } from 'lucide-react';
import { useVote } from '@/hooks/knowledge/useVote';
import { VoteType } from '@/models/knowledgeTypes';

interface VotingButtonsProps {
  itemType: 'article' | 'comment';
  itemId: string;
  voteCount?: number;
  userVote?: number | null;
  size?: 'sm' | 'default';
  showCount?: boolean;
}

export const VotingButtons: React.FC<VotingButtonsProps> = ({
  itemType,
  itemId,
  voteCount = 0,
  userVote,
  size = 'default',
  showCount = true
}) => {
  const { vote } = useVote();

  const handleVote = (voteType: VoteType) => {
    // If user clicks the same vote type they already voted, remove the vote
    if (voteType === 'upvote' && userVote === 1) {
      vote(itemType, itemId, 'none');
    } else if (voteType === 'downvote' && userVote === -1) {
      vote(itemType, itemId, 'none');
    } else {
      vote(itemType, itemId, voteType);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size={size}
        onClick={() => handleVote('upvote')}
        className={userVote === 1 ? 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900 dark:text-green-200 dark:border-green-800' : ''}
      >
        <ThumbsUp className="h-4 w-4" />
        {showCount && voteCount > 0 && <span className="ml-1">{voteCount}</span>}
      </Button>
      
      <Button
        variant="outline"
        size={size}
        onClick={() => handleVote('downvote')}
        className={userVote === -1 ? 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900 dark:text-red-200 dark:border-red-800' : ''}
      >
        <ThumbsDown className="h-4 w-4" />
      </Button>
    </div>
  );
};
