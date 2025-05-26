
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { KnowledgeArticle, ContentType, KnowledgeAuthor } from '@/models/knowledgeTypes';
import { useToast } from '@/hooks/use-toast';

// Helper function to transform author data with proper typing
const transformAuthor = (authorData: any, userId: string): KnowledgeAuthor => {
  // If author data exists and has the expected structure
  if (authorData && typeof authorData === 'object' && 'id' in authorData) {
    return {
      id: authorData.id,
      name: `${authorData.first_name || ''} ${authorData.last_name || ''}`.trim() || 'Unknown User',
      first_name: authorData.first_name || undefined,
      last_name: authorData.last_name || undefined,
      avatar_url: authorData.avatar_url || undefined
    };
  }
  
  // Fallback author object
  return {
    id: userId,
    name: 'Unknown User'
  };
};

export const useArticles = (options?: { searchQuery?: string; tag?: string; type?: string; sort?: string; limit?: number }) => {
  return useQuery({
    queryKey: ['articles', options],
    queryFn: async () => {
      console.log("Fetching articles with options:", options);
      
      let query = supabase
        .from('knowledge_articles')
        .select(`
          *,
          author:profiles!inner(id, first_name, last_name, avatar_url)
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

      if (error) {
        console.error("Error fetching articles:", error);
        throw error;
      }
      
      console.log("Articles fetched successfully:", data?.length || 0, "articles");
      
      // Transform the data to match our interface
      const transformedData = data?.map(item => ({
        ...item,
        author: transformAuthor(item.author, item.user_id)
      })) as KnowledgeArticle[];

      return transformedData;
    },
  });
};

export const useArticle = (id: string) => {
  return useQuery({
    queryKey: ['article', id],
    queryFn: async () => {
      console.log("Fetching single article with ID:", id);
      
      if (!id) {
        console.error("No article ID provided");
        throw new Error("Article ID is required");
      }

      // First try to get the article with author info
      const { data, error } = await supabase
        .from('knowledge_articles')
        .select(`
          *,
          author:profiles!inner(id, first_name, last_name, avatar_url)
        `)
        .eq('id', id)
        .maybeSingle();

      if (error) {
        console.error("Error fetching article with author:", error);
        
        // If the join fails, try to get just the article without author info
        console.log("Attempting to fetch article without author join...");
        const { data: articleOnly, error: articleError } = await supabase
          .from('knowledge_articles')
          .select('*')
          .eq('id', id)
          .maybeSingle();
          
        if (articleError) {
          console.error("Error fetching article:", articleError);
          throw new Error("Failed to load article");
        }
        
        if (!articleOnly) {
          console.log("Article not found for ID:", id);
          throw new Error("Article not found");
        }
        
        // Get author info separately
        let authorData = null;
        if (articleOnly.user_id) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('id, first_name, last_name, avatar_url')
            .eq('id', articleOnly.user_id)
            .maybeSingle();
          authorData = profile;
        }
        
        console.log("Article fetched successfully (without join):", articleOnly.title);
        
        return {
          ...articleOnly,
          author: transformAuthor(authorData, articleOnly.user_id)
        } as KnowledgeArticle;
      }

      if (!data) {
        console.log("Article not found for ID:", id);
        throw new Error("Article not found");
      }
      
      console.log("Article fetched successfully:", data.title);
      
      // Transform the data to match our interface
      const transformedData = {
        ...data,
        author: transformAuthor(data.author, data.user_id)
      } as KnowledgeArticle;

      return transformedData;
    },
    retry: (failureCount, error) => {
      // Don't retry if article is not found
      if (error?.message === "Article not found") {
        return false;
      }
      // Retry other errors up to 2 times
      return failureCount < 2;
    }
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
            poll_data: {
              options: data.options || [],
              allowMultipleSelections: data.allowMultipleSelections || false,
              duration: data.duration || '7'
            },
            allow_multiple_responses: data.allowMultipleSelections || false,
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
