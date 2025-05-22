import { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { KnowledgeArticle, ContentType, KnowledgeQueryOptions } from '@/models/knowledgeTypes';

// Function to cast generic Supabase data to KnowledgeArticle type
const castToKnowledgeArticle = (articleData: any): KnowledgeArticle => {
  return {
    id: articleData.id,
    created_at: articleData.created_at,
    title: articleData.title,
    content: articleData.content,
    content_type: articleData.content_type as ContentType,
    user_id: articleData.user_id,
    view_count: articleData.view_count || 0,
    like_count: articleData.like_count || 0, 
    is_pinned: articleData.is_pinned || false,
    is_answered: articleData.is_answered || false,
    tags: articleData.tags || [],
    updated_at: articleData.updated_at || articleData.created_at,
    vote_count: articleData.vote_count || 0,
    user_vote: articleData.user_vote || null,
    comment_count: articleData.comment_count || 0,
    author: articleData.author || undefined,
    options: articleData.options || [],
    subtitle: articleData.subtitle || '',
    source: articleData.source || '',
    is_featured: articleData.is_featured || false,
  };
};

export const useArticles = () => {
  const [articles, setArticles] = useState<KnowledgeArticle[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Fetch all articles
  const fetchArticles = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('knowledge_articles')
        .select(`
          *,
          author:user_profiles(id, name, avatar_url, is_admin)
        `);
      if (error) {
        console.error('Error fetching articles:', error);
        setError(error);
      } else {
        setArticles(data ? data.map(article => castToKnowledgeArticle(article)) : []);
      }
    } catch (err: any) {
      console.error('Error in useArticles hook:', err);
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  return {
    articles,
    isLoading,
    error,
    refetch: fetchArticles,
  };
};

export const useArticle = (id: string | undefined) => {
  return useQuery({
    queryKey: ['knowledgeArticle', id],
    queryFn: async () => {
      if (!id) return null;
      try {
        const { data, error } = await supabase
          .from('knowledge_articles')
          .select(`
            *,
            author:profiles(id, first_name, last_name, avatar_url)
          `)
          .eq('id', id)
          .single();

        if (error) {
          console.error('Error fetching article:', error);
          throw error;
        }
        
        if (!data) {
          return null;
        }
        
        // Format author name from first_name and last_name
        if (data.author) {
          data.author = {
            ...data.author,
            name: `${data.author.first_name || ''} ${data.author.last_name || ''}`.trim()
          };
        }
        
        // Increment view count via separate call
        if (id) {
          try {
            await supabase.rpc('increment_view_count', { article_id: id });
          } catch (viewCountError) {
            console.error('Error incrementing view count:', viewCountError);
          }
        }
        
        return castToKnowledgeArticle(data);
      } catch (err) {
        console.error('Error in useArticle hook:', err);
        throw err;
      }
    },
    enabled: !!id, // The query will not execute until an id exists
  });
};

export const useArticlesByType = (type: ContentType | undefined) => {
  return useQuery({
    queryKey: ['knowledgeArticles', type],
    queryFn: async () => {
      if (!type) return [];
      const { data, error } = await supabase
        .from('knowledge_articles')
        .select('*')
        .eq('content_type', type);

      if (error) {
        console.error('Error fetching articles:', error);
        throw error;
      }
      
      return data ? data.map(article => castToKnowledgeArticle(article)) : [];
    },
    enabled: !!type, // The query will not execute until a type exists
  });
};

export const useSearchArticles = (options: KnowledgeQueryOptions) => {
  return useQuery({
    queryKey: ['knowledgeArticles', options],
    queryFn: async () => {
      let query = supabase
        .from('knowledge_articles')
        .select(`
          *,
          author:user_profiles(id, name, avatar_url, is_admin),
          comments:knowledge_comments(count)
        `);
      
      if (options.searchQuery) {
        query = query.ilike('title', `%${options.searchQuery}%`);
      }
      
      if (options.type) {
        query = query.eq('content_type', options.type);
      }
      
      if (options.tag) {
        query = query.contains('tags', [options.tag]);
      }

      if (options.userId) {
        query = query.eq('user_id', options.userId);
      }
      
      if (options.limit) {
        query = query.limit(options.limit);
      }
      
      // Add sorting
      if (options.sort === 'popular') {
        query = query.order('view_count', { ascending: false });
      } else {
        query = query.order('created_at', { ascending: false });
      }
      
      const { data, error } = await query;
      
      if (error) {
        console.error('Error searching articles:', error);
        throw error;
      }
      
      return data.map(article => castToKnowledgeArticle(article));
    },
  });
};

export const useTagArticles = (tag: string | undefined) => {
  return useQuery({
    queryKey: ['knowledgeArticles', 'tag', tag],
    queryFn: async () => {
      if (!tag) return [];
      try {
        const { data, error } = await supabase
          .from('knowledge_articles')
          .select(`
            *,
            author:profiles(id, first_name, last_name, avatar_url)
          `)
          .contains('tags', [tag]);

        if (error) {
          console.error('Error fetching tag articles:', error);
          throw error;
        }
        
        // Format authors
        const formattedData = data?.map(article => {
          if (article.author) {
            article.author = {
              ...article.author,
              name: `${article.author.first_name || ''} ${article.author.last_name || ''}`.trim()
            };
          }
          return castToKnowledgeArticle(article);
        }) || [];
        
        return formattedData;
      } catch (err) {
        console.error('Error in useTagArticles hook:', err);
        throw err;
      }
    },
    enabled: !!tag, // The query will not execute until a tag exists
  });
};

// Create Article Mutation
export const useCreateArticle = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (newArticle: Omit<KnowledgeArticle, 'id'>) => {
      // Extract only the fields that are needed for creating an article
      const { title, content, tags, content_type } = newArticle;
      
      const { data, error } = await supabase
        .from('knowledge_articles')
        .insert([{ 
          title,
          content,
          tags,
          content_type: content_type || ContentType.ARTICLE,
          user_id: (await supabase.auth.getUser()).data.user?.id
        }])
        .select('*')
        .single();
      
      if (error) {
        console.error('Error creating article:', error);
        throw error;
      }
      
      return castToKnowledgeArticle(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['knowledgeArticles'] });
    },
  });
};

// Update Article Mutation
export const useUpdateArticle = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (updatedArticle: KnowledgeArticle) => {
      // Extract only the fields that should be updated
      const { id, title, content, tags } = updatedArticle;
      
      const { data, error } = await supabase
        .from('knowledge_articles')
        .update({
          title,
          content,
          tags,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select('*')
        .single();
      
      if (error) {
        console.error('Error updating article:', error);
        throw error;
      }
      
      return castToKnowledgeArticle(data);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['knowledgeArticles'] });
      queryClient.invalidateQueries({ queryKey: ['knowledgeArticle', data.id] });
    },
  });
};

// Delete Article Mutation
export const useDeleteArticle = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('knowledge_articles')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('Error deleting article:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['knowledgeArticles'] });
    },
  });
};

export const useArticleMutations = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const createArticleMutation = useCreateArticle();
  const updateArticleMutation = useUpdateArticle();
  const deleteArticleMutation = useDeleteArticle();

  const createArticle = async (article: Omit<KnowledgeArticle, 'id'>) => {
    try {
      setIsSubmitting(true);
      return await createArticleMutation.mutateAsync(article);
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateArticle = async (article: KnowledgeArticle) => {
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
      return await deleteArticleMutation.mutateAsync(id);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    createArticle,
    updateArticle,
    deleteArticle,
    isSubmitting
  };
};
