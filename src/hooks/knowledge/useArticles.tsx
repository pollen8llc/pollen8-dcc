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
    like_count: articleData.like_count || 0, // Default value
    is_pinned: articleData.is_pinned || false, // Default value
    is_answered: articleData.is_answered || false,
    tags: articleData.tags || [],
    updated_at: articleData.updated_at || articleData.created_at, // Default to created_at if missing
    // Add other optional fields as needed
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
        .select('*');
      if (error) {
        setError(error);
      } else {
        setArticles(data ? data.map(article => castToKnowledgeArticle(article)) : []);
      }
    } catch (err: any) {
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
      const { data, error } = await supabase
        .from('knowledge_articles')
        .select(`
          *,
          author:user_profiles(id, name, avatar_url, is_admin),
          comments:knowledge_comments(
            id,
            created_at,
            user_id,
            content,
            is_accepted,
            author:user_profiles(id, name, avatar_url),
            vote_count,
            user_vote:knowledge_votes(vote_type)
          ),
          knowledge_votes(vote_type)
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
      
      return castToKnowledgeArticle(data);
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
    queryKey: ['knowledgeArticles', tag],
    queryFn: async () => {
      if (!tag) return [];
      const { data, error } = await supabase
        .from('knowledge_articles')
        .select('*')
        .contains('tags', [tag]);

      if (error) {
        console.error('Error fetching articles:', error);
        throw error;
      }
      return data ? data.map(article => castToKnowledgeArticle(article)) : [];
    },
    enabled: !!tag, // The query will not execute until a tag exists
  });
};

export const useCreateArticle = () => {
  const queryClient = useQueryClient();
  
  return useMutation(
    async (newArticle: Omit<KnowledgeArticle, 'id'>) => {
      const { data, error } = await supabase
        .from('knowledge_articles')
        .insert([newArticle])
        .select('*')
        .single();
      
      if (error) {
        console.error('Error creating article:', error);
        throw error;
      }
      
      return castToKnowledgeArticle(data);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['knowledgeArticles'] });
      },
    }
  );
};

export const useUpdateArticle = () => {
  const queryClient = useQueryClient();
  
  return useMutation(
    async (updatedArticle: KnowledgeArticle) => {
      const { data, error } = await supabase
        .from('knowledge_articles')
        .update(updatedArticle)
        .eq('id', updatedArticle.id)
        .select('*')
        .single();
      
      if (error) {
        console.error('Error updating article:', error);
        throw error;
      }
      
      return castToKnowledgeArticle(data);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['knowledgeArticles'] });
      },
    }
  );
};

export const useDeleteArticle = () => {
  const queryClient = useQueryClient();
  
  return useMutation(
    async (id: string) => {
      const { error } = await supabase
        .from('knowledge_articles')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('Error deleting article:', error);
        throw error;
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['knowledgeArticles'] });
      },
    }
  );
};
