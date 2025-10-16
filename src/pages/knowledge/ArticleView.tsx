
import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { useQueryClient } from '@tanstack/react-query';
import Navbar from '@/components/Navbar';
import { useKnowledgeBase } from '@/hooks/useKnowledgeBase';
import { useUser } from '@/contexts/UserContext';
import { usePermissions } from '@/hooks/usePermissions';
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
import { Avatar } from '@/components/ui/avatar';
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
import { VotingButtons } from '@/components/knowledge/VotingButtons';
import { ModernPollVoting } from '@/components/knowledge/ModernPollVoting';

// Mocks and types
import { ContentType, VoteType } from '@/models/knowledgeTypes';
import { useSavedArticles } from '@/hooks/knowledge/useSavedArticles';

const ArticleView = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { currentUser } = useUser();
  const { isOrganizer, isAdmin } = usePermissions(currentUser);
  const { useArticle, vote, useComments, createComment, deleteComment, acceptAnswer, useDeleteArticle } = useKnowledgeBase();
  const deleteArticleMutation = useDeleteArticle();
  const { isArticleSaved, toggleSaveArticle } = useSavedArticles();

  console.log('ArticleView - Article ID from params:', id);
  
  // Fetch article
  const { data: article, isLoading: articleLoading, error: articleError } = useArticle(id || '');
  
  // Fetch comments
  const { data: comments, isLoading: commentsLoading } = useComments(id || '');

  // Increment view count when article loads
  useEffect(() => {
    const incrementViewCount = async () => {
      if (article?.id) {
        try {
          await supabase.rpc('increment_view_count', { article_id: article.id });
          // Invalidate the article query to refresh the view count
          queryClient.invalidateQueries({ queryKey: ['knowledgeArticle', article.id] });
        } catch (error) {
          console.error('Failed to increment view count:', error);
        }
      }
    };

    incrementViewCount();
  }, [article?.id, queryClient]);
  
  // Check if current user can edit this article - ONLY the creator can edit
  const canEdit = currentUser && article && currentUser.id === article.author_id;
  
  // Handle comment voting
  const handleCommentVote = (commentId: string, voteType: 'upvote' | 'downvote', currentVote?: number | null) => {
    vote('comment', commentId, voteType);
  };
  
  // Handle adding a comment
  const handleAddComment = async (content: string) => {
    if (!id) return;
    await createComment(id, content);
  };
  
  // Handle accepting an answer
  const handleAcceptAnswer = (commentId: string, isAccepted: boolean) => {
    if (!id) return;
    acceptAnswer(commentId, id, !isAccepted);
  };
  
  // Handle deleting a comment
  const handleDeleteComment = (commentId: string) => {
    if (!id) return;
    deleteComment(commentId, id);
  };

  const handleDeleteArticle = async () => {
    if (!window.confirm('Are you sure you want to delete this article? This action cannot be undone.')) return;
    try {
      await deleteArticleMutation.mutateAsync(article.id);
      navigate('/knowledge');
    } catch (err) {
      // Error toast is handled in the hook
    }
  };

  // Early return if no ID
  if (!id) {
    console.error('ArticleView - No article ID provided');
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-6 max-w-full">
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              No article ID provided
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

  if (articleLoading) {
    console.log('ArticleView - Loading article with ID:', id);
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
    console.error('ArticleView - Error or no article found:', articleError, 'ID:', id);
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
      
      <div className="container mx-auto px-4 py-4 sm:py-6 max-w-full">
        {/* Navigation */}
        <div className="mb-4 sm:mb-6">
          <Button variant="ghost" className="pl-0" asChild>
            <Link to="/knowledge">
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back to Knowledge Base
            </Link>
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {/* Main content */}
          <div className="md:col-span-2">
            {/* Content type badge */}
            <div className="mb-4">
              <Badge variant="outline" className="text-xs capitalize">
                {article.content_type.toLowerCase()}
              </Badge>
            </div>
            
            {/* Article title - Made teal */}
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-6 text-[#00eada] leading-tight">
              {article.title}
            </h1>
            
            {/* Author and metadata */}
            <div className="flex items-center mb-8">
              <AuthorCard author={article.author} minimal={true} />
            </div>
            
            {/* Article content */}
            <Card>
              <CardContent className="pt-8 pb-8">
                {article.content_type === ContentType.QUOTE ? (
                  <blockquote className="border-l-4 border-primary pl-6 py-4 italic text-white">
                    <div 
                      className="text-white leading-relaxed prose prose-lg max-w-none
                        [&_p]:text-white [&_p]:text-lg [&_p]:leading-relaxed [&_p]:mb-6 [&_p]:font-normal
                        [&_h1]:text-white [&_h1]:text-3xl [&_h1]:font-bold [&_h1]:leading-tight [&_h1]:mt-8 [&_h1]:mb-6 [&_h1:first-child]:mt-0
                        [&_h2]:text-white [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:leading-tight [&_h2]:mt-8 [&_h2]:mb-5
                        [&_h3]:text-white [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:leading-tight [&_h3]:mt-6 [&_h3]:mb-4
                        [&_h4]:text-white [&_h4]:text-lg [&_h4]:font-medium [&_h4]:leading-tight [&_h4]:mt-6 [&_h4]:mb-3
                        [&_h5]:text-white [&_h5]:text-base [&_h5]:font-medium [&_h5]:leading-tight [&_h5]:mt-4 [&_h5]:mb-3
                        [&_h6]:text-white [&_h6]:text-sm [&_h6]:font-medium [&_h6]:leading-tight [&_h6]:mt-4 [&_h6]:mb-2
                        [&_strong]:text-white [&_strong]:font-semibold
                        [&_em]:text-white [&_em]:italic
                        [&_li]:text-white [&_li]:text-lg [&_li]:leading-relaxed [&_li]:mb-2
                        [&_ul]:text-white [&_ul]:mb-6 [&_ul]:pl-6 [&_ul]:list-disc
                        [&_ol]:text-white [&_ol]:mb-6 [&_ol]:pl-6 [&_ol]:list-decimal
                        [&_blockquote]:text-white [&_blockquote]:border-l-4 [&_blockquote]:border-gray-300 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:my-6
                        [&_span]:text-white
                        [&_div]:text-white
                        [&_a]:text-[#00eada] [&_a]:underline [&_a:hover]:text-[#00c4b6] [&_a:hover]:no-underline
                        [&_code]:text-white [&_code]:bg-gray-800 [&_code]:px-2 [&_code]:py-1 [&_code]:rounded [&_code]:text-sm [&_code]:font-mono
                        [&_pre]:text-white [&_pre]:bg-gray-800 [&_pre]:p-4 [&_pre]:rounded-lg [&_pre]:overflow-x-auto [&_pre]:my-6 [&_pre]:border [&_pre]:border-gray-700
                        [&_table]:text-white [&_table]:border-collapse [&_table]:w-full [&_table]:my-6 [&_table]:border [&_table]:border-gray-600
                        [&_th]:text-white [&_th]:border [&_th]:border-gray-600 [&_th]:px-4 [&_th]:py-3 [&_th]:text-left [&_th]:font-semibold [&_th]:bg-gray-800
                        [&_td]:text-white [&_td]:border [&_td]:border-gray-600 [&_td]:px-4 [&_td]:py-3"
                      dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(article.content) }} 
                    />
                  </blockquote>
                ) : article.content_type === ContentType.POLL && article.options ? (
                  <div className="space-y-6">
                    <div className="text-white leading-relaxed prose prose-lg max-w-none
                      [&_p]:text-white [&_p]:text-lg [&_p]:leading-relaxed [&_p]:mb-6 [&_p]:font-normal
                      [&_h1]:text-white [&_h1]:text-3xl [&_h1]:font-bold [&_h1]:leading-tight [&_h1]:mt-8 [&_h1]:mb-6 [&_h1:first-child]:mt-0
                      [&_h2]:text-white [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:leading-tight [&_h2]:mt-8 [&_h2]:mb-5
                      [&_h3]:text-white [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:leading-tight [&_h3]:mt-6 [&_h3]:mb-4
                      [&_h4]:text-white [&_h4]:text-lg [&_h4]:font-medium [&_h4]:leading-tight [&_h4]:mt-6 [&_h4]:mb-3
                      [&_h5]:text-white [&_h5]:text-base [&_h5]:font-medium [&_h5]:leading-tight [&_h5]:mt-4 [&_h5]:mb-3
                      [&_h6]:text-white [&_h6]:text-sm [&_h6]:font-medium [&_h6]:leading-tight [&_h6]:mt-4 [&_h6]:mb-2
                      [&_strong]:text-white [&_strong]:font-semibold
                      [&_em]:text-white [&_em]:italic
                      [&_li]:text-white [&_li]:text-lg [&_li]:leading-relaxed [&_li]:mb-2
                      [&_ul]:text-white [&_ul]:mb-6 [&_ul]:pl-6 [&_ul]:list-disc
                      [&_ol]:text-white [&_ol]:mb-6 [&_ol]:pl-6 [&_ol]:list-decimal
                      [&_blockquote]:text-white [&_blockquote]:border-l-4 [&_blockquote]:border-gray-300 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:my-6
                      [&_span]:text-white
                      [&_div]:text-white
                      [&_a]:text-[#00eada] [&_a]:underline [&_a:hover]:text-[#00c4b6] [&_a:hover]:no-underline
                      [&_code]:text-white [&_code]:bg-gray-800 [&_code]:px-2 [&_code]:py-1 [&_code]:rounded [&_code]:text-sm [&_code]:font-mono
                      [&_pre]:text-white [&_pre]:bg-gray-800 [&_pre]:p-4 [&_pre]:rounded-lg [&_pre]:overflow-x-auto [&_pre]:my-6 [&_pre]:border [&_pre]:border-gray-700
                      [&_table]:text-white [&_table]:border-collapse [&_table]:w-full [&_table]:my-6 [&_table]:border [&_table]:border-gray-600
                      [&_th]:text-white [&_th]:border [&_th]:border-gray-600 [&_th]:px-4 [&_th]:py-3 [&_th]:text-left [&_th]:font-semibold [&_th]:bg-gray-800
                      [&_td]:text-white [&_td]:border [&_td]:border-gray-600 [&_td]:px-4 [&_td]:py-3">
                      <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(article.content) }} />
                    </div>
                    <ModernPollVoting 
                      pollId={article.id} 
                      pollData={article.options as any}
                      isOwner={currentUser?.id === article.author_id}
                    />
                  </div>
                ) : (
                  <div 
                    className="text-white leading-relaxed prose prose-lg max-w-none
                      [&_p]:text-white [&_p]:text-lg [&_p]:leading-relaxed [&_p]:mb-6 [&_p]:font-normal
                      [&_h1]:text-white [&_h1]:text-3xl [&_h1]:font-bold [&_h1]:leading-tight [&_h1]:mt-8 [&_h1]:mb-6 [&_h1:first-child]:mt-0
                      [&_h2]:text-white [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:leading-tight [&_h2]:mt-8 [&_h2]:mb-5
                      [&_h3]:text-white [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:leading-tight [&_h3]:mt-6 [&_h3]:mb-4
                      [&_h4]:text-white [&_h4]:text-lg [&_h4]:font-medium [&_h4]:leading-tight [&_h4]:mt-6 [&_h4]:mb-3
                      [&_h5]:text-white [&_h5]:text-base [&_h5]:font-medium [&_h5]:leading-tight [&_h5]:mt-4 [&_h5]:mb-3
                      [&_h6]:text-white [&_h6]:text-sm [&_h6]:font-medium [&_h6]:leading-tight [&_h6]:mt-4 [&_h6]:mb-2
                      [&_strong]:text-white [&_strong]:font-semibold
                      [&_em]:text-white [&_em]:italic
                      [&_li]:text-white [&_li]:text-lg [&_li]:leading-relaxed [&_li]:mb-2
                      [&_ul]:text-white [&_ul]:mb-6 [&_ul]:pl-6 [&_ul]:list-disc
                      [&_ol]:text-white [&_ol]:mb-6 [&_ol]:pl-6 [&_ol]:list-decimal
                      [&_blockquote]:text-white [&_blockquote]:border-l-4 [&_blockquote]:border-gray-300 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:my-6
                      [&_span]:text-white
                      [&_div]:text-white
                      [&_a]:text-[#00eada] [&_a]:underline [&_a:hover]:text-[#00c4b6] [&_a:hover]:no-underline
                      [&_code]:text-white [&_code]:bg-gray-800 [&_code]:px-2 [&_code]:py-1 [&_code]:rounded [&_code]:text-sm [&_code]:font-mono
                      [&_pre]:text-white [&_pre]:bg-gray-800 [&_pre]:p-4 [&_pre]:rounded-lg [&_pre]:overflow-x-auto [&_pre]:my-6 [&_pre]:border [&_pre]:border-gray-700
                      [&_table]:text-white [&_table]:border-collapse [&_table]:w-full [&_table]:my-6 [&_table]:border [&_table]:border-gray-600
                      [&_th]:text-white [&_th]:border [&_th]:border-gray-600 [&_th]:px-4 [&_th]:py-3 [&_th]:text-left [&_th]:font-semibold [&_th]:bg-gray-800
                      [&_td]:text-white [&_td]:border [&_td]:border-gray-600 [&_td]:px-4 [&_td]:py-3"
                    dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(article.content) }} 
                  />
                )}
                
                {/* Tags */}
                {article.tags && Array.isArray(article.tags) && article.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-8 pt-6 border-t border-gray-700">
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
            
            {/* Actions bar - Mobile optimized */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-6 mb-8">
              <VotingButtons
                itemType="article"
                itemId={article.id}
                voteCount={article.vote_count}
                userVote={article.user_vote}
                size="default"
                showCount={true}
              />
              
              {/* Action buttons - responsive layout */}
              <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                {/* Primary actions - always visible */}
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
                
                {/* Secondary actions - dropdown on mobile, inline on desktop */}
                {(canEdit || currentUser?.id === article.author_id) && (
                  <>
                    {/* Desktop view */}
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
                    
                    {/* Mobile view - dropdown */}
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
                <span>{article.view_count} views</span>
              </div>
              
              <div className="flex items-center">
                <MessageSquare className="h-4 w-4 mr-1" />
                <span>{article.comment_count || 0} comments</span>
              </div>
            </div>
            
            <Separator className="my-8" />
            
            {/* Enhanced Comments section */}
            <EnhancedCommentSection
              articleId={id}
              isArticleAuthor={currentUser?.id === article.author_id}
            />
          </div>
          
          {/* Sidebar */}
          <div className="md:col-span-1 space-y-6">
            {/* Author card */}
            <AuthorCard author={article.author} />
            
            {/* Related content */}
            <RelatedArticles 
              articles={[]} 
              isLoading={!!article.tags && articleLoading} 
            />
            
            {/* Popular tags */}
            {Array.isArray(article.tags) && article.tags.length > 0 && (
              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-lg font-medium mb-3 text-white">Tags</h3>
                  <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto pr-2">
                    {article.tags.map(tag => (
                      <Badge 
                        key={tag} 
                        className={
                          tag.toLowerCase() === 'quote'
                            ? 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900 dark:text-purple-200 dark:border-purple-800'
                            : 'cursor-pointer'
                        }
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
