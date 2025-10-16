import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { useKnowledgeBase } from '@/hooks/useKnowledgeBase';
import { useUser } from '@/contexts/UserContext';
import { ArticleCard } from '@/components/knowledge/ArticleCard';
import { Cultiva8OnlyNavigation } from '@/components/knowledge/Cultiva8OnlyNavigation';
import { 
  Tag, 
  Search,
  Filter,
  Plus, 
  BookOpen
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Card, 
  CardContent
} from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import LoadingSpinner from '@/components/ui/loading-spinner';

const TagView = () => {
  const { tag } = useParams<{ tag: string }>();
  const navigate = useNavigate();
  const { currentUser } = useUser();
  const { useArticles } = useKnowledgeBase();
  
  const decodedTag = tag ? decodeURIComponent(tag) : '';
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('newest');
  
  // Get articles with this tag and filters
  const { data: articles = [], isLoading } = useArticles({ 
    tag: decodedTag,
    searchQuery: searchQuery || undefined,
    type: selectedType === 'all' ? undefined : selectedType,
    sort: sortBy
  });
  
  const contentTypes = [
    { value: 'all', label: 'All Content', icon: BookOpen },
    { value: 'article', label: 'Articles', icon: BookOpen },
    { value: 'question', label: 'Questions', icon: BookOpen },
    { value: 'quote', label: 'Quotes', icon: BookOpen },
    { value: 'poll', label: 'Polls', icon: BookOpen }
  ];
  
  const clearFilters = () => {
    setSearchQuery('');
    setSelectedType('all');
    setSortBy('newest');
  };
  
  const hasActiveFilters = searchQuery || selectedType !== 'all' || sortBy !== 'newest';
  
  const handleArticleClick = (articleId: string) => {
    navigate(`/knowledge/article/${articleId}`);
  };
  
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-4 sm:py-6 max-w-full">
        <Cultiva8OnlyNavigation />
        
        {/* Header */}
        <div className="mb-8 mt-6">
          <div className="flex items-center gap-3">
            <Tag className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#00eada]">{decodedTag}</h1>
              <p className="text-muted-foreground">Browse all content tagged with "{decodedTag}"</p>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="space-y-4">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input 
                  placeholder="Search within this topic..." 
                  value={searchQuery} 
                  onChange={e => setSearchQuery(e.target.value)} 
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
            </div>
          </CardContent>
        </Card>

        {/* Content Area */}
        <div className="space-y-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <LoadingSpinner size="lg" text="Loading knowledge base..." />
            </div>
          ) : articles.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2 text-white">No content found</h3>
                <p className="text-muted-foreground mb-4">
                  {hasActiveFilters 
                    ? "Try adjusting your filters or search terms" 
                    : `No content found with the tag "${decodedTag}"`
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

export default TagView;
