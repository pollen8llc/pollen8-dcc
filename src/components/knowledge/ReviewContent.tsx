
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
      <section className="space-y-6">
        {/* Top meta */}
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Badge variant="secondary" className="text-xs px-2 py-0.5">
              {getContentTypeLabel()}
            </Badge>
            {formData.tags && formData.tags.length > 0 && (
              <div className="hidden sm:flex flex-wrap gap-2">
                {formData.tags.map((tag: string) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade-in">
          {/* Main content */}
          <article className="lg:col-span-8 space-y-4">
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">{getTitle()}</h1>
            {contentType === ContentType.ARTICLE && formData.subtitle && (
              <p className="text-lg text-muted-foreground">{formData.subtitle}</p>
            )}

            <div className="rounded-lg border bg-card/50 p-4 sm:p-6">
              <div className="prose prose-sm sm:prose max-w-none dark:prose-invert">
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
                  <figure>
                    <blockquote className="italic border-l-4 border-primary/30 pl-4 sm:pl-6 text-lg sm:text-xl leading-relaxed">
                      “{formData.quote}”
                    </blockquote>
                    {formData.author && (
                      <figcaption className="text-sm text-muted-foreground mt-3">— {formData.author}</figcaption>
                    )}
                    {formData.context && (
                      <div className="mt-4 text-sm text-muted-foreground whitespace-pre-wrap">{formData.context}</div>
                    )}
                  </figure>
                )}

                {contentType === ContentType.POLL && (
                  <div>
                    <p className="whitespace-pre-wrap mb-4">{formData.question}</p>
                    <ul className="space-y-2">
                      {formData.options?.map((option: { text: string }, index: number) => (
                        <li key={index} className="flex items-center gap-3 rounded-md border bg-muted/20 px-3 py-2">
                          <span className="h-6 w-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs">{index + 1}</span>
                          <span>{option.text}</span>
                        </li>
                      ))}
                    </ul>
                    {formData.allowMultipleSelections && (
                      <p className="text-sm text-muted-foreground mt-3">Multiple selections allowed</p>
                    )}
                    {formData.duration && (
                      <p className="text-sm text-muted-foreground">Duration: {formData.duration} days</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </article>

          {/* Sidebar */}
          <aside className="lg:col-span-4">
            <div className="rounded-lg border bg-card/50 p-4 sm:p-6 space-y-4">
              <h4 className="text-sm font-medium">Details</h4>
              {formData.tags && formData.tags.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag: string) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No tags added</p>
              )}

              {contentType === ContentType.POLL && (
                <div className="text-sm text-muted-foreground space-y-1">
                  <div>Selections: {formData.allowMultipleSelections ? 'Multiple' : 'Single'}</div>
                  {formData.duration && <div>Duration: {formData.duration} days</div>}
                </div>
              )}
            </div>
          </aside>
        </div>

        {/* Submit button */}
        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Publishing...' : 'Publish'}
          </Button>
        </div>
      </section>
    </form>
  );
};
