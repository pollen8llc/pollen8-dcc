
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
    onSubmit({});
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
          <h3 className="text-xl font-semibold mb-2">{formData.title}</h3>
          
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
            <div dangerouslySetInnerHTML={{ __html: formData.content }} />
          )}
          
          {contentType === ContentType.QUESTION && (
            <p className="whitespace-pre-wrap">{formData.content}</p>
          )}
          
          {contentType === ContentType.QUOTE && (
            <blockquote className="italic border-l-4 border-muted-foreground/20 pl-4">
              "{formData.content}"
              {formData.source && (
                <footer className="text-sm text-muted-foreground mt-2">
                  — {formData.source}
                </footer>
              )}
            </blockquote>
          )}
          
          {contentType === ContentType.POLL && (
            <div>
              <p className="whitespace-pre-wrap mb-4">{formData.content}</p>
              <h4 className="text-sm font-medium mb-2">Options:</h4>
              <ul className="list-disc pl-5 space-y-1">
                {formData.options?.map((option: string, index: number) => (
                  <li key={index}>{option}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <Separator />

        {/* Submit button - this will be controlled by the parent component */}
        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Publishing...' : 'Publish'}
          </Button>
        </div>
      </div>
    </form>
  );
};
