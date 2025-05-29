
import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Search, Filter, BookOpen, MessageSquare, Quote, HelpCircle, BarChart3 } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { useKnowledgeBase } from '@/hooks/useKnowledgeBase';
import { useTags } from '@/hooks/knowledge/useTags';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ArticleCard } from '@/components/knowledge/ArticleCard';
import { CoreNavigation } from '@/components/rel8t/CoreNavigation';
import { ContentType } from '@/models/knowledgeTypes';

const KnowledgeBase = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('newest');
  
  const { useArticles } = useKnowledgeBase();
  const { data: tags = [] } = useTags();
  
  // Fetch articles with current filters
  const { data: articles = [], isLoading } = useArticles({
    searchQuery: searchQuery || undefined,
    tag: selectedTag || undefined,
    type: selectedType,
    sort: sortBy
  });

  // Content type options with icons
  const contentTypes = [
    { value: 'all', label: 'All Content', icon: BookOpen },
    { value: 'article', label: 'Articles', icon: BookOpen },
    { value: 'question', label: 'Questions', icon: HelpCircle },
    { value: 'quote', label: 'Quotes', icon: Quote },
    { value: 'poll', label: 'Polls', icon: BarChart3 }
  ];

  // Filter articles by type for stats
  const articleStats = useMemo(() => {
    const stats = {
      total: articles.length,
      articles: articles.filter(a => a.content_type === ContentType.ARTICLE).length,
      questions: articles.filter(a => a.content_type === ContentType.QUESTION).length,
      quotes: articles.filter(a => a.content_type === ContentType.QUOTE).length,
      polls: articles.filter(a => a.content_type === ContentType.POLL).length,
    };
    return stats;
  }, [articles]);

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedTag('');
    setSelectedType('all');
    setSortBy('newest');
  };

  const hasActiveFilters = searchQuery || selectedTag || selectedType !== 'all' || sortBy !== 'newest';

  const handleArticleClick = (articleId: string) => {
    navigate(`/knowledge/articles/${articleId}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-4 sm:py-6 max-w-full">
        <CoreNavigation />
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 mt-6">
          <div className="min-w-0">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold truncate">Knowledge Base</h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              Discover, share, and contribute to our collective knowledge
            </p>
          </div>
          
          <div className="flex gap-2 shrink-0">
            <Button asChild>
              <Link to="/knowledge/create">
                <Plus className="h-4 w-4 mr-2" />
                Create Content
              </Link>
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <BookOpen className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-2xl font-bold">{articleStats.total}</p>
                  <p className="text-xs text-muted-foreground">Total</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <BookOpen className="h-4 w-4 text-blue-600" />
                <div>
                  <p className="text-2xl font-bold">{articleStats.articles}</p>
                  <p className="text-xs text-muted-foreground">Articles</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <HelpCircle className="h-4 w-4 text-green-600" />
                <div>
                  <p className="text-2xl font-bold">{articleStats.questions}</p>
                  <p className="text-xs text-muted-foreground">Questions</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Quote className="h-4 w-4 text-purple-600" />
                <div>
                  <p className="text-2xl font-bold">{articleStats.quotes}</p>
                  <p className="text-xs text-muted-foreground">Quotes</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <BarChart3 className="h-4 w-4 text-orange-600" />
                <div>
                  <p className="text-2xl font-bold">{articleStats.polls}</p>
                  <p className="text-xs text-muted-foreground">Polls</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="space-y-4">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search articles, questions, quotes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              {/* Filter Controls */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="Content Type" />
                  </SelectTrigger>
                  <SelectContent>
                    {contentTypes.map(type => {
                      const Icon = type.icon;
                      return (
                        <SelectItem key={type.value} value={type.value}>
                          <div className="flex items-center">
                            <Icon className="h-4 w-4 mr-2" />
                            {type.label}
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
                
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="oldest">Oldest First</SelectItem>
                    <SelectItem value="most_voted">Most Voted</SelectItem>
                  </SelectContent>
                </Select>
                
                {hasActiveFilters && (
                  <Button variant="outline" onClick={clearFilters}>
                    <Filter className="h-4 w-4 mr-2" />
                    Clear Filters
                  </Button>
                )}
              </div>
              
              {/* Tags Filter with Scrolling */}
              {tags.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium mb-3">Filter by Tags</h3>
                  <ScrollArea className="w-full max-h-20">
                    <div className="flex gap-2 pb-2">
                      <Badge
                        variant={selectedTag === '' ? 'default' : 'secondary'}
                        className="cursor-pointer whitespace-nowrap"
                        onClick={() => setSelectedTag('')}
                      >
                        All Tags
                      </Badge>
                      {tags.map(tag => (
                        <Badge
                          key={tag.id}
                          variant={selectedTag === tag.name ? 'default' : 'secondary'}
                          className="cursor-pointer whitespace-nowrap"
                          onClick={() => setSelectedTag(tag.name === selectedTag ? '' : tag.name)}
                        >
                          {tag.name}
                        </Badge>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Content Area */}
        <div className="space-y-6">
          {isLoading ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-6">
                    <div className="animate-pulse space-y-4">
                      <div className="h-4 bg-muted rounded w-3/4"></div>
                      <div className="h-3 bg-muted rounded w-1/2"></div>
                      <div className="h-20 bg-muted rounded"></div>
                      <div className="h-3 bg-muted rounded w-1/4"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : articles.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No content found</h3>
                <p className="text-muted-foreground mb-4">
                  {hasActiveFilters 
                    ? "Try adjusting your filters or search terms"
                    : "Be the first to share your knowledge!"
                  }
                </p>
                <Button asChild>
                  <Link to="/knowledge/create">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Content
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {articles.map(article => (
                <div key={article.id} onClick={() => handleArticleClick(article.id)} className="cursor-pointer">
                  <ArticleCard article={article} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default KnowledgeBase;
