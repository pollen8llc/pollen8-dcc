
import { useState } from 'react';
import { useArticles, useArticle, useArticleMutations, useTagArticles } from './knowledge/useArticles';
import { useComments, useCommentMutations } from './knowledge/useComments';
import { useTags } from './knowledge/useTags';
import { useVote } from './knowledge/useVote';

export const useKnowledgeBase = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { vote } = useVote();
  const articleMutations = useArticleMutations();
  const commentMutations = useCommentMutations();
  
  return {
    // Queries
    useArticles,
    useArticle,
    useTagArticles,
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
