
import React, { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { Shell } from '@/components/layout/Shell';
import { useQuery } from '@tanstack/react-query';
import {
  ChevronLeft,
  Edit,
  Share2,
  Bookmark,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  Eye,
  Tag as TagIcon,
  AlertTriangle
} from 'lucide-react';

// UI Components
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

// Custom Components
import { CommentSection } from '@/components/knowledge/CommentSection';
import { RelatedArticles } from '@/components/knowledge/RelatedArticles';

// Mocks and types
import { getMockArticles } from '@/data/mockKnowledgeData';
import { ContentType } from '@/models/knowledgeTypes';
import { usePermissions } from '@/hooks/usePermissions';
import { useUser } from '@/contexts/UserContext';

const ArticleView = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentUser } = useUser();
  const { isOrganizer, isAdmin } = usePermissions(currentUser);
  
  // State
  const [userVote, setUserVote] = useState<'up' | 'down' | null>(null);
  
  // Fetch article
  const { data: article, isLoading, error } = useQuery({
    queryKey: ['knowledgeArticle', id],
    queryFn: async () => {
      const articles = await getMockArticles();
      const article = articles.find(a => a.id === id);
      if (!article) {
        throw new Error('Article not found');
      }
      return article;
    },
    enabled: !!id
  });
  
  // Fetch related articles
  const { data: relatedArticles } = useQuery({
    queryKey: ['relatedArticles', article?.tags],
    queryFn: async () => {
      if (!article?.tags || article.tags.length === 0) return [];
      const allArticles = await getMockArticles();
      return allArticles
        .filter(a => 
          a.id !== article.id && 
          a.tags && 
          a.tags.some(tag => article.tags?.includes(tag))
        )
        .slice(0, 3);
    },
    enabled: !!article?.tags
  });
  
  // Handle voting
  const handleVote = (vote: 'up' | 'down') => {
    setUserVote(userVote === vote ? null : vote);
  };

  if (isLoading) {
    return (
      <Shell>
        <div className="container mx-auto px-4 py-6">
          <div className="animate-pulse space-y-4">
            <div className="h-8 w-3/4 bg-muted rounded"></div>
            <div className="h-4 w-1/4 bg-muted rounded"></div>
            <div className="h-64 bg-muted rounded"></div>
            <div className="h-4 w-1/2 bg-muted rounded"></div>
          </div>
        </div>
      </Shell>
    );
  }
  
  if (error || !article) {
    return (
      <Shell>
        <div className="container mx-auto px-4 py-6">
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              {error instanceof Error ? error.message : 'Failed to load article'}
            </AlertDescription>
          </Alert>
          
          <Button className="mt-4" variant="outline" asChild>
            <Link to="/knowledge">
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back to Knowledge Base
            </Link>
          </Button>
        </div>
      </Shell>
    );
  }

  return (
    <Shell>
      <div className="container mx-auto px-4 py-6">
        {/* Navigation */}
        <div className="mb-6">
          <Button variant="ghost" className="pl-0" asChild>
            <Link to="/knowledge">
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back to Knowledge Base
            </Link>
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="md:col-span-2">
            {/* Content type badge */}
            <div className="mb-4">
              <Badge variant="outline" className="text-xs capitalize">
                {article.content_type.toLowerCase()}
              </Badge>
            </div>
            
            {/* Article title */}
            <h1 className="text-3xl font-bold tracking-tight mb-4">
              {article.title}
            </h1>
            
            {/* Author and metadata */}
            <div className="flex items-center mb-6">
              <Avatar className="h-10 w-10">
                <AvatarImage src={article.author?.avatar_url} />
                <AvatarFallback>
                  {article.author?.name.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              
              <div className="ml-3">
                <p className="text-sm font-medium">{article.author?.name || 'Anonymous'}</p>
                <p className="text-xs text-muted-foreground">
                  Posted {formatDistanceToNow(new Date(article.created_at), { addSuffix: true })}
                </p>
              </div>
            </div>
            
            {/* Article content */}
            <Card>
              <CardContent className="pt-6">
                {article.content_type === ContentType.QUOTE ? (
                  <blockquote className="border-l-4 border-primary pl-4 italic">
                    <div dangerouslySetInnerHTML={{ __html: article.content }} />
                  </blockquote>
                ) : (
                  <div dangerouslySetInnerHTML={{ __html: article.content }} />
                )}
                
                {/* Tags */}
                {article.tags && article.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-6">
                    {article.tags.map(tag => (
                      <Badge 
                        key={tag} 
                        variant="outline" 
                        className="cursor-pointer hover:bg-muted"
                        onClick={() => navigate(`/knowledge/tags/${tag}`)}
                      >
                        <TagIcon className="h-3 w-3 mr-1" />
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
            
            {/* Actions bar */}
            <div className="flex items-center justify-between mt-4 mb-8">
              <div className="flex items-center space-x-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleVote('up')} 
                  className={userVote === 'up' ? 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900 dark:text-green-200 dark:border-green-800' : ''}
                >
                  <ThumbsUp className="h-4 w-4 mr-1" />
                  {article.vote_count || 0}
                </Button>
                
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleVote('down')}
                  className={userVote === 'down' ? 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900 dark:text-red-200 dark:border-red-800' : ''}
                >
                  <ThumbsDown className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm">
                  <Bookmark className="h-4 w-4 mr-1" />
                  Save
                </Button>
                
                <Button variant="outline" size="sm">
                  <Share2 className="h-4 w-4 mr-1" />
                  Share
                </Button>
                
                {(isAdmin || isOrganizer || currentUser?.id === article.user_id) && (
                  <Button variant="outline" size="sm" asChild>
                    <Link to={`/knowledge/${id}/edit`}>
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Link>
                  </Button>
                )}
              </div>
            </div>
            
            {/* Stats bar */}
            <div className="flex items-center text-sm text-muted-foreground justify-center mb-6 space-x-6">
              <div className="flex items-center">
                <Eye className="h-4 w-4 mr-1" />
                <span>{article.view_count} views</span>
              </div>
              
              <div className="flex items-center">
                <MessageSquare className="h-4 w-4 mr-1" />
                <span>{article.comment_count || 0} comments</span>
              </div>
              
              <div className="flex items-center">
                <ThumbsUp className="h-4 w-4 mr-1" />
                <span>{article.vote_count || 0} votes</span>
              </div>
            </div>
            
            <Separator className="my-8" />
            
            {/* Comments section - for demonstration only, would be fully implemented */}
            <div className="mt-8">
              <h2 className="text-lg font-medium mb-4">Comments</h2>
              
              <p className="text-muted-foreground text-center py-8">
                Comment functionality would be implemented here
              </p>
            </div>
          </div>
          
          {/* Sidebar */}
          <div className="md:col-span-1 space-y-6">
            {/* Author card */}
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg font-medium mb-3">About the Author</h3>
                <div className="flex items-center">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={article.author?.avatar_url} />
                    <AvatarFallback>
                      {article.author?.name.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="ml-3">
                    <p className="font-medium">{article.author?.name || 'Anonymous'}</p>
                    {article.author?.role && (
                      <Badge variant="outline" className="text-xs mt-1 capitalize">
                        {article.author.role.toLowerCase()}
                      </Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Related content */}
            {relatedArticles && relatedArticles.length > 0 && (
              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-lg font-medium mb-3">Related Content</h3>
                  <div className="space-y-4">
                    {relatedArticles.map(related => (
                      <Link 
                        key={related.id} 
                        to={`/knowledge/${related.id}`}
                        className="block hover:underline text-sm"
                      >
                        {related.title}
                        <div className="text-xs text-muted-foreground mt-1">
                          {related.comment_count || 0} comments • {formatDistanceToNow(new Date(related.created_at), { addSuffix: true })}
                        </div>
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
            
            {/* Popular tags */}
            {article.tags && article.tags.length > 0 && (
              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-lg font-medium mb-3">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {article.tags.map(tag => (
                      <Badge 
                        key={tag} 
                        className="cursor-pointer"
                        onClick={() => navigate(`/knowledge/tags/${tag}`)}
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </Shell>
  );
};

export default ArticleView;
