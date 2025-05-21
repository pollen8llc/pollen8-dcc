
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shell } from '@/components/layout/Shell';
import { useKnowledgeBase } from '@/hooks/useKnowledgeBase';
import { useDebounce } from '@/hooks/useDebounce';
import { 
  MessageSquare, 
  Eye, 
  Search,
  PlusCircle, 
  Filter,
  LayoutGrid,
  List,
  BookOpen
} from 'lucide-react';
import { useUser } from '@/contexts/UserContext';
import { usePermissions } from '@/hooks/usePermissions';
import { formatDistanceToNow } from 'date-fns';

// UI Components
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Card, 
  CardContent, 
  CardFooter,
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { Toggle } from '@/components/ui/toggle';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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

const UnifiedKnowledgeBase = () => {
  const navigate = useNavigate();
  const { currentUser } = useUser();
  const { isOrganizer, isAdmin } = usePermissions(currentUser);
  
  // State variables
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [contentType, setContentType] = useState<string>('all');
  const [sortOption, setSortOption] = useState<string>('newest');
  const [viewMode, setViewMode] = useState<'simple' | 'advanced'>('simple');
  
  const debouncedSearch = useDebounce(searchTerm, 500);
  
  const { useArticles, useTags } = useKnowledgeBase();
  
  // Fetch articles with query parameters - Fix: remove 'sort' property and handle sorting in the component
  const { data: articles, isLoading: articlesLoading } = useArticles({ 
    searchQuery: debouncedSearch,
    tag: selectedTag,
    type: contentType !== 'all' ? contentType : undefined
  });
  
  // Apply sorting to articles after fetching
  const sortedArticles = React.useMemo(() => {
    if (!articles) return [];
    
    const articlesCopy = [...articles];
    
    switch (sortOption) {
      case 'newest':
        return articlesCopy.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      case 'popular':
        return articlesCopy.sort((a, b) => (b.view_count || 0) - (a.view_count || 0));
      case 'votes':
        return articlesCopy.sort((a, b) => (b.vote_count || 0) - (a.vote_count || 0));
      default:
        return articlesCopy.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }
  }, [articles, sortOption]);
  
  // Fetch tags
  const { data: tags, isLoading: tagsLoading } = useTags();
  
  // Filter tabs
  const filterTabs = ['Newest', 'Active', 'Unanswered', 'Bounty'];
  const [activeTab, setActiveTab] = useState('Newest');
  
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
    setSearchTerm('');
    setSelectedTag(null);
    setContentType('all');
    setSortOption('newest');
  };
  
  return (
    <Shell>
      <div className="container mx-auto px-4 py-6">
        {/* Header with title and action buttons */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Knowledge Base</h1>
            <p className="text-muted-foreground mt-1">
              Find solutions, share knowledge, build your reputation
            </p>
          </div>
          
          <div className="flex gap-3 items-center mt-4 md:mt-0">
            {/* View mode toggle */}
            <div className="bg-muted/40 rounded-lg p-1 flex">
              <Toggle 
                pressed={viewMode === 'simple'} 
                onPressedChange={() => setViewMode('simple')}
                className="data-[state=on]:bg-background"
                size="sm"
              >
                <List className="h-4 w-4" />
              </Toggle>
              <Toggle 
                pressed={viewMode === 'advanced'} 
                onPressedChange={() => setViewMode('advanced')}
                className="data-[state=on]:bg-background"
                size="sm"
              >
                <LayoutGrid className="h-4 w-4" />
              </Toggle>
            </div>
            
            <Button variant="outline" className="flex items-center gap-2" onClick={() => navigate('/knowledge/topics')}>
              <Search className="h-4 w-4" />
              Browse Topics
            </Button>
            
            {(isOrganizer || isAdmin) && (
              <Button className="flex items-center gap-2" onClick={() => navigate('/knowledge/create')}>
                <PlusCircle className="h-4 w-4" />
                Ask Question
              </Button>
            )}
          </div>
        </div>
        
        {viewMode === 'simple' ? (
          <>
            {/* Simple view (similar to CoreLandingPage) */}
            <div className="mb-6">
              <div className="relative w-full md:max-w-md mx-auto mb-6">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search knowledge base..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            
              {/* Filter tabs */}
              <div className="flex overflow-x-auto mb-6 bg-muted/30 rounded-lg p-1 mx-auto max-w-2xl">
                {filterTabs.map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2 rounded-md whitespace-nowrap ${
                      activeTab === tab ? 'bg-background text-foreground' : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Questions list */}
            <div className="space-y-4 max-w-4xl mx-auto">
              {articlesLoading ? (
                Array(3).fill(null).map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <CardHeader>
                      <div className="h-7 bg-muted rounded w-3/4 mb-2"></div>
                      <div className="h-5 bg-muted rounded w-1/2"></div>
                    </CardHeader>
                    <CardFooter className="flex justify-between">
                      <div className="flex gap-3">
                        <div className="h-5 bg-muted rounded w-16"></div>
                        <div className="h-5 bg-muted rounded w-16"></div>
                      </div>
                      <div className="h-5 bg-muted rounded w-24"></div>
                    </CardFooter>
                  </Card>
                ))
              ) : sortedArticles && sortedArticles.length > 0 ? (
                sortedArticles.map(article => (
                  <Card key={article.id} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between">
                        <div>
                          <a onClick={() => navigate(`/knowledge/${article.id}`)} className="hover:underline cursor-pointer">
                            <CardTitle className="text-xl">{article.title}</CardTitle>
                          </a>
                          <p className="text-muted-foreground line-clamp-2 mt-1">
                            {article.content.replace(/<[^>]*>/g, '').substring(0, 150)}...
                          </p>
                        </div>
                      </div>
                      
                      {/* Tags */}
                      {article.tags && article.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-3">
                          {article.tags.map(tag => (
                            <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                          ))}
                        </div>
                      )}
                    </CardHeader>
                    
                    <CardFooter className="flex justify-between pt-2">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <MessageSquare className="h-4 w-4" /> 
                          {article.comment_count || 0} responses
                        </span>
                        
                        <span className="flex items-center gap-1">
                          <Eye className="h-4 w-4" />
                          {article.view_count || 0} views
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={article.author?.avatar_url} />
                          <AvatarFallback>{article.author?.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <span className="text-sm">
                          {article.author?.name} • {formatDistanceToNow(new Date(article.created_at), { addSuffix: true })}
                        </span>
                      </div>
                    </CardFooter>
                  </Card>
                ))
              ) : (
                <Card className="p-8 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <div className="bg-muted rounded-full p-3 mb-4">
                      <MessageSquare className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-lg font-medium mb-2">No questions found</h3>
                    <p className="text-muted-foreground mb-4 max-w-md mx-auto">
                      Be the first to ask a question and start a discussion!
                    </p>
                    <Button onClick={() => navigate('/knowledge/create')}>
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Ask a Question
                    </Button>
                  </div>
                </Card>
              )}
            </div>
          </>
        ) : (
          <>
            {/* Advanced view (similar to KnowledgeBase) */}
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
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
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
                {(searchTerm || selectedTag || contentType !== 'all' || sortOption !== 'newest') && (
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
                    ) : sortedArticles && sortedArticles.length > 0 ? (
                      <div className="space-y-4">
                        {sortedArticles.map((article) => (
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
                          {searchTerm || selectedTag
                            ? "Try adjusting your search terms or filters to find what you're looking for."
                            : "Be the first to contribute to our knowledge base by sharing your insights."}
                        </p>
                        
                        {(isOrganizer || isAdmin) && !searchTerm && !selectedTag && (
                          <Button onClick={() => navigate('/knowledge/create')}>
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Create Content
                          </Button>
                        )}
                      </Card>
                    )}
                  </TabsContent>
                  
                  {/* Similar structure for other tabs - simplified for brevity */}
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
          </>
        )}
      </div>
    </Shell>
  );
};

export default UnifiedKnowledgeBase;
