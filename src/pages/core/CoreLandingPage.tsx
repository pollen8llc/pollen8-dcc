
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Shell } from '@/components/layout/Shell';
import { useKnowledgeBase } from '@/hooks/useKnowledgeBase';
import { usePermissions } from '@/hooks/usePermissions';
import { useUser } from '@/contexts/UserContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PlusCircle, Search, Tag, ThumbsUp, MessageSquare, Eye, Calendar } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const CoreLandingPage = () => {
  const { currentUser } = useUser();
  const { isOrganizer, isAdmin } = usePermissions(currentUser);
  const { useArticles, useTags } = useKnowledgeBase();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('latest');

  // Get articles based on current filters
  const { data: articles, isLoading: articlesLoading } = useArticles({
    tag: selectedTag || undefined,
    searchQuery: searchQuery || undefined,
  });

  // Get all tags
  const { data: tags, isLoading: tagsLoading } = useTags();

  // Handle search input change with debounce
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Handle tag click
  const handleTagClick = (tag: string) => {
    if (selectedTag === tag) {
      setSelectedTag(null);
    } else {
      setSelectedTag(tag);
    }
  };

  // Filter articles based on tab
  const filteredArticles = articles ? [...articles].sort((a, b) => {
    if (activeTab === 'latest') {
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    } else if (activeTab === 'popular') {
      return (b.view_count || 0) - (a.view_count || 0);
    } else if (activeTab === 'unanswered') {
      if (a.is_answered && !b.is_answered) return 1;
      if (!a.is_answered && b.is_answered) return -1;
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    }
    return 0;
  }) : [];

  return (
    <Shell>
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-2">CORE Knowledge Base</h1>
            <p className="text-muted-foreground">
              Learn, share, and connect through our community knowledge base
            </p>
          </div>
          
          {(isOrganizer || isAdmin) && (
            <Button className="mt-4 md:mt-0 bg-royal-blue-600 hover:bg-royal-blue-700" asChild>
              <Link to="/core/articles/new">
                <PlusCircle className="mr-2 h-4 w-4" />
                New Article
              </Link>
            </Button>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="md:col-span-1 space-y-6">
            {/* Search Box */}
            <div className="space-y-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search articles..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={handleSearchChange}
                />
              </div>
            </div>
            
            {/* Tags List */}
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Popular Tags</h3>
              <Separator />
              
              {tagsLoading ? (
                <div className="flex gap-2 flex-wrap">
                  {[1, 2, 3, 4, 5].map(i => (
                    <Badge key={i} variant="outline" className="animate-pulse bg-muted h-6 w-16"></Badge>
                  ))}
                </div>
              ) : (
                <div className="flex gap-2 flex-wrap">
                  {tags?.slice(0, 15).map(tag => (
                    <Badge
                      key={tag.id}
                      variant={selectedTag === tag.name ? "default" : "outline"}
                      className={selectedTag === tag.name 
                        ? "bg-royal-blue-500 hover:bg-royal-blue-600 cursor-pointer" 
                        : "cursor-pointer hover:bg-royal-blue-100 dark:hover:bg-royal-blue-900"
                      }
                      onClick={() => handleTagClick(tag.name)}
                    >
                      {tag.name}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          {/* Main Content */}
          <div className="md:col-span-3">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="latest">Latest</TabsTrigger>
                <TabsTrigger value="popular">Most Viewed</TabsTrigger>
                <TabsTrigger value="unanswered">Unanswered</TabsTrigger>
              </TabsList>
              
              <TabsContent value={activeTab} className="space-y-4">
                {articlesLoading ? (
                  <>
                    {[1, 2, 3].map(i => (
                      <Card key={i} className="animate-pulse">
                        <CardHeader>
                          <div className="h-6 bg-muted rounded w-3/4 mb-2"></div>
                          <div className="h-4 bg-muted rounded w-1/4"></div>
                        </CardHeader>
                        <CardContent>
                          <div className="h-4 bg-muted rounded w-full mb-2"></div>
                          <div className="h-4 bg-muted rounded w-5/6"></div>
                        </CardContent>
                      </Card>
                    ))}
                  </>
                ) : filteredArticles.length > 0 ? (
                  <>
                    {filteredArticles.map(article => (
                      <Card key={article.id} className="transition-shadow hover:shadow-md">
                        <CardHeader>
                          <Link to={`/core/articles/${article.id}`} className="group">
                            <CardTitle className="text-xl group-hover:text-royal-blue-600 dark:group-hover:text-royal-blue-400 transition-colors">
                              {article.title}
                            </CardTitle>
                          </Link>
                          <div className="flex flex-wrap gap-2">
                            {article.tags?.map(tag => (
                              <Badge key={tag} variant="outline" className="text-xs" onClick={() => handleTagClick(tag)}>
                                <Tag className="h-3 w-3 mr-1" />
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </CardHeader>
                        
                        <CardContent>
                          <p className="text-muted-foreground line-clamp-2">
                            {article.content?.replace(/<[^>]*>?/gm, '').substring(0, 150)}...
                          </p>
                        </CardContent>
                        
                        <CardFooter className="flex justify-between text-sm text-muted-foreground">
                          <div className="flex items-center gap-6">
                            <div className="flex items-center">
                              <ThumbsUp className="h-4 w-4 mr-1" />
                              <span>{article.vote_count || 0}</span>
                            </div>
                            
                            <div className="flex items-center">
                              <MessageSquare className="h-4 w-4 mr-1" />
                              <span>0</span>
                            </div>
                            
                            <div className="flex items-center">
                              <Eye className="h-4 w-4 mr-1" />
                              <span>{article.view_count}</span>
                            </div>
                          </div>
                          
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            <span>{formatDistanceToNow(new Date(article.created_at), { addSuffix: true })}</span>
                          </div>
                        </CardFooter>
                      </Card>
                    ))}
                  </>
                ) : (
                  <div className="text-center p-8">
                    <h3 className="text-lg font-medium mb-2">No articles found</h3>
                    <p className="text-muted-foreground mb-4">
                      {searchQuery || selectedTag 
                        ? "Try adjusting your search or filters" 
                        : "Be the first to contribute to our knowledge base"}
                    </p>
                    
                    {(isOrganizer || isAdmin) && !searchQuery && !selectedTag && (
                      <Button asChild>
                        <Link to="/core/articles/new">
                          <PlusCircle className="mr-2 h-4 w-4" />
                          Create New Article
                        </Link>
                      </Button>
                    )}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </Shell>
  );
};

export default CoreLandingPage;
