
import React from 'react';
import { Button } from '@/components/ui/button';
import { ContentType } from '@/models/knowledgeTypes';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';

interface ReviewContentProps {
  formData: any;
  contentType: ContentType;
  onSubmit: (data: any) => void;
  isSubmitting: boolean;
}

export const ReviewContent: React.FC<ReviewContentProps> = ({
  formData,
  contentType,
  onSubmit,
  isSubmitting
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  // Get content type label
  const getContentTypeLabel = () => {
    switch (contentType) {
      case ContentType.ARTICLE:
        return 'Article';
      case ContentType.QUESTION:
        return 'Question';
      case ContentType.QUOTE:
        return 'Quote';
      case ContentType.POLL:
        return 'Poll';
      default:
        return 'Content';
    }
  };

  // Get title based on content type
  const getTitle = () => {
    switch (contentType) {
      case ContentType.QUOTE:
        return formData.quote;
      case ContentType.POLL:
      case ContentType.QUESTION:
        return formData.question;
      case ContentType.ARTICLE:
      default:
        return formData.title;
    }
  };

  return (
    <form id="content-form" onSubmit={handleSubmit}>
      <div className="space-y-6">
        {/* Content type badge */}
        <div className="flex justify-between items-center">
          <Badge variant="secondary" className="text-xs px-2 py-0.5">
            {getContentTypeLabel()}
          </Badge>
        </div>

        {/* Title */}
        <div>
          <h3 className="text-xl font-semibold mb-2">{getTitle()}</h3>
          
          {/* Subtitle for articles */}
          {contentType === ContentType.ARTICLE && formData.subtitle && (
            <p className="text-lg text-muted-foreground mb-2">{formData.subtitle}</p>
          )}
          
          {/* Tags */}
          {formData.tags && formData.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.tags.map((tag: string) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>

        <Separator />

        {/* Content */}
        <div className="prose prose-sm max-w-none dark:prose-invert">
          {contentType === ContentType.ARTICLE && (
            <div>
              {formData.content && (
                <div dangerouslySetInnerHTML={{ __html: formData.content }} />
              )}
            </div>
          )}
          
          {contentType === ContentType.QUESTION && (
            <p className="whitespace-pre-wrap">{formData.content}</p>
          )}
          
          {contentType === ContentType.QUOTE && (
            <div>
              <blockquote className="italic border-l-4 border-muted-foreground/20 pl-4 mb-4">
                "{formData.quote}"
                {formData.author && (
                  <footer className="text-sm text-muted-foreground mt-2">
                    — {formData.author}
                  </footer>
                )}
              </blockquote>
              {formData.context && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium mb-2">Context:</h4>
                  <p className="whitespace-pre-wrap text-sm text-muted-foreground">{formData.context}</p>
                </div>
              )}
            </div>
          )}
          
          {contentType === ContentType.POLL && (
            <div>
              <p className="whitespace-pre-wrap mb-4">{formData.question}</p>
              <h4 className="text-sm font-medium mb-2">Options:</h4>
              <ul className="list-disc pl-5 space-y-1">
                {formData.options?.map((option: { text: string }, index: number) => (
                  <li key={index}>{option.text}</li>
                ))}
              </ul>
              {formData.allowMultipleSelections && (
                <p className="text-sm text-muted-foreground mt-2">
                  Multiple selections allowed
                </p>
              )}
              {formData.duration && (
                <p className="text-sm text-muted-foreground">
                  Duration: {formData.duration} days
                </p>
              )}
            </div>
          )}
        </div>

        <Separator />

        {/* Submit button */}
        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Publishing...' : 'Publish'}
          </Button>
        </div>
      </div>
    </form>
  );
};
