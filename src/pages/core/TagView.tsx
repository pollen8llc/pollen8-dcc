
import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Shell } from '@/components/layout/Shell';
import { useKnowledgeBase } from '@/hooks/useKnowledgeBase';
import { useUser } from '@/contexts/UserContext';
import { usePermissions } from '@/hooks/usePermissions'; 
import { KnowledgeArticle } from '@/models/knowledgeTypes';
import { ArticleCard } from '@/components/knowledge/ArticleCard';
import { 
  Tag, 
  ChevronLeft, 
  X, 
  RefreshCcw, 
  PlusCircle, 
  MessageSquare, 
  Eye, 
  Calendar 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ContentTypeSelector } from '@/components/knowledge/ContentTypeSelector';
import { formatDistanceToNow } from 'date-fns';
import { 
  Card, 
  CardHeader, 
  CardContent, 
  CardFooter, 
  CardTitle 
} from '@/components/ui/card';

const TagView = () => {
  const { tag } = useParams<{ tag: string }>();
  const { currentUser } = useUser();
  const { isOrganizer, isAdmin } = usePermissions(currentUser);
  const { useArticles } = useKnowledgeBase();
  
  // Get articles with this tag
  const { data: articles, isLoading } = useArticles({ tag });
  
  const decodedTag = tag ? decodeURIComponent(tag) : '';
  
  return (
    <Shell>
      <div className="container mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Button variant="ghost" asChild className="pl-0">
            <Link to="/knowledge">
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back to Knowledge Base
            </Link>
          </Button>
        </div>
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <div className="flex items-center mb-2">
              <Tag className="mr-2 h-5 w-5 text-royal-blue-600 dark:text-royal-blue-400" />
              <h1 className="text-3xl font-bold tracking-tight">{decodedTag}</h1>
            </div>
            <p className="text-muted-foreground">
              Showing all articles tagged with "{decodedTag}"
            </p>
          </div>
          
          {(isOrganizer || isAdmin) && (
            <Button className="mt-4 md:mt-0 bg-royal-blue-600 hover:bg-royal-blue-700" asChild>
              <Link to="/knowledge/create">
                <PlusCircle className="mr-2 h-4 w-4" />
                New Article
              </Link>
            </Button>
          )}
        </div>
        
        {/* Articles List */}
        <div className="space-y-4">
          {isLoading ? (
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
          ) : articles && articles.length > 0 ? (
            <>
              {articles.map(article => (
                <Card key={article.id} className="transition-shadow hover:shadow-md cursor-pointer" onClick={() => window.location.href = `/knowledge/article/${article.id}`}>
                  <CardHeader>
                    <CardTitle className="text-xl hover:text-royal-blue-600 dark:hover:text-royal-blue-400 transition-colors">
                      {article.title}
                    </CardTitle>
                    <div className="flex flex-wrap gap-2">
                      {article.tags?.map(t => (
                        <Badge 
                          key={t} 
                          variant={t === decodedTag ? "default" : "outline"}
                          className={t === decodedTag ? "bg-royal-blue-500" : ""}
                        >
                          <Tag className="h-3 w-3 mr-1" />
                          {t}
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
                There are no articles with the tag "{decodedTag}"
              </p>
              
              {(isOrganizer || isAdmin) && (
                <Button asChild className="bg-royal-blue-600 hover:bg-royal-blue-700">
                  <Link to="/knowledge/create">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Create New Article
                  </Link>
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </Shell>
  );
};

export default TagView;
