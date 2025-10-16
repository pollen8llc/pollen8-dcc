
import React, { useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { useQueryClient } from '@tanstack/react-query';
import Navbar from '@/components/Navbar';
import { useKnowledgeBase } from '@/hooks/useKnowledgeBase';
import { useUser } from '@/contexts/UserContext';
import { supabase } from '@/integrations/supabase/client';
import DOMPurify from 'dompurify';
import {
  ChevronLeft,
  Edit,
  Share2,
  Bookmark,
  MessageSquare,
  Eye,
  Tag as TagIcon,
  AlertTriangle,
  MoreVertical
} from 'lucide-react';

// UI Components
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// Custom Components
import { EnhancedCommentSection } from '@/components/knowledge/EnhancedCommentSection';
import { RelatedArticles } from '@/components/knowledge/RelatedArticles';
import AuthorCard from '@/components/knowledge/AuthorCard';
import { ModernPollVoting } from '@/components/knowledge/ModernPollVoting';
import { Cultiva8OnlyNavigation } from '@/components/knowledge/Cultiva8OnlyNavigation';

// Types
import { ContentType } from '@/models/knowledgeTypes';
import { useSavedArticles } from '@/hooks/knowledge/useSavedArticles';

const ArticleView = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { currentUser } = useUser();
  const { useArticle, useDeleteArticle } = useKnowledgeBase();
  const deleteArticleMutation = useDeleteArticle();
  const { isArticleSaved, toggleSaveArticle } = useSavedArticles();

  console.log('ArticleView - Article ID from params:', id);
  
  // Fetch article
  const { data: article, isLoading: articleLoading, error: articleError } = useArticle(id || '');

  // Increment view count when article loads
  useEffect(() => {
    const incrementViewCount = async () => {
      if (article?.id) {
        try {
          await supabase.rpc('increment_view_count', { article_id: article.id });
          queryClient.invalidateQueries({ queryKey: ['knowledgeArticle', article.id] });
        } catch (error) {
          console.error('Failed to increment view count:', error);
        }
      }
    };

    incrementViewCount();
  }, [article?.id, queryClient]);
  
  // Check if current user can edit this article
  const canEdit = currentUser && article && currentUser.id === article.author_id;

  const handleDeleteArticle = async () => {
    if (!article) return;
    if (!window.confirm('Are you sure you want to delete this article? This action cannot be undone.')) return;
    try {
      await deleteArticleMutation.mutateAsync(article.id);
      navigate('/knowledge');
    } catch (err) {
      // Error toast is handled in the hook
    }
  };

  // Normalize tags to always be an array
  const tags = Array.isArray(article?.tags) ? article.tags : [];

  // Early return if no ID
  if (!id) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-6 max-w-full">
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>No article ID provided</AlertDescription>
          </Alert>
          <Button className="mt-4" variant="outline" asChild>
            <Link to="/knowledge">
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back to Knowledge Base
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  if (articleLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-6 max-w-full">
          <div className="animate-pulse space-y-4">
            <div className="h-8 w-3/4 bg-muted rounded"></div>
            <div className="h-4 w-1/4 bg-muted rounded"></div>
            <div className="h-64 bg-muted rounded"></div>
            <div className="h-4 w-1/2 bg-muted rounded"></div>
          </div>
        </div>
      </div>
    );
  }
  
  if (articleError || !article) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-6 max-w-full">
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              {articleError instanceof Error ? articleError.message : 'Failed to load article'}
            </AlertDescription>
          </Alert>
          <Button className="mt-4" variant="outline" asChild>
            <Link to="/knowledge">
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back to Knowledge Base
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  console.log('ArticleView - Successfully loaded article:', article.title);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-4 sm:py-6 max-w-full space-y-6">
        {/* Navigation - Full Width */}
        <Cultiva8OnlyNavigation />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {/* Main content */}
          <div className="md:col-span-2 space-y-6">
            {/* Content type badge and title */}
            <div>
              <Badge variant="outline" className="text-xs capitalize mb-4">
                {article.content_type?.toLowerCase() || 'article'}
              </Badge>
              
              {/* Article title */}
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#00eada] leading-tight">
                {article.title}
              </h1>
            </div>
            
            {/* Article content */}
            <Card>
              <CardContent className="pt-8 pb-8">
                {article.content_type === ContentType.QUOTE ? (
                  <blockquote className="border-l-4 border-primary pl-6 py-4 italic text-white">
                    <div 
                      className="text-white leading-relaxed prose prose-lg max-w-none"
                      dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(article.content || '') }} 
                    />
                  </blockquote>
                ) : article.content_type === ContentType.POLL && article.options ? (
                  <div className="space-y-6">
                    <div className="text-white leading-relaxed prose prose-lg max-w-none">
                      <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(article.content || '') }} />
                    </div>
                    <ModernPollVoting 
                      pollId={article.id} 
                      pollData={
                        Array.isArray(article.options)
                          ? { options: article.options, allowMultipleSelections: false, duration: "7" }
                          : article.options as any
                      }
                      isOwner={currentUser?.id === article.author_id}
                    />
                  </div>
                ) : (
                  <div 
                    className="text-white leading-relaxed prose prose-lg max-w-none"
                    dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(article.content || '') }} 
                  />
                )}
                
                {/* Tags */}
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-8 pt-6 border-t border-gray-700">
                    {tags.map((tag, index) => (
                      <Badge 
                        key={`${tag}-${index}`}
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
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-6 mb-8">
              {/* Action buttons */}
              <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                <div className="flex items-center gap-2">
                  <Button
                    variant={isArticleSaved(article.id) ? "secondary" : "outline"}
                    size="sm"
                    onClick={() => toggleSaveArticle(article.id)}
                    className="flex-shrink-0"
                  >
                    <Bookmark className="h-4 w-4 sm:mr-1" />
                    <span className="hidden sm:inline">
                      {isArticleSaved(article.id) ? "Unsave" : "Save"}
                    </span>
                  </Button>
                  
                  <Button variant="outline" size="sm" className="flex-shrink-0">
                    <Share2 className="h-4 w-4 sm:mr-1" />
                    <span className="hidden sm:inline">Share</span>
                  </Button>
                </div>
                
                {/* Edit/Delete actions */}
                {(canEdit || currentUser?.id === article.author_id) && (
                  <>
                    <div className="hidden sm:flex items-center gap-2">
                      {canEdit && (
                        <Button variant="outline" size="sm" asChild>
                          <Link to={`/knowledge/article/${id}/edit`}>
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </Link>
                        </Button>
                      )}
                      
                      {currentUser?.id === article.author_id && (
                        <Button variant="destructive" size="sm" onClick={handleDeleteArticle}>
                          Delete
                        </Button>
                      )}
                    </div>
                    
                    <div className="flex sm:hidden">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {canEdit && (
                            <DropdownMenuItem asChild>
                              <Link to={`/knowledge/article/${id}/edit`} className="flex items-center">
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                              </Link>
                            </DropdownMenuItem>
                          )}
                          {currentUser?.id === article.author_id && (
                            <DropdownMenuItem 
                              onClick={handleDeleteArticle}
                              className="flex items-center text-destructive focus:text-destructive"
                            >
                              Delete
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </>
                )}
              </div>
            </div>
            
            {/* Stats bar */}
            <div className="flex items-center text-sm text-white justify-center mb-6 space-x-6">
              <div className="flex items-center">
                <Eye className="h-4 w-4 mr-1" />
                <span>{article.view_count || 0} views</span>
              </div>
              
              <div className="flex items-center">
                <MessageSquare className="h-4 w-4 mr-1" />
                <span>{article.comment_count || 0} comments</span>
              </div>
            </div>
            
            <Separator className="my-8" />
            
            {/* Comments section */}
            <EnhancedCommentSection
              articleId={id}
              isArticleAuthor={currentUser?.id === article.author_id}
            />
          </div>
          
          {/* Sidebar */}
          <div className="md:col-span-1 space-y-6">
            {/* Author card */}
            {article.author && <AuthorCard author={article.author} />}
            
            {/* Related content */}
            <RelatedArticles 
              articles={[]} 
              isLoading={false} 
            />
            
            {/* Tags sidebar */}
            {tags.length > 0 && (
              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-lg font-medium mb-3 text-white">Tags</h3>
                  <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto pr-2">
                    {tags.map((tag, index) => (
                      <Badge 
                        key={`sidebar-${tag}-${index}`}
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
    </div>
  );
};

export default ArticleView;
