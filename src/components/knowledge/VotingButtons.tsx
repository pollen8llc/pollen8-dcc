
import React, { useState, useEffect } from 'react';
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
  
  // Local state for immediate UI updates
  const [localVoteCount, setLocalVoteCount] = useState(voteCount);
  const [localUserVote, setLocalUserVote] = useState(userVote);

  // Sync with props when they change
  useEffect(() => {
    setLocalVoteCount(voteCount);
    setLocalUserVote(userVote);
  }, [voteCount, userVote]);

  const handleVote = async (voteType: VoteType) => {
    const previousVoteCount = localVoteCount;
    const previousUserVote = localUserVote;

    // Calculate new values for immediate UI update
    let newVoteCount = localVoteCount;
    let newUserVote: number | null = null;

    if (voteType === 'upvote') {
      if (localUserVote === 1) {
        // Remove upvote
        newVoteCount = localVoteCount - 1;
        newUserVote = null;
      } else if (localUserVote === -1) {
        // Change from downvote to upvote
        newVoteCount = localVoteCount + 2;
        newUserVote = 1;
      } else {
        // Add upvote
        newVoteCount = localVoteCount + 1;
        newUserVote = 1;
      }
    } else if (voteType === 'downvote') {
      if (localUserVote === -1) {
        // Remove downvote
        newVoteCount = localVoteCount + 1;
        newUserVote = null;
      } else if (localUserVote === 1) {
        // Change from upvote to downvote
        newVoteCount = localVoteCount - 2;
        newUserVote = -1;
      } else {
        // Add downvote
        newVoteCount = localVoteCount - 1;
        newUserVote = -1;
      }
    }

    // Update UI immediately
    setLocalVoteCount(newVoteCount);
    setLocalUserVote(newUserVote);

    try {
      // Send to database
      if (voteType === 'upvote' && localUserVote === 1) {
        await vote(itemType, itemId, 'none');
      } else if (voteType === 'downvote' && localUserVote === -1) {
        await vote(itemType, itemId, 'none');
      } else {
        await vote(itemType, itemId, voteType);
      }
    } catch (error) {
      // Revert on error
      setLocalVoteCount(previousVoteCount);
      setLocalUserVote(previousUserVote);
      console.error('Failed to vote:', error);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size={size}
        onClick={() => handleVote('upvote')}
        className={localUserVote === 1 ? 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900 dark:text-green-200 dark:border-green-800' : ''}
      >
        <ThumbsUp className="h-3 w-3 sm:h-4 sm:w-4" />
        {showCount && localVoteCount > 0 && <span className="ml-1 text-xs sm:text-sm">{localVoteCount}</span>}
      </Button>
      
      <Button
        variant="outline"
        size={size}
        onClick={() => handleVote('downvote')}
        className={localUserVote === -1 ? 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900 dark:text-red-200 dark:border-red-800' : ''}
      >
        <ThumbsDown className="h-3 w-3 sm:h-4 sm:w-4" />
      </Button>
    </div>
  );
};
