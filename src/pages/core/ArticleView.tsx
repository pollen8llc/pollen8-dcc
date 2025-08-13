import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Shell } from '@/components/layout/Shell';
import { useKnowledgeBase } from '@/hooks/useKnowledgeBase';
import { useUser } from '@/contexts/UserContext';
import { usePermissions } from '@/hooks/usePermissions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent,
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle 
} from '@/components/ui/alert-dialog';
import { 
  ChevronLeft, 
  Edit, 
  Check, 
  Tag, 
  Trash2,
  MessageSquare,
  Calendar,
  Eye
} from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
import { VoteType } from '@/models/knowledgeTypes';
import DOMPurify from 'dompurify';
import AuthorCard from '@/components/knowledge/AuthorCard';
import { VotingButtons } from '@/components/knowledge/VotingButtons';

const ArticleView = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentUser } = useUser();
  const { isOrganizer, isAdmin } = usePermissions(currentUser);
  const knowledgeBase = useKnowledgeBase();

  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteCommentId, setDeleteCommentId] = useState<string | null>(null);

  // Fetch article data
  const { data: article, isLoading: articleLoading, error: articleError } = knowledgeBase.useArticle(id);
  
  // Fetch comments
  const { data: comments, isLoading: commentsLoading } = knowledgeBase.useComments(id);

  // Handle voting on comment
  const handleCommentVote = (commentId: string, voteType: VoteType, currentVote?: number | null) => {
    if (currentVote === 1 && voteType === 'upvote') {
      knowledgeBase.vote('comment', commentId, 'none');
    } else if (currentVote === -1 && voteType === 'downvote') {
      knowledgeBase.vote('comment', commentId, 'none');
    } else {
      knowledgeBase.vote('comment', commentId, voteType);
    }
  };

  // Handle comment submission
  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || isSubmitting) return;
    
    try {
      setIsSubmitting(true);
      await knowledgeBase.createComment(id!, newComment);
      setNewComment('');
    } catch (error) {
      console.error('Error submitting comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle delete article confirmation
  const confirmDeleteArticle = async () => {
    try {
      await knowledgeBase.deleteArticle(id!);
      navigate('/knowledge');
    } catch (error) {
      console.error('Error deleting article:', error);
    }
  };

  // Handle delete comment
  const handleDeleteComment = async () => {
    if (!deleteCommentId) return;
    
    try {
      await knowledgeBase.deleteComment(deleteCommentId, id!);
      setDeleteCommentId(null);
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  // Handle accepting a comment as answer
  const handleAcceptAnswer = (commentId: string, isAccepted: boolean) => {
    knowledgeBase.acceptAnswer(commentId, id!, !isAccepted);
  };

  // Generate initials for avatar
  const getInitials = (name?: string) => {
    if (!name) return '??';
    
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  // Show loading state
  if (articleLoading) {
    return (
      <Shell>
        <div className="container mx-auto px-4 py-6">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-3/4 mb-4"></div>
            <div className="h-6 bg-muted rounded w-1/4 mb-8"></div>
            <div className="h-4 bg-muted rounded w-full mb-2"></div>
            <div className="h-4 bg-muted rounded w-full mb-2"></div>
            <div className="h-4 bg-muted rounded w-5/6 mb-8"></div>
          </div>
        </div>
      </Shell>
    );
  }

  // Show error state
  if (articleError || !article) {
    return (
      <Shell>
        <div className="container mx-auto px-4 py-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Article Not Found</h2>
            <p className="mb-4">The article you're looking for might have been removed or doesn't exist.</p>
            <Button asChild>
              <Link to="/knowledge"><ChevronLeft className="mr-2 h-4 w-4" /> Back to Knowledge Base</Link>
            </Button>
          </div>
        </div>
      </Shell>
    );
  }

  // Determine if the current user can edit/delete the article
  const canEdit = isAdmin || isOrganizer || (currentUser && currentUser.id === article.user_id);
  const canDelete = isAdmin || (currentUser && currentUser.id === article.user_id);
  const isArticleOwner = currentUser && currentUser.id === article.user_id;

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
        
        {/* Article Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
            <h1 className="text-3xl font-bold tracking-tight">{article.title}</h1>
            
            <div className="flex gap-2 mt-4 md:mt-0">
              {canEdit && (
                <Button variant="outline" asChild>
                  <Link to={`/knowledge/article/${article.id}/edit`}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </Link>
                </Button>
              )}
              
              {canDelete && (
                <Button 
                  variant="destructive" 
                  onClick={() => setDeleteDialogOpen(true)}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </Button>
              )}
            </div>
          </div>
          
          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {article.tags?.map(tag => (
              <Badge key={tag} variant="outline">
                <Tag className="h-3 w-3 mr-1" />
                {tag}
              </Badge>
            ))}
          </div>
          
          {/* Article Meta */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center text-sm text-muted-foreground">
            <AuthorCard 
              author={{
                id: article.user_id,
                name: article.author?.name,
                avatar_url: article.author?.avatar_url,
                is_admin: article.author?.is_admin
              }} 
              minimal={true} 
            />
            
            <div className="flex items-center gap-4 mt-2 md:mt-0">
              <div className="flex items-center">
                <Eye className="h-4 w-4 mr-1" />
                <span>{article.view_count} views</span>
              </div>
              
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                <span>{format(new Date(article.updated_at), 'MMM d, yyyy')}</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Article Content */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div 
              className="prose dark:prose-invert max-w-none" 
              dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(article.content) }} 
            />
          </CardContent>
          
          <CardFooter className="flex flex-col md:flex-row justify-between border-t pt-4 gap-4">
            <div className="flex items-center">
              <span className="mr-2">Was this helpful?</span>
              <VotingButtons
                itemType="article"
                itemId={article.id}
                voteCount={article.vote_count}
                userVote={article.user_vote}
                size="sm"
                showCount={true}
              />
            </div>
            
            <div className="flex items-center text-sm text-muted-foreground">
              <span>Last updated {format(new Date(article.updated_at), 'MMM d, yyyy')}</span>
            </div>
          </CardFooter>
        </Card>
        
        {/* Comments Section */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold">
              {commentsLoading ? 'Comments' : `${comments?.length || 0} ${comments?.length === 1 ? 'Comment' : 'Comments'}`}
            </h2>
          </div>
          
          {/* Comments List */}
          <div className="space-y-6">
            {commentsLoading ? (
              <div className="space-y-6">
                {[1, 2].map(i => (
                  <div key={i} className="animate-pulse">
                    <div className="flex items-center mb-2">
                      <div className="rounded-full bg-muted h-10 w-10 mr-3"></div>
                      <div className="h-4 bg-muted rounded w-24"></div>
                    </div>
                    <div className="h-16 bg-muted rounded ml-12"></div>
                  </div>
                ))}
              </div>
            ) : comments?.length ? (
              comments.map(comment => (
                <Card key={comment.id} className={`${comment.is_accepted ? 'border-green-500 dark:border-green-500 border-2' : ''}`}>
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center">
                        <Avatar className="h-8 w-8 mr-2">
                          <AvatarImage src={comment.author?.avatar_url} alt={comment.author?.name} />
                          <AvatarFallback>{getInitials(comment.author?.name)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{comment.author?.name || 'Unknown User'}</p>
                          <p className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        {/* Accept Answer Button (visible only to article owner) */}
                        {isArticleOwner && (
                          <Button 
                            size="sm" 
                            variant={comment.is_accepted ? "default" : "outline"}
                            className={comment.is_accepted ? "bg-green-600 hover:bg-green-700" : ""}
                            onClick={() => handleAcceptAnswer(comment.id, comment.is_accepted)}
                          >
                            <Check className="h-4 w-4 mr-1" />
                            {comment.is_accepted ? 'Accepted' : 'Accept'}
                          </Button>
                        )}
                        
                        {/* Delete Comment Button */}
                        {(currentUser?.id === comment.user_id || isAdmin) && (
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="text-red-500 hover:text-red-600"
                            onClick={() => setDeleteCommentId(comment.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="prose dark:prose-invert max-w-none">
                      {comment.content}
                    </div>
                  </CardContent>
                  
                  <CardFooter className="flex justify-between pt-0">
                    {/* Comment voting removed */}
                  </CardFooter>
                </Card>
              ))
            ) : (
              <div className="text-center p-8">
                <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                <p className="text-muted-foreground">No comments yet. Be the first to comment!</p>
              </div>
            )}
          </div>
          
          {/* New Comment Form */}
          {currentUser ? (
            <div className="mt-8">
              <h3 className="text-lg font-medium mb-4">Add a Comment</h3>
              <form onSubmit={handleCommentSubmit}>
                <Textarea
                  placeholder="Write your comment here..."
                  className="min-h-32 mb-4"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                />
                <Button 
                  type="submit" 
                  disabled={!newComment.trim() || isSubmitting}
                  className="bg-royal-blue-600 hover:bg-royal-blue-700"
                >
                  {isSubmitting ? 'Submitting...' : 'Post Comment'}
                </Button>
              </form>
            </div>
          ) : (
            <div className="mt-8 text-center p-6 bg-muted/30 rounded-lg">
              <p className="mb-4">You need to be logged in to comment.</p>
              <Button asChild>
                <Link to="/auth">Sign In to Comment</Link>
              </Button>
            </div>
          )}
        </div>
        
        {/* Delete Article Confirmation Dialog */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the article
                and all associated comments.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction 
                className="bg-red-600 hover:bg-red-700"
                onClick={confirmDeleteArticle}
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        
        {/* Delete Comment Confirmation Dialog */}
        <AlertDialog open={!!deleteCommentId} onOpenChange={(open) => !open && setDeleteCommentId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Comment</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this comment? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction 
                className="bg-red-600 hover:bg-red-700"
                onClick={handleDeleteComment}
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </Shell>
  );
};

export default ArticleView;
