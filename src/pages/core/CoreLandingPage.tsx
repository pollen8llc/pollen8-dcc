import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shell } from '@/components/layout/Shell';
import { useKnowledgeBase } from '@/hooks/useKnowledgeBase';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useDebounce } from '@/hooks/useDebounce';
import { 
  MessageSquare, 
  Eye, 
  Calendar,
  ThumbsUp,
  Bookmark,
  Plus,
  Search
} from 'lucide-react';
import { 
  Card,
  CardContent, 
  CardFooter,
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';
import { formatDistanceToNow } from 'date-fns';

const CoreLandingPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 500);
  
  const { useArticles } = useKnowledgeBase();
  
  const { data: articles, isLoading: articlesLoading } = useArticles({ 
    searchQuery: debouncedSearch
  });

  const filterTabs = ['Newest', 'Active', 'Unanswered', 'Bounty'];
  const [activeTab, setActiveTab] = useState('Newest');

  return (
    <Shell>
      <div className="container mx-auto px-4 py-6">
        {/* Header with title and action buttons */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Top Questions</h1>
            <p className="text-muted-foreground mt-1">
              Find solutions, share knowledge, build your reputation
            </p>
          </div>
          
          <div className="flex gap-3 mt-4 md:mt-0">
            <Button variant="outline" className="flex items-center gap-2" onClick={() => navigate('/knowledge/topics')}>
              <Search className="h-4 w-4" />
              Browse Topics
            </Button>
            <Button className="flex items-center gap-2" onClick={() => navigate('/knowledge/create')}>
              <Plus className="h-4 w-4" />
              Ask Question
            </Button>
          </div>
        </div>
        
        {/* Filter tabs */}
        <div className="flex overflow-x-auto mb-6 bg-muted/30 rounded-lg p-1">
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
        
        {/* Questions list */}
        <div className="space-y-4">
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
          ) : articles && articles.length > 0 ? (
            articles.map(article => (
              <Card key={article.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex justify-between">
                    <div>
                      <Link to={`/knowledge/${article.id}`} className="hover:underline">
                        <CardTitle className="text-xl">{article.title}</CardTitle>
                      </Link>
                      <p className="text-muted-foreground line-clamp-2 mt-1">
                        {article.content.replace(/<[^>]*>/g, '').substring(0, 150)}...
                      </p>
                    </div>
                    <Button variant="ghost" size="icon" className="h-9 w-9">
                      <Bookmark className="h-4 w-4" />
                    </Button>
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
                      {article.comment_count} responses
                    </span>
                    
                    <span className="flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      {article.view_count || 0} views
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Avatar userId={article.author?.id} size={24} />
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
                  <Plus className="h-4 w-4 mr-2" />
                  Ask a Question
                </Button>
              </div>
            </Card>
          )}
        </div>
      </div>
    </Shell>
  );
};

export default CoreLandingPage;
