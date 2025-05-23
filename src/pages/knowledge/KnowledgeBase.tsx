import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Shell } from '@/components/layout/Shell';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  PlusCircle, 
  Search,
  SlidersHorizontal,
  Tag
} from 'lucide-react';
import { ContentTypeSelector } from '@/components/knowledge/ContentTypeSelector';
import { TagsList } from '@/components/knowledge/TagsList';
import { ArticleCard } from '@/components/knowledge/ArticleCard';
import { useKnowledgeBase } from '@/hooks/useKnowledgeBase';
import { ContentType } from '@/models/knowledgeTypes';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CreatePostModal } from '@/components/knowledge/CreatePostModal';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { useToast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const KnowledgeBase = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // States
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(
    searchParams.get('tag')
  );
  const [selectedType, setSelectedType] = useState<string | null>(
    searchParams.get('type') || 'all'
  );
  const [sortOption, setSortOption] = useState(
    searchParams.get('sort') || 'newest'
  );
  const [articles, setArticles] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Hooks
  const { useTags } = useKnowledgeBase();
  
  // Fetch tags for the filter sidebar
  const { data: tags, isLoading: isTagsLoading } = useTags();
  
  // Function to directly fetch articles - updated to limit to top 100
  const fetchArticles = async () => {
    setIsLoading(true);
    try {
      console.log('Directly fetching articles with filters:', { selectedTag, searchQuery, selectedType });
      
      // First fetch articles without trying to join with profiles
      let query = supabase
        .from('knowledge_articles')
        .select(`
          id, 
          title,
          content,
          created_at,
          updated_at,
          view_count,
          comment_count,
          vote_count,
          tags,
          content_type,
          user_id
        `)
        .order('created_at', { ascending: false })
        .limit(100); // Limit to top 100 posts
      
      if (selectedTag) {
        query = query.contains('tags', [selectedTag]);
      }
      
      if (searchQuery && searchQuery.length > 2) {
        query = query.or(`title.ilike.%${searchQuery}%,content.ilike.%${searchQuery}%`);
      }
      
      // Only filter by type if it's not null/undefined and not 'all'
      if (selectedType && selectedType !== 'all') {
        // Convert from lowercase filter values to uppercase ContentType enum values
        let contentType = selectedType.toUpperCase();
        query = query.eq('content_type', contentType);
      }
      
      const { data: articles, error } = await query;
      
      if (error) {
        console.error('Error fetching articles directly:', error);
        toast({
          title: "Failed to load content",
          description: error.message,
          variant: "destructive"
        });
        return;
      }
      
      console.log('Articles fetched successfully:', articles?.length || 0);
      
      // If no articles, set empty array and return
      if (!articles || articles.length === 0) {
        setArticles([]);
        setIsLoading(false);
        return;
      }
      
      // Extract all unique user_ids to fetch their profiles
      const userIds = [...new Set(articles.map(article => article.user_id))];
      
      // Fetch profiles for all authors in a single query
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, avatar_url')
        .in('id', userIds);
      
      if (profilesError) {
        console.error('Error fetching author profiles:', profilesError);
        // Continue with articles even if profiles fetch fails
      }
      
      // Create a map of user_id to profile for easy lookup
      const profilesMap = (profiles || []).reduce((map, profile) => {
        map[profile.id] = profile;
        return map;
      }, {} as Record<string, any>);
      
      // Format the articles with author information
      const formattedData = articles.map(article => {
        const profileData = profilesMap[article.user_id];
        
        return {
          ...article,
          content_type: article.content_type || ContentType.ARTICLE,
          author: profileData ? {
            id: article.user_id,
            name: `${profileData.first_name || ''} ${profileData.last_name || ''}`.trim(),
            avatar_url: profileData.avatar_url || ''
          } : undefined
        };
      });
      
      setArticles(formattedData || []);
    } catch (error: any) {
      console.error('Error fetching articles:', error);
      toast({
        title: "Failed to load content",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (selectedTag) params.set('tag', selectedTag);
    if (selectedType && selectedType !== 'all') params.set('type', selectedType);
    if (sortOption) params.set('sort', sortOption);
    setSearchParams(params, { replace: true });
  }, [selectedTag, selectedType, sortOption, setSearchParams]);

  // Fetch articles when filters change
  useEffect(() => {
    fetchArticles();
  }, [selectedTag, selectedType]);

  // Debug articles data
  useEffect(() => {
    if (articles && articles.length > 0) {
      console.log(`Displaying ${articles.length} articles:`, 
        articles.map(a => ({ id: a.id, title: a.title, type: a.content_type }))
      );
    }
  }, [articles]);

  // Handle search input debouncing
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.length > 2 || searchQuery === '') {
        fetchArticles();
      }
    }, 300);
    
    return () => clearTimeout(timer);
  }, [searchQuery]);
  
  // Handle tag selection
  const handleTagSelect = (tagName: string) => {
    if (selectedTag === tagName) {
      setSelectedTag(null);
    } else {
      setSelectedTag(tagName);
    }
  };

  // Handle content type selection
  const handleTypeSelect = (type: string) => {
    setSelectedType(type);
  };
  
  // Sort function for articles
  const sortedArticles = React.useMemo(() => {
    if (!articles) return [];
    
    let sorted = [...articles];
    
    switch (sortOption) {
      case 'newest':
        sorted.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
      case 'oldest':
        sorted.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
        break;
      case 'mostViewed':
        sorted.sort((a, b) => (b.view_count || 0) - (a.view_count || 0));
        break;
      case 'mostVoted':
        sorted.sort((a, b) => (b.vote_count || 0) - (a.vote_count || 0));
        break;
      default:
        // Default to newest
        sorted.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }
    
    return sorted;
  }, [articles, sortOption]);
  
  // Get content type label
  const getContentTypeLabel = (type: string | null) => {
    switch (type) {
      case ContentType.ARTICLE:
        return 'Articles';
      case ContentType.QUESTION:
        return 'Questions';
      case ContentType.QUOTE:
        return 'Quotes';
      case ContentType.POLL:
        return 'Polls';
      default:
        return 'All Content';
    }
  };
  
  // Filtered content text
  const getFilteredContentText = () => {
    const typeText = selectedType ? getContentTypeLabel(selectedType) : 'All content';
    const tagText = selectedTag ? `tagged with "${selectedTag}"` : '';
    return `${typeText} ${tagText}`;
  };
  
  // Main JSX
  return (
    <Shell>
      <div className="container mx-auto px-4 py-6 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Knowledge Base</h1>
            <p className="text-muted-foreground">
              Browse and find useful resources, articles, and community knowledge
            </p>
          </div>
          
          <div className="flex gap-2 items-start">
            <Button 
              onClick={() => navigate("/knowledge/topics")}
              variant="outline"
            >
              <Tag className="mr-2 h-4 w-4" />
              Browse Tags
            </Button>
            
            <Button 
              onClick={() => navigate("/knowledge/create")}
              className="shrink-0"
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Create Post
            </Button>
            
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="md:hidden">
                  <SlidersHorizontal className="h-4 w-4 mr-2" />
                  Filters
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <SheetHeader>
                  <SheetTitle>Filters</SheetTitle>
                  <SheetDescription>
                    Narrow down the results based on specific criteria
                  </SheetDescription>
                </SheetHeader>
                
                <div className="space-y-6 mt-6">
                  <div>
                    <h3 className="text-sm font-medium mb-2">Content Type</h3>
                    <ContentTypeSelector
                      selected={selectedType || 'all'}
                      onChange={handleTypeSelect}
                    />
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium mb-2">Tags</h3>
                    <TagsList 
                      tags={tags || []} 
                      selectedTag={selectedTag}
                      isLoading={isTagsLoading}
                      onSelectTag={handleTagSelect}
                    />
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium mb-2">Sort By</h3>
                    <Select value={sortOption} onValueChange={setSortOption}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sort by" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="newest">Newest First</SelectItem>
                        <SelectItem value="oldest">Oldest First</SelectItem>
                        <SelectItem value="mostViewed">Most Viewed</SelectItem>
                        <SelectItem value="mostVoted">Most Upvoted</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
        
        {/* Search and Filters */}
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="w-full lg:w-3/4 relative">
            <Search className="absolute top-1/2 transform -translate-y-1/2 left-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search the knowledge base..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="w-full lg:w-1/4 flex gap-2">
            <Select value={sortOption} onValueChange={setSortOption}>
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="mostViewed">Most Viewed</SelectItem>
                <SelectItem value="mostVoted">Most Upvoted</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {/* Main content area */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filter sidebar - desktop */}
          <div className="hidden md:block w-full lg:w-1/4 space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-3">Content Type</h3>
              <ContentTypeSelector
                selected={selectedType || 'all'}
                onChange={handleTypeSelect}
              />
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-3">Tags</h3>
              <TagsList 
                tags={tags || []} 
                selectedTag={selectedTag}
                isLoading={isTagsLoading}
                onSelectTag={handleTagSelect}
              />
            </div>
          </div>
          
          {/* Article list */}
          <div className="w-full lg:w-3/4 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">
                {getFilteredContentText()}
              </h2>
              
              {(selectedTag || selectedType !== 'all' && selectedType !== null) && (
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => {
                    setSelectedTag(null);
                    setSelectedType('all');
                  }}
                >
                  Clear filters
                </Button>
              )}
            </div>
            
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-[200px] w-full rounded-lg" />
                ))}
              </div>
            ) : sortedArticles && sortedArticles.length > 0 ? (
              <div className="space-y-4">
                {sortedArticles.map((article) => (
                  <ArticleCard
                    key={article.id}
                    article={article}
                    onClick={() => navigate(`/knowledge/${article.id}`)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-muted/50 rounded-lg">
                <h3 className="font-medium text-xl mb-2">No content found</h3>
                <p className="text-muted-foreground mb-6">
                  {searchQuery.length > 0 
                    ? `No results found for "${searchQuery}"` 
                    : selectedTag 
                      ? `No content tagged with "${selectedTag}"`
                      : selectedType
                        ? `No ${getContentTypeLabel(selectedType).toLowerCase()} found`
                        : "No content has been created yet"
                  }
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-3">
                  <Button onClick={() => fetchArticles()}>
                    Reload Content
                  </Button>
                  <Button onClick={() => navigate("/knowledge/create")}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Create New Post
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Create Post Modal - updated to handle new redirect approach */}
      <CreatePostModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        onSelectType={(type) => {
          setIsCreateModalOpen(false);
          navigate(`/knowledge/create?type=${type}`);
        }}
      />
    </Shell>
  );
};

export default KnowledgeBase;
