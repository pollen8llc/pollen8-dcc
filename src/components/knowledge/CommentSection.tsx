import React, { useState } from 'react';
import { useUser } from '@/contexts/UserContext';
import { usePermissions } from '@/hooks/usePermissions';
import { KnowledgeComment } from '@/models/knowledgeTypes';
import { formatDistanceToNow } from 'date-fns';
import { ThumbsUp, ThumbsDown, Check, Trash2, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Link } from 'react-router-dom';

interface CommentSectionProps {
  articleId: string;
  comments?: KnowledgeComment[];
  isArticleAuthor: boolean;
  isLoading: boolean;
  onVote: (commentId: string, voteType: 'upvote' | 'downvote', currentVote?: number | null) => void;
  onAccept: (commentId: string, isAccepted: boolean) => void;
  onDelete: (commentId: string) => void;
  onAddComment: (content: string) => Promise<void>;
}

export const CommentSection: React.FC<CommentSectionProps> = ({
  articleId,
  comments = [],
  isArticleAuthor,
  isLoading,
  onVote,
  onAccept,
  onDelete,
  onAddComment
}) => {
  const { currentUser } = useUser();
  const { isAdmin } = usePermissions(currentUser);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState<string | null>(null);
  
  // Handle comment submission
  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || isSubmitting) return;
    
    try {
      setIsSubmitting(true);
      await onAddComment(newComment);
      setNewComment('');
    } catch (error) {
      console.error('Error submitting comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Handle delete comment confirmation
  const confirmDeleteComment = () => {
    if (!commentToDelete) return;
    
    onDelete(commentToDelete);
    setCommentToDelete(null);
    setDeleteDialogOpen(false);
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
  
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">
          {isLoading ? 'Comments' : `${comments?.length || 0} ${comments?.length === 1 ? 'Comment' : 'Comments'}`}
        </h2>
      </div>
      
      {/* Comments List */}
      <div className="space-y-6">
        {isLoading ? (
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
                    {isArticleAuthor && (
                      <Button 
                        size="sm" 
                        variant={comment.is_accepted ? "default" : "outline"}
                        className={comment.is_accepted ? "bg-green-600 hover:bg-green-700" : ""}
                        onClick={() => onAccept(comment.id, !!comment.is_accepted)}
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
                        onClick={() => {
                          setCommentToDelete(comment.id);
                          setDeleteDialogOpen(true);
                        }}
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
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant={comment.user_vote === 1 ? "default" : "outline"}
                    className={comment.user_vote === 1 ? "bg-royal-blue-600 hover:bg-royal-blue-700" : ""}
                    onClick={() => onVote(comment.id, 'upvote', comment.user_vote)}
                  >
                    <ThumbsUp className="h-4 w-4 mr-1" />
                    {comment.vote_count && comment.vote_count > 0 ? comment.vote_count : ''}
                  </Button>
                  
                  <Button 
                    size="sm" 
                    variant={comment.user_vote === -1 ? "default" : "outline"}
                    className={comment.user_vote === -1 ? "bg-rose-600 hover:bg-rose-700" : ""}
                    onClick={() => onVote(comment.id, 'downvote', comment.user_vote)}
                  >
                    <ThumbsDown className="h-4 w-4" />
                  </Button>
                </div>
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
      
      {/* Delete Comment Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Comment</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this comment? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setCommentToDelete(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              className="bg-red-600 hover:bg-red-700"
              onClick={confirmDeleteComment}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
