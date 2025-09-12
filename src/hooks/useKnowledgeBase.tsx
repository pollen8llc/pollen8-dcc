import { useState } from 'react';
import { useArticles, useArticle } from './knowledge/useArticles';
import { useComments } from './knowledge/useComments';
import { useTags } from './knowledge/useTags';
import { useVote } from './knowledge/useVote';

export const useKnowledgeBase = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { vote } = useVote();
  
  console.log("useKnowledgeBase - Initialized");
  
  return {
    // Query hooks - export the hooks themselves for direct use
    useArticles,
    useArticle,
    useTags,
    useComments,
    
    // Mutations - placeholder implementations
    vote,
    createComment: (...args: any[]) => Promise.resolve(),
    deleteComment: (...args: any[]) => Promise.resolve(), 
    acceptAnswer: (...args: any[]) => Promise.resolve(),
    createArticle: (...args: any[]) => Promise.resolve(),
    updateArticle: (...args: any[]) => Promise.resolve(),
    deleteArticle: (...args: any[]) => Promise.resolve(),
    
    // State
    isSubmitting
  };
};