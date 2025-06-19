
import { useState } from 'react';
import { useArticleMutations } from './knowledge/useArticles';
import { useCommentMutations } from './knowledge/useComments';
import { useVote } from './knowledge/useVote';

export const useKnowledgeBase = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { vote } = useVote();
  const articleMutations = useArticleMutations();
  const commentMutations = useCommentMutations();
  
  return {
    // Mutations
    ...articleMutations,
    ...commentMutations,
    vote,
    
    // State
    isSubmitting: isSubmitting || articleMutations.isSubmitting || commentMutations.isSubmitting
  };
};
