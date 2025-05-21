
import React, { useState } from 'react';
import { Shell } from '@/components/layout/Shell';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { 
  Search, 
  PlusCircle, 
  Tag, 
  Filter, 
  BookOpen,
  MessageSquare,
  BarChart2,
  Quote
} from 'lucide-react';

// UI Components
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';

// Custom Components
import { ArticleCard } from '@/components/knowledge/ArticleCard';
import { TagsList } from '@/components/knowledge/TagsList';
import { ContentTypeSelector } from '@/components/knowledge/ContentTypeSelector';

// Services and hooks
import { usePermissions } from '@/hooks/usePermissions';
import { useUser } from '@/contexts/UserContext';

// Mock data for demonstration
import { getMockArticles, getMockTags } from '@/data/mockKnowledgeData';

const KnowledgeBase = () => {
  const navigate = useNavigate();
  const { currentUser } = useUser();
  const { isOrganizer, isAdmin } = usePermissions(currentUser);
  
  // State variables
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [contentType, setContentType] = useState<string>('all');
  const [sortOption, setSortOption] = useState<string>('newest');
  
  // Fetch articles with query parameters
  const { data: articles, isLoading: articlesLoading } = useQuery({
    queryKey: ['knowledgeArticles', searchQuery, selectedTag, contentType, sortOption],
    queryFn: () => getMockArticles({ 
      query: searchQuery, 
      tag: selectedTag, 
      type: contentType !== 'all' ? contentType : undefined,
      sort: sortOption
    })
  });
  
  // Fetch tags
  const { data: tags, isLoading: tagsLoading } = useQuery({
    queryKey: ['knowledgeTags'],
    queryFn: () => getMockTags()
  });
  
  // Handle tag selection
  const handleTagSelect = (tag: string) => {
    if (selectedTag === tag) {
      setSelectedTag(null);
    } else {
      setSelectedTag(tag);
    }
  };
  
  // Clear all filters
  const clearFilters = () => {
    setSearchQuery('');
    setSelectedTag(null);
    setContentType('all');
    setSortOption('newest');
  };
  
  return (
    <Shell>
      <div className="container mx-auto px-4 py-6">
        {/* Header section with title and create button */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Knowledge Base</h1>
            <p className="text-muted-foreground mt-1">
              Discover, learn, and share knowledge with the community
            </p>
          </div>
          
          {(isOrganizer || isAdmin) && (
            <Button onClick={() => navigate('/knowledge/create')} className="shrink-0">
              <PlusCircle className="mr-2 h-4 w-4" />
              Create Content
            </Button>
          )}
        </div>
        
        {/* Main content grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Left sidebar with filters */}
          <div className="md:col-span-1 space-y-6">
            {/* Search box */}
            <div>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search knowledge base..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            
            {/* Content type filter */}
            <div>
              <h3 className="text-sm font-medium mb-2">Content type</h3>
              <ContentTypeSelector 
                selected={contentType}
                onChange={setContentType}
              />
            </div>
            
            {/* Sort options */}
            <div>
              <h3 className="text-sm font-medium mb-2">Sort by</h3>
              <Select
                value={sortOption}
                onValueChange={setSortOption}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="popular">Most Popular</SelectItem>
                  <SelectItem value="votes">Highest Votes</SelectItem>
                  <SelectItem value="views">Most Viewed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* Tags filter */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium">Filter by tags</h3>
                {selectedTag && (
                  <Button variant="ghost" size="sm" className="h-8 px-2 text-xs" onClick={() => setSelectedTag(null)}>
                    Clear
                  </Button>
                )}
              </div>
              
              <TagsList 
                tags={tags || []}
                selectedTag={selectedTag}
                isLoading={tagsLoading}
                onSelectTag={handleTagSelect}
              />
            </div>
            
            {/* Clear filters button */}
            {(searchQuery || selectedTag || contentType !== 'all' || sortOption !== 'newest') && (
              <Button variant="outline" className="w-full" onClick={clearFilters}>
                <Filter className="mr-2 h-4 w-4" />
                Clear all filters
              </Button>
            )}
          </div>
          
          {/* Main content area */}
          <div className="md:col-span-3">
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="questions">Questions</TabsTrigger>
                <TabsTrigger value="articles">Articles</TabsTrigger>
                <TabsTrigger value="quotes">Quotes</TabsTrigger>
                <TabsTrigger value="polls">Polls</TabsTrigger>
              </TabsList>
              
              <TabsContent value="all" className="space-y-4">
                {articlesLoading ? (
                  <div className="space-y-4">
                    {Array(3).fill(0).map((_, i) => (
                      <Card key={i} className="animate-pulse">
                        <CardHeader>
                          <div className="h-4 bg-muted rounded w-3/4"></div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            <div className="h-3 bg-muted rounded"></div>
                            <div className="h-3 bg-muted rounded w-5/6"></div>
                          </div>
                        </CardContent>
                        <CardFooter>
                          <div className="h-3 bg-muted rounded w-1/4"></div>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                ) : articles && articles.length > 0 ? (
                  <div className="space-y-4">
                    {articles.map((article) => (
                      <ArticleCard key={article.id} article={article} />
                    ))}
                  </div>
                ) : (
                  <Card className="p-8 text-center bg-card/60 backdrop-blur-sm">
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                      <BookOpen className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-medium mb-2">No content found</h3>
                    <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                      {searchQuery || selectedTag
                        ? "Try adjusting your search terms or filters to find what you're looking for."
                        : "Be the first to contribute to our knowledge base by sharing your insights."}
                    </p>
                    
                    {(isOrganizer || isAdmin) && !searchQuery && !selectedTag && (
                      <Button onClick={() => navigate('/knowledge/create')}>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Create Content
                      </Button>
                    )}
                  </Card>
                )}
              </TabsContent>
              
              {/* Similar structure for other tabs - omitted for brevity */}
              <TabsContent value="questions">
                <div className="p-8 text-center">
                  <p className="text-muted-foreground">Content filtered to show Questions only</p>
                </div>
              </TabsContent>
              
              <TabsContent value="articles">
                <div className="p-8 text-center">
                  <p className="text-muted-foreground">Content filtered to show Articles only</p>
                </div>
              </TabsContent>
              
              <TabsContent value="quotes">
                <div className="p-8 text-center">
                  <p className="text-muted-foreground">Content filtered to show Quotes only</p>
                </div>
              </TabsContent>
              
              <TabsContent value="polls">
                <div className="p-8 text-center">
                  <p className="text-muted-foreground">Content filtered to show Polls only</p>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </Shell>
  );
};

export default KnowledgeBase;
