
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { MessageSquare, User } from 'lucide-react';
import { RequestComment } from '@/types/proposalCards';

interface CommentsSectionProps {
  comments: RequestComment[];
  newComment: string;
  setNewComment: (comment: string) => void;
  submitting: boolean;
  onAddComment: () => void;
  currentUserId?: string;
}

export const CommentsSection: React.FC<CommentsSectionProps> = ({
  comments,
  newComment,
  setNewComment,
  submitting,
  onAddComment,
  currentUserId
}) => {
  return (
    <Card className="bg-gray-900/80 backdrop-blur-sm border-gray-800">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-black text-white flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-primary" />
          Project Discussion
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Comments List */}
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {comments.length === 0 ? (
            <div className="text-center py-6 text-gray-400">
              <MessageSquare className="h-8 w-8 mx-auto mb-2 text-gray-600" />
              <p className="text-sm">No comments yet. Start the discussion!</p>
            </div>
          ) : (
            comments.map((comment) => (
              <div key={comment.id} className="flex gap-3 p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-primary/20 text-primary">
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-semibold text-white">
                      {comment.user_id === currentUserId ? 'You' : 'Other Party'}
                    </span>
                    <span className="text-xs text-gray-400">
                      {new Date(comment.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-300 leading-relaxed">{comment.content}</p>
                </div>
              </div>
            ))
          )}
        </div>
        
        {/* New Comment Form */}
        <Separator className="bg-gray-700" />
        <div className="space-y-3">
          <Textarea
            placeholder="Add a comment to the discussion..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="min-h-[80px] bg-gray-800 border-gray-700 text-white"
          />
          <div className="flex justify-end">
            <Button
              onClick={onAddComment}
              disabled={submitting || !newComment.trim()}
              size="sm"
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
            >
              {submitting ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-primary-foreground" />
                  Adding...
                </div>
              ) : (
                <>
                  <MessageSquare className="h-4 w-4 mr-1" />
                  Add Comment
                </>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
