
import React from 'react';
import { ThumbsUp, ThumbsDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useKnowledgeBase } from '@/hooks/useKnowledgeBase';
import { cn } from '@/lib/utils';

interface VotingButtonsProps {
  itemType: 'article' | 'comment';
  itemId: string;
  voteCount: number;
  userVote?: number | null;
  size?: 'sm' | 'default' | 'lg';
  showCount?: boolean;
  orientation?: 'vertical' | 'horizontal';
  className?: string;
}

export const VotingButtons: React.FC<VotingButtonsProps> = ({
  itemType,
  itemId,
  voteCount,
  userVote,
  size = 'default',
  showCount = true,
  orientation = 'horizontal',
  className
}) => {
  const { vote } = useKnowledgeBase();

  const handleVote = (voteType: 'upvote' | 'downvote') => {
    vote(itemType, itemId, voteType);
  };

  const buttonSizeClasses = {
    sm: 'h-7 w-7',
    default: 'h-8 w-8',
    lg: 'h-10 w-10'
  };

  const iconSizeClasses = {
    sm: 'h-3 w-3',
    default: 'h-4 w-4',
    lg: 'h-5 w-5'
  };

  const isVertical = orientation === 'vertical';
  
  return (
    <div className={cn(
      'flex items-center gap-1',
      isVertical ? 'flex-col' : 'flex-row',
      className
    )}>
      <Button
        variant="ghost"
        size="sm"
        className={cn(
          buttonSizeClasses[size],
          'p-0 hover:bg-green-100 dark:hover:bg-green-900/20',
          userVote === 1 && 'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400'
        )}
        onClick={() => handleVote('upvote')}
      >
        <ThumbsUp className={iconSizeClasses[size]} />
        <span className="sr-only">Upvote</span>
      </Button>
      
      {showCount && (
        <span className={cn(
          'text-sm font-medium min-w-[2rem] text-center',
          isVertical ? 'py-1' : 'px-2',
          userVote === 1 ? 'text-green-600 dark:text-green-400' : 
          userVote === -1 ? 'text-red-600 dark:text-red-400' : 
          'text-muted-foreground'
        )}>
          {voteCount || 0}
        </span>
      )}
      
      <Button
        variant="ghost"
        size="sm"
        className={cn(
          buttonSizeClasses[size],
          'p-0 hover:bg-red-100 dark:hover:bg-red-900/20',
          userVote === -1 && 'bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400'
        )}
        onClick={() => handleVote('downvote')}
      >
        <ThumbsDown className={iconSizeClasses[size]} />
        <span className="sr-only">Downvote</span>
      </Button>
    </div>
  );
};
