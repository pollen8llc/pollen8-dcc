
import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Shell } from '@/components/layout/Shell';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ChevronLeft, Calendar, User, Eye, MessageSquare, Archive, ArchiveRestore } from 'lucide-react';
import { useKnowledgeBase } from '@/hooks/useKnowledgeBase';
import { useAuth } from '@/hooks/useAuth';
import { CommentSection } from '@/components/knowledge/CommentSection';
import { PollVoting } from '@/components/knowledge/PollVoting';
import { ContentType } from '@/models/knowledgeTypes';
import { format } from 'date-fns';

const ArticleView = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { useArticle, archiveArticle, unarchiveArticle } = useKnowledgeBase();
  
  const { data: article, isLoading, error } = useArticle(id!);

  // Increment view count when article is loaded
  useEffect(() => {
    if (article && id) {
      // Call increment view count function
      // This could be done via a separate API call or edge function
    }
  }, [article, id]);

  if (isLoading) {
    return (
      <Shell>
        <div className="container mx-auto px-4 py-6">
          <div className="max-w-4xl mx-auto">
            <div className="animate-pulse">
              <div className="h-8 bg-muted rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-muted rounded w-1/2 mb-6"></div>
              <div className="space-y-3">
                <div className="h-4 bg-muted rounded"></div>
                <div className="h-4 bg-muted rounded"></div>
                <div className="h-4 bg-muted rounded w-5/6"></div>
              </div>
            </div>
          </div>
        </div>
      </Shell>
    );
  }

  if (error || !article) {
    return (
      <Shell>
        <div className="container mx-auto px-4 py-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-2xl font-bold mb-4">Article Not Found</h1>
            <p className="text-muted-foreground mb-6">
              The article you're looking for doesn't exist or has been removed.
            </p>
            <Button onClick={() => navigate('/knowledge')}>
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back to Knowledge Base
            </Button>
          </div>
        </div>
      </Shell>
    );
  }

  const isOwner = user?.id === article.user_id;
  const contentType = article.content_type as ContentType;

  const handleArchive = async () => {
    try {
      if (article.archived_at) {
        await unarchiveArticle(article.id);
      } else {
        await archiveArticle(article.id);
      }
    } catch (error) {
      console.error('Error toggling archive status:', error);
    }
  };

  const renderContent = () => {
    switch (contentType) {
      case ContentType.QUOTE:
        return (
          <div className="space-y-6">
            <blockquote className="text-xl italic border-l-4 border-primary pl-6 py-4">
              "{article.title}"
              {article.source && (
                <footer className="text-base text-muted-foreground mt-2 not-italic">
                  — {article.source}
                </footer>
              )}
            </blockquote>
            {article.content && (
              <div>
                <h3 className="text-lg font-semibold mb-2">Context</h3>
                <div className="prose prose-sm max-w-none dark:prose-invert">
                  <p className="whitespace-pre-wrap">{article.content}</p>
                </div>
              </div>
            )}
          </div>
        );

      case ContentType.POLL:
        const pollData = article.options as any;
        return (
          <div className="space-y-6">
            <div className="prose prose-sm max-w-none dark:prose-invert">
              <p className="text-lg">{article.content}</p>
            </div>
            <PollVoting 
              pollId={article.id} 
              pollData={pollData} 
              isOwner={isOwner}
            />
          </div>
        );

      case ContentType.QUESTION:
        return (
          <div className="prose prose-sm max-w-none dark:prose-invert">
            <p className="whitespace-pre-wrap text-lg">{article.content}</p>
          </div>
        );

      case ContentType.ARTICLE:
      default:
        return (
          <div className="space-y-4">
            {article.subtitle && (
              <p className="text-xl text-muted-foreground">{article.subtitle}</p>
            )}
            <div className="prose prose-sm max-w-none dark:prose-invert">
              <div dangerouslySetInnerHTML={{ __html: article.content }} />
            </div>
          </div>
        );
    }
  };

  return (
    <Shell>
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-4xl mx-auto">
          {/* Navigation */}
          <div className="mb-6 flex items-center justify-between">
            <Button variant="ghost" className="pl-0" onClick={() => navigate('/knowledge')}>
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back to Knowledge Base
            </Button>
            
            {isOwner && (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleArchive}
                >
                  {article.archived_at ? (
                    <>
                      <ArchiveRestore className="mr-2 h-4 w-4" />
                      Unarchive
                    </>
                  ) : (
                    <>
                      <Archive className="mr-2 h-4 w-4" />
                      Archive
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate(`/knowledge/${id}/edit`)}
                >
                  Edit
                </Button>
              </div>
            )}
          </div>

          {/* Article Header */}
          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="secondary">
                  {contentType.charAt(0) + contentType.slice(1).toLowerCase()}
                </Badge>
                {article.archived_at && (
                  <Badge variant="outline">Archived</Badge>
                )}
              </div>
              
              <CardTitle className="text-2xl md:text-3xl">
                {article.title}
              </CardTitle>
              
              {/* Meta information */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  <span>
                    {article.author?.first_name} {article.author?.last_name}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>{format(new Date(article.created_at), 'MMM d, yyyy')}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  <span>{article.view_count || 0} views</span>
                </div>
                <div className="flex items-center gap-1">
                  <MessageSquare className="h-4 w-4" />
                  <span>{article.comment_count || 0} comments</span>
                </div>
              </div>

              {/* Tags */}
              {article.tags && article.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {article.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </CardHeader>
          </Card>

          {/* Article Content */}
          <Card className="mb-6">
            <CardContent className="p-6">
              {renderContent()}
            </CardContent>
          </Card>

          <Separator className="my-6" />

          {/* Comments Section */}
          <CommentSection articleId={article.id} />
        </div>
      </div>
    </Shell>
  );
};

export default ArticleView;
