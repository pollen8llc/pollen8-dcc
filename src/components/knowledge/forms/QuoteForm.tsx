
import React, { useState, useEffect } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useKnowledgeBase } from '@/hooks/useKnowledgeBase';
import { KnowledgeTag } from '@/models/knowledgeTypes';

// UI Components
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { TagInputField } from '@/components/knowledge/TagInputField';
import { Badge } from '@/components/ui/badge';

// Validation schema
const quoteFormSchema = z.object({
  quote: z.string()
    .min(5, { message: "Quote must be at least 5 characters" })
    .max(300, { message: "Quote cannot be longer than 300 characters" }),
  author: z.string()
    .min(2, { message: "Author name must be at least 2 characters" }),
  context: z.string().optional(),
  tags: z.array(z.string())
    .min(1, { message: "Please add at least 1 tag" })
    .max(5, { message: "You cannot add more than 5 tags" })
});

type QuoteFormValues = z.infer<typeof quoteFormSchema>;

interface QuoteFormProps {
  onSubmit: (data: QuoteFormValues) => void;
  isSubmitting: boolean;
  step?: number;
  initialData?: Partial<QuoteFormValues>;
}

export const QuoteForm: React.FC<QuoteFormProps> = ({ 
  onSubmit, 
  isSubmitting,
  step = 1,
  initialData
}) => {
  const { useTags } = useKnowledgeBase();
  const { data: availableTags } = useTags();
  const [popularTags, setPopularTags] = useState<Set<string>>(new Set());
  
  // Merge provided initial data with defaults
  const defaultValues = {
    quote: initialData?.quote || "",
    author: initialData?.author || "",
    context: initialData?.context || "",
    tags: initialData?.tags || [],
  };
  
  // Form setup
  const form = useForm<QuoteFormValues>({
    resolver: zodResolver(quoteFormSchema),
    defaultValues
  });
  
  // Update form when initialData changes
  useEffect(() => {
    if (initialData) {
      Object.entries(initialData).forEach(([key, value]) => {
        if (value !== undefined) {
          form.setValue(key as keyof QuoteFormValues, value);
        }
      });
    }
  }, [initialData, form]);

  // Identify popular tags
  useEffect(() => {
    if (availableTags) {
      const sortedTags = [...availableTags].sort((a, b) => (b.count || 0) - (a.count || 0));
      const popularThreshold = Math.ceil(sortedTags.length / 4);
      const popular = new Set(sortedTags.slice(0, popularThreshold).map(tag => tag.name));
      setPopularTags(popular);
    }
  }, [availableTags]);
  
  const handleSubmit = (values: QuoteFormValues) => {
    onSubmit(values);
  };
  
  // Content to render based on step
  if (step === 2) {
    const formData = form.getValues();
    return (
      <div className="bg-card/50 border rounded-md p-6 space-y-6">
        <div>
          <h3 className="text-lg font-medium mb-2">Quote</h3>
          <div className="p-4 bg-muted/50 rounded-md whitespace-pre-wrap italic">
            "{formData.quote}"
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-medium mb-2">Author</h3>
          <p className="p-4 bg-muted/50 rounded-md">{formData.author}</p>
        </div>
        
        {formData.context && (
          <div>
            <h3 className="text-lg font-medium mb-2">Context</h3>
            <div className="p-4 bg-muted/50 rounded-md whitespace-pre-wrap">
              {formData.context}
            </div>
          </div>
        )}
        
        <div>
          <h3 className="text-lg font-medium mb-2">Tags</h3>
          <div className="flex flex-wrap gap-2">
            {formData.tags.map(tag => (
              <Badge 
                key={tag} 
                variant={popularTags.has(tag) ? "popularTag" : "tag"}
                className="flex items-center gap-1 py-1.5 px-3 text-sm"
              >
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} id="content-form" className="space-y-6">
        {/* Quote text field */}
        <FormField
          control={form.control}
          name="quote"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Quote</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Enter the quote text..." 
                  className="min-h-[100px]"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {/* Author field */}
        <FormField
          control={form.control}
          name="author"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Author/Source</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Who said or wrote this quote?" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {/* Context field */}
        <FormField
          control={form.control}
          name="context"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Context (Optional)</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Add context or explain why this quote is meaningful..." 
                  className="min-h-[80px]"
                  {...field} 
                />
              </FormControl>
              <FormDescription>
                You can add background information or explain why you're sharing this quote
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {/* Tags field */}
        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tags</FormLabel>
              <FormControl>
                <TagInputField
                  value={field.value}
                  onChange={field.onChange}
                  availableTags={availableTags?.map(tag => tag.name) || []}
                  placeholder="Add a tag (e.g. leadership, community-building)"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};
