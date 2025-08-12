
import React from 'react';
import DOMPurify from 'dompurify';
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
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-6 text-[#00eada] leading-tight">{getTitle()}</h1>
            {contentType === ContentType.ARTICLE && formData.subtitle && (
              <p className="text-lg text-muted-foreground">{formData.subtitle}</p>
            )}

            <div className="rounded-lg border bg-card/50 p-6 sm:p-8">
              <div className="max-w-none">
                {contentType === ContentType.ARTICLE && (
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
                    dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(formData.content) }}
                  />
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
                    <div className="text-white leading-relaxed prose prose-lg max-w-none mb-4
                      [&_p]:text-white [&_p]:text-lg [&_p]:leading-relaxed [&_p]:mb-6 [&_p]:font-normal
                      [&_a]:text-[#00eada] [&_a]:underline [&_a:hover]:text-[#00c4b6] [&_a:hover]:no-underline">
                      <p className="whitespace-pre-wrap">{formData.question}</p>
                    </div>
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
