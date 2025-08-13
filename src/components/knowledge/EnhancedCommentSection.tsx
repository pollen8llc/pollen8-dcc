import React, { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { MentionInput } from './MentionInput';
import { useUser } from '@/contexts/UserContext';
import { useEnhancedComments, useEnhancedCommentMutations } from '@/hooks/knowledge/useEnhancedComments';
import { Check, Reply, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { KnowledgeComment } from '@/models/knowledgeTypes';

interface EnhancedCommentSectionProps {
  articleId: string;
  isArticleAuthor: boolean;
}

export const EnhancedCommentSection: React.FC<EnhancedCommentSectionProps> = ({
  articleId,
  isArticleAuthor
}) => {
  const { currentUser } = useUser();
  const { data: comments, isLoading } = useEnhancedComments(articleId);
  const { createComment, deleteComment, acceptAnswer, isSubmitting } = useEnhancedCommentMutations();
  
  const [newComment, setNewComment] = useState('');
  const [newCommentMentions, setNewCommentMentions] = useState<string[]>([]);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [replyMentions, setReplyMentions] = useState<string[]>([]);
  const [expandedReplies, setExpandedReplies] = useState<Set<string>>(new Set());
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const getInitials = (name?: string) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const canDeleteComment = (comment: KnowledgeComment) => {
    return currentUser && comment.user_id === currentUser.id;
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || isSubmitting) return;

    try {
      await createComment({
        articleId,
        content: newComment,
        mentions: newCommentMentions
      });
      setNewComment('');
      setNewCommentMentions([]);
    } catch (error) {
      console.error('Error posting comment:', error);
    }
  };

  const handleReplySubmit = async (parentCommentId: string) => {
    if (!replyContent.trim() || isSubmitting) return;

    try {
      await createComment({
        articleId,
        content: replyContent,
        parentCommentId,
        mentions: replyMentions
      });
      setReplyContent('');
      setReplyMentions([]);
      setReplyingTo(null);
    } catch (error) {
      console.error('Error posting reply:', error);
    }
  };


  const toggleReplies = (commentId: string) => {
    const newExpanded = new Set(expandedReplies);
    if (newExpanded.has(commentId)) {
      newExpanded.delete(commentId);
    } else {
      newExpanded.add(commentId);
    }
    setExpandedReplies(newExpanded);
  };

  const renderMentions = (content: string) => {
    const mentionRegex = /@\[([^\]]+)\]\(([^)]+)\)/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = mentionRegex.exec(content)) !== null) {
      if (match.index > lastIndex) {
        parts.push(content.slice(lastIndex, match.index));
      }
      
      parts.push(
        <span key={match.index} className="text-primary font-medium">
          @{match[1]}
        </span>
      );
      
      lastIndex = match.index + match[0].length;
    }
    
    if (lastIndex < content.length) {
      parts.push(content.slice(lastIndex));
    }
    
    return parts;
  };

  const renderComment = (comment: KnowledgeComment, isReply = false) => (
    <Card key={comment.id} className={cn("", isReply && "ml-8 mt-2")}>
      <CardContent className="p-4">
        <div className="flex items-start space-x-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={comment.author?.avatar_url} />
            <AvatarFallback className="text-xs">
              {getInitials(comment.author?.name)}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <p className="text-sm font-medium text-foreground">
                  {comment.author?.name || 'Anonymous'}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                </p>
                {comment.is_accepted && (
                  <Badge variant="default" className="text-xs">
                    <Check className="h-3 w-3 mr-1" />
                    Accepted Answer
                  </Badge>
                )}
              </div>
              
              <div className="flex items-center space-x-1">
                {isArticleAuthor && !isReply && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => acceptAnswer(comment.id, articleId, !comment.is_accepted)}
                    className="text-xs"
                  >
                    <Check className="h-3 w-3" />
                    {comment.is_accepted ? 'Unaccept' : 'Accept'}
                  </Button>
                )}
                
                {canDeleteComment(comment) && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setDeleteConfirmId(comment.id)}
                    className="text-xs text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                )}
              </div>
            </div>
            
            <div className="mt-2">
              <p className="text-sm text-foreground whitespace-pre-wrap">
                {renderMentions(comment.content)}
              </p>
            </div>
            
            <div className="flex items-center justify-between mt-3">
              <div className="flex items-center space-x-2">
                {!isReply && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                    className="text-xs"
                  >
                    <Reply className="h-3 w-3 mr-1" />
                    Reply
                  </Button>
                )}
              </div>
              
              {!isReply && comment.reply_count > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleReplies(comment.id)}
                  className="text-xs"
                >
                  {expandedReplies.has(comment.id) ? (
                    <>
                      <ChevronUp className="h-3 w-3 mr-1" />
                      Hide {comment.reply_count} {comment.reply_count === 1 ? 'reply' : 'replies'}
                    </>
                  ) : (
                    <>
                      <ChevronDown className="h-3 w-3 mr-1" />
                      View {comment.reply_count} {comment.reply_count === 1 ? 'reply' : 'replies'}
                    </>
                  )}
                </Button>
              )}
            </div>
            
            {replyingTo === comment.id && (
              <div className="mt-3">
                <MentionInput
                  value={replyContent}
                  onChange={(value, mentions) => {
                    setReplyContent(value);
                    setReplyMentions(mentions);
                  }}
                  placeholder={`Reply to ${comment.author?.name}...`}
                  className="mb-2"
                />
                <div className="flex gap-2">
                  <Button
                    onClick={() => handleReplySubmit(comment.id)}
                    disabled={!replyContent.trim() || isSubmitting}
                    size="sm"
                  >
                    {isSubmitting ? 'Posting...' : 'Post Reply'}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setReplyingTo(null);
                      setReplyContent('');
                      setReplyMentions([]);
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
      
      {expandedReplies.has(comment.id) && comment.replies && comment.replies.length > 0 && (
        <div className="border-t">
          {comment.replies.map(reply => renderComment(reply, true))}
        </div>
      )}
    </Card>
  );

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex space-x-3">
              <div className="rounded-full bg-muted h-8 w-8"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-muted rounded w-1/4"></div>
                <div className="h-4 bg-muted rounded w-3/4"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">
        Comments ({comments?.length || 0})
      </h3>
      
      {/* New Comment Form */}
      {currentUser ? (
        <Card>
          <CardContent className="p-4">
            <form onSubmit={handleCommentSubmit} className="space-y-3">
              <MentionInput
                value={newComment}
                onChange={(value, mentions) => {
                  setNewComment(value);
                  setNewCommentMentions(mentions);
                }}
                placeholder="Share your thoughts... Use @ to mention other users"
              />
              <Button
                type="submit"
                disabled={!newComment.trim() || isSubmitting}
              >
                {isSubmitting ? 'Posting...' : 'Post Comment'}
              </Button>
            </form>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-muted-foreground">
              Please sign in to join the discussion
            </p>
          </CardContent>
        </Card>
      )}
      
      {/* Comments List */}
      <div className="space-y-4">
        {comments && comments.length > 0 ? (
          comments.map(comment => renderComment(comment))
        ) : (
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-muted-foreground">
                No comments yet. Be the first to share your thoughts!
              </p>
            </CardContent>
          </Card>
        )}
      </div>
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteConfirmId} onOpenChange={() => setDeleteConfirmId(null)}>
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
              onClick={async () => {
                if (deleteConfirmId) {
                  await deleteComment(deleteConfirmId, articleId);
                  setDeleteConfirmId(null);
                }
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};