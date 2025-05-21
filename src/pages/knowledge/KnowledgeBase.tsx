
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Shell } from '@/components/layout/Shell';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  PlusCircle, 
  Search,
  LoaderCircle,
  BookOpen,
  MessageSquare,
  Quote,
  BarChart2,
  SlidersHorizontal
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

const KnowledgeBase = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  
  // States
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(
    searchParams.get('tag')
  );
  const [selectedType, setSelectedType] = useState<string | null>(
    searchParams.get('type')
  );
  const [sortOption, setSortOption] = useState(
    searchParams.get('sort') || 'newest'
  );
  
  // Hooks
  const { useArticles, useTags } = useKnowledgeBase();
  
  // Fetch articles with filters
  const { data: articles, isLoading: isArticlesLoading } = useArticles({
    tag: selectedTag,
    searchQuery: searchQuery.length > 2 ? searchQuery : undefined,
    type: selectedType,
  });
  
  // Fetch tags for the filter sidebar
  const { data: tags, isLoading: isTagsLoading } = useTags();
  
  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (selectedTag) params.set('tag', selectedTag);
    if (selectedType) params.set('type', selectedType);
    if (sortOption) params.set('sort', sortOption);
    setSearchParams(params, { replace: true });
  }, [selectedTag, selectedType, sortOption, setSearchParams]);
  
  // Handle tag selection
  const handleTagSelect = (tagName: string) => {
    if (selectedTag === tagName) {
      setSelectedTag(null);
    } else {
      setSelectedTag(tagName);
    }
  };

  // Handle content type selection
  const handleTypeSelect = (type: string | null) => {
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
              onClick={() => setIsCreateModalOpen(true)}
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
                      selectedType={selectedType}
                      onSelectType={handleTypeSelect}
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
            <Select value={sortOption} onValueChange={setSortOption} className="w-full">
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
                selectedType={selectedType}
                onSelectType={handleTypeSelect}
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
              
              {(selectedTag || selectedType) && (
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => {
                    setSelectedTag(null);
                    setSelectedType(null);
                  }}
                >
                  Clear filters
                </Button>
              )}
            </div>
            
            {isArticlesLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-[200px] w-full rounded-lg" />
                ))}
              </div>
            ) : sortedArticles.length > 0 ? (
              <div className="space-y-4">
                {sortedArticles.map((article) => (
                  <ArticleCard
                    key={article.id}
                    article={article}
                    onClick={() => navigate(`/knowledge/article/${article.id}`)}
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
                <Button onClick={() => setIsCreateModalOpen(true)}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Create the first post
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Create Post Modal */}
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
