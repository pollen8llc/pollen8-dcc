import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { KnowledgeArticle, ContentType } from '@/models/knowledgeTypes';
import { useToast } from '@/hooks/use-toast';

export const useArticles = (options?: { searchQuery?: string; tag?: string; type?: string; sort?: string; limit?: number }) => {
  return useQuery({
    queryKey: ['articles', options],
    queryFn: async () => {
      let query = supabase
        .from('knowledge_articles')
        .select(`
          *,
          author:profiles!knowledge_articles_user_id_fkey(id, first_name, last_name, avatar_url)
        `);

      if (options?.searchQuery) {
        query = query.or(`title.ilike.%${options.searchQuery}%,content.ilike.%${options.searchQuery}%`);
      }

      if (options?.tag) {
        query = query.contains('tags', [options.tag]);
      }

      if (options?.type && options.type !== 'all') {
        query = query.eq('content_type', options.type.toUpperCase());
      }

      // Add archived filter
      query = query.is('archived_at', null);

      if (options?.sort === 'newest') {
        query = query.order('created_at', { ascending: false });
      } else if (options?.sort === 'oldest') {
        query = query.order('created_at', { ascending: true });
      } else if (options?.sort === 'most_voted') {
        query = query.order('vote_count', { ascending: false });
      } else {
        query = query.order('created_at', { ascending: false });
      }

      if (options?.limit) {
        query = query.limit(options.limit);
      }

      const { data, error } = await query;

      if (error) throw error;
      
      // Transform the data to match our interface
      const transformedData = data?.map(item => ({
        ...item,
        author: item.author && typeof item.author === 'object' && 'id' in item.author ? {
          id: item.author.id,
          name: `${item.author.first_name || ''} ${item.author.last_name || ''}`.trim() || 'Unknown User',
          first_name: item.author.first_name || undefined,
          last_name: item.author.last_name || undefined,
          avatar_url: item.author.avatar_url || undefined
        } : {
          id: item.user_id,
          name: 'Unknown User'
        }
      })) as KnowledgeArticle[];

      return transformedData;
    },
  });
};

export const useArticle = (id: string) => {
  return useQuery({
    queryKey: ['article', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('knowledge_articles')
        .select(`
          *,
          author:profiles!knowledge_articles_user_id_fkey(id, first_name, last_name, avatar_url)
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      
      // Transform the data to match our interface
      const transformedData = {
        ...data,
        author: data.author && typeof data.author === 'object' && 'id' in data.author ? {
          id: data.author.id,
          name: `${data.author.first_name || ''} ${data.author.last_name || ''}`.trim() || 'Unknown User',
          first_name: data.author.first_name || undefined,
          last_name: data.author.last_name || undefined,
          avatar_url: data.author.avatar_url || undefined
        } : {
          id: data.user_id,
          name: 'Unknown User'
        }
      } as KnowledgeArticle;

      return transformedData;
    },
  });
};

export const useArticleMutations = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const createArticle = useMutation({
    mutationFn: async (data: any) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Map the form data based on content type
      let mappedData: any = {
        user_id: user.id,
        content_type: data.content_type || ContentType.ARTICLE,
        tags: data.tags || [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      // Handle different content types
      switch (data.content_type) {
        case ContentType.QUOTE:
          mappedData = {
            ...mappedData,
            title: data.quote || data.title, // Map quote to title
            content: data.context || data.content || '', // Map context to content
            source: data.author || data.source, // Map author to source
          };
          break;

        case ContentType.POLL:
          mappedData = {
            ...mappedData,
            title: data.question || data.title, // Map question to title
            content: data.question || data.content || '', // Store question in content too
            options: {
              options: data.options || [],
              allowMultipleSelections: data.allowMultipleSelections || false,
              duration: data.duration || '7'
            },
          };
          break;

        case ContentType.QUESTION:
          mappedData = {
            ...mappedData,
            title: data.question || data.title, // Map question to title for questions
            content: data.content || '',
          };
          break;

        case ContentType.ARTICLE:
        default:
          mappedData = {
            ...mappedData,
            title: data.title,
            content: data.content || '',
            subtitle: data.subtitle,
          };
          break;
      }

      console.log('Creating article with mapped data:', mappedData);

      const { data: result, error } = await supabase
        .from('knowledge_articles')
        .insert([mappedData])
        .select()
        .single();

      if (error) {
        console.error('Error creating article:', error);
        throw error;
      }

      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['articles'] });
      toast({
        title: "Success!",
        description: "Your post has been created successfully.",
      });
    },
    onError: (error: any) => {
      console.error('Error in createArticle mutation:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create post. Please try again.",
        variant: "destructive",
      });
    },
  });

  const updateArticle = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const { data: result, error } = await supabase
        .from('knowledge_articles')
        .update({
          ...data,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['articles'] });
      toast({
        title: "Success!",
        description: "Article updated successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update article.",
        variant: "destructive",
      });
    },
  });

  const deleteArticle = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('knowledge_articles')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['articles'] });
      toast({
        title: "Success!",
        description: "Article deleted successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete article.",
        variant: "destructive",
      });
    },
  });

  const archiveArticle = useMutation({
    mutationFn: async (id: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('knowledge_articles')
        .update({
          archived_at: new Date().toISOString(),
          archived_by: user.id,
        })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['articles'] });
      toast({
        title: "Success!",
        description: "Article archived successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to archive article.",
        variant: "destructive",
      });
    },
  });

  const unarchiveArticle = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('knowledge_articles')
        .update({
          archived_at: null,
          archived_by: null,
        })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['articles'] });
      toast({
        title: "Success!",
        description: "Article unarchived successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to unarchive article.",
        variant: "destructive",
      });
    },
  });

  return {
    createArticle: createArticle.mutateAsync,
    updateArticle: updateArticle.mutateAsync,
    deleteArticle: deleteArticle.mutateAsync,
    archiveArticle: archiveArticle.mutateAsync,
    unarchiveArticle: unarchiveArticle.mutateAsync,
    isSubmitting: createArticle.isPending || updateArticle.isPending || deleteArticle.isPending || archiveArticle.isPending || unarchiveArticle.isPending,
  };
};
