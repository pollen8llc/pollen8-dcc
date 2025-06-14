
import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import Navbar from '@/components/Navbar';
import { useKnowledgeBase } from '@/hooks/useKnowledgeBase';
import { useUser } from '@/contexts/UserContext';
import { usePermissions } from '@/hooks/usePermissions';
import DOMPurify from 'dompurify';
import {
  ChevronLeft,
  Edit,
  Share2,
  Bookmark,
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
import AuthorCard from '@/components/knowledge/AuthorCard';
import { VotingButtons } from '@/components/knowledge/VotingButtons';
import { CoreNavigation } from '@/components/rel8t/CoreNavigation';
import { PollVoting } from '@/components/knowledge/PollVoting';

// Mocks and types
import { ContentType, VoteType } from '@/models/knowledgeTypes';
import { useSavedArticles } from '@/hooks/knowledge/useSavedArticles';

const ArticleView = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentUser } = useUser();
  const { isOrganizer, isAdmin } = usePermissions(currentUser);
  const { useArticle, vote, useComments, createComment, deleteComment, acceptAnswer, deleteArticle } = useKnowledgeBase();
  const { isArticleSaved, toggleSaveArticle } = useSavedArticles();

  console.log('ArticleView - Article ID from params:', id);
  
  // Fetch article
  const { data: article, isLoading: articleLoading, error: articleError } = useArticle(id || '');
  
  // Fetch comments
  const { data: comments, isLoading: commentsLoading } = useComments(id || '');
  
  // Check if current user can edit this article - ONLY the creator can edit
  const canEdit = currentUser && article && currentUser.id === article.user_id;
  
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
      await deleteArticle(article.id);
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
        <CoreNavigation />
        
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
            
            {/* Article title */}
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-4">
              {article.title}
            </h1>
            
            {/* Author and metadata */}
            <div className="flex items-center mb-6">
              <AuthorCard author={article.author} minimal={true} />
            </div>
            
            {/* Article content */}
            <Card>
              <CardContent className="pt-6">
                {article.content_type === ContentType.QUOTE ? (
                  <blockquote className="border-l-4 border-primary pl-4 italic">
                    <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(article.content) }} />
                  </blockquote>
                ) : article.content_type === ContentType.POLL && article.options ? (
                  <div className="space-y-4">
                    <div className="prose dark:prose-invert max-w-none">
                      <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(article.content) }} />
                    </div>
                    <PollVoting 
                      pollId={article.id} 
                      pollData={article.options}
                      isOwner={currentUser?.id === article.user_id}
                    />
                  </div>
                ) : (
                  <div 
                    className="prose dark:prose-invert max-w-none"
                    dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(article.content) }} 
                  />
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
              <VotingButtons
                itemType="article"
                itemId={article.id}
                voteCount={article.vote_count}
                userVote={article.user_vote}
                size="default"
                showCount={true}
              />
              
              <div className="flex items-center space-x-2">
                <Button
                  variant={isArticleSaved(article.id) ? "secondary" : "outline"}
                  size="sm"
                  onClick={() => toggleSaveArticle(article.id)}
                >
                  <Bookmark className="h-4 w-4 mr-1" />
                  {isArticleSaved(article.id) ? "Unsave" : "Save"}
                </Button>
                
                <Button variant="outline" size="sm">
                  <Share2 className="h-4 w-4 mr-1" />
                  Share
                </Button>
                
                {canEdit && (
                  <Button variant="outline" size="sm" asChild>
                    <Link to={`/knowledge/${id}/edit`}>
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Link>
                  </Button>
                )}
                
                {currentUser?.id === article.user_id && (
                  <Button variant="destructive" size="sm" onClick={handleDeleteArticle} className="ml-2">
                    Delete
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
            </div>
            
            <Separator className="my-8" />
            
            {/* Comments section */}
            <CommentSection 
              articleId={id}
              comments={comments}
              isArticleAuthor={currentUser?.id === article.user_id}
              isLoading={commentsLoading}
              onVote={handleCommentVote}
              onAccept={handleAcceptAnswer}
              onDelete={handleDeleteComment}
              onAddComment={handleAddComment}
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
            {article.tags && article.tags.length > 0 && (
              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-lg font-medium mb-3">Tags</h3>
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
