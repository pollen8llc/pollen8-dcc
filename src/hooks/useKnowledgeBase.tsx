import { useState } from 'react';
import { 
  useArticles, 
  useArticle, 
  useCreateArticle, 
  useUpdateArticle, 
  useDeleteArticle 
} from './knowledge/useArticles';
import { useComments } from './knowledge/useComments';
import { useTags } from './knowledge/useTags';

export const useKnowledgeBase = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  console.log("useKnowledgeBase - Initialized");
  
  return {
    // Query hooks - export the hooks themselves for direct use
    useArticles,
    useArticle,
    useTags,
    useComments,
    
    // Mutation hooks - export the actual mutation hooks
    useCreateArticle,
    useUpdateArticle,
    useDeleteArticle,
    
    // Legacy mutations 
    createComment: (...args: any[]) => Promise.resolve(),
    deleteComment: (...args: any[]) => Promise.resolve(), 
    acceptAnswer: (...args: any[]) => Promise.resolve(),
    
    // State
    isSubmitting
  };
};