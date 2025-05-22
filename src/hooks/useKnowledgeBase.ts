
import { useState } from 'react';
import { useArticles, useArticle, useCreateArticle, useUpdateArticle, useDeleteArticle } from './knowledge/useArticles';
import { useComments, useCommentMutations } from './knowledge/useComments';
import { useTags } from './knowledge/useTags';
import { useVote } from './knowledge/useVote';

export const useKnowledgeBase = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { vote } = useVote();
  const createArticleMutation = useCreateArticle();
  const updateArticleMutation = useUpdateArticle();
  const deleteArticleMutation = useDeleteArticle();
  const commentMutations = useCommentMutations();
  
  const createArticle = async (article: any) => {
    try {
      setIsSubmitting(true);
      return await createArticleMutation.mutateAsync(article);
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateArticle = async (article: any) => {
    try {
      setIsSubmitting(true);
      return await updateArticleMutation.mutateAsync(article);
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteArticle = async (id: string) => {
    try {
      setIsSubmitting(true);
      await deleteArticleMutation.mutateAsync(id);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return {
    // Queries
    useArticles,
    useArticle,
    useTags,
    useComments,
    
    // Mutations
    createArticle,
    updateArticle,
    deleteArticle,
    ...commentMutations,
    vote,
    
    // State
    isSubmitting: isSubmitting || commentMutations.isSubmitting
  };
};
