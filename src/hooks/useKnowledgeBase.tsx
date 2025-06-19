
import { useState } from 'react';
import { useArticles, useArticle, useArticleMutations } from './knowledge/useArticles';
import { useComments, useCommentMutations } from './knowledge/useComments';
import { useTags } from './knowledge/useTags';
import { useVote } from './knowledge/useVote';

export const useKnowledgeBase = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { vote } = useVote();
  const articleMutations = useArticleMutations();
  const commentMutations = useCommentMutations();
  
  console.log("useKnowledgeBase - Initialized");
  
  return {
    // Queries - re-export the hooks themselves
    useArticles,
    useArticle,
    useTags,
    useComments,
    
    // Mutations
    ...articleMutations,
    ...commentMutations,
    vote,
    
    // State
    isSubmitting: isSubmitting || articleMutations.isSubmitting || commentMutations.isSubmitting
  };
};
