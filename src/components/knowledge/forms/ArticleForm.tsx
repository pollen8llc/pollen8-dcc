
import React, { useState, useEffect } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useKnowledgeBase } from '@/hooks/useKnowledgeBase';

// UI Components
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from '@/components/ui/badge';
import { TagInputField } from '@/components/knowledge/TagInputField';

// Validation schema
const articleFormSchema = z.object({
  title: z.string()
    .min(5, { message: "Title must be at least 5 characters" })
    .max(150, { message: "Title cannot be longer than 150 characters" }),
  subtitle: z.string().optional(),
  content: z.string()
    .min(50, { message: "Article content must be at least 50 characters" }),
  tags: z.array(z.string())
    .min(1, { message: "Please add at least 1 tag" })
    .max(5, { message: "You cannot add more than 5 tags" })
});

type ArticleFormValues = z.infer<typeof articleFormSchema>;

interface ArticleFormProps {
  onSubmit: (data: ArticleFormValues) => void;
  isSubmitting: boolean;
  step?: number;
  initialData?: Partial<ArticleFormValues>;
}

export const ArticleForm: React.FC<ArticleFormProps> = ({
  onSubmit,
  isSubmitting,
  step = 1,
  initialData
}) => {
  const { useTags } = useKnowledgeBase();
  const { data: availableTags } = useTags();
  const [popularTags, setPopularTags] = useState<Set<string>>(new Set());
  
  // Form setup
  const form = useForm<ArticleFormValues>({
    resolver: zodResolver(articleFormSchema),
    defaultValues: {
      title: initialData?.title || "",
      subtitle: initialData?.subtitle || "",
      content: initialData?.content || "",
      tags: initialData?.tags || [],
    },
  });
  
  // Update form when initialData changes
  useEffect(() => {
    if (initialData) {
      Object.entries(initialData).forEach(([key, value]) => {
        if (value !== undefined) {
          form.setValue(key as keyof ArticleFormValues, value);
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
  
  // Handle form submission
  const handleSubmit = (data: ArticleFormValues) => {
    onSubmit(data);
  };
  
  // Content to render based on step
  if (step === 2) {
    const formData = form.getValues();
    return (
      <div className="bg-card/50 border rounded-md p-6 space-y-6">
        <div>
          <h3 className="text-lg font-medium mb-2">Article Title</h3>
          <p className="p-4 bg-muted/50 rounded-md">{formData.title}</p>
        </div>
        
        {formData.subtitle && (
          <div>
            <h3 className="text-lg font-medium mb-2">Subtitle</h3>
            <p className="p-4 bg-muted/50 rounded-md">{formData.subtitle}</p>
          </div>
        )}
        
        <div>
          <h3 className="text-lg font-medium mb-2">Article Content</h3>
          <div className="p-4 bg-muted/50 rounded-md max-h-60 overflow-y-auto whitespace-pre-wrap">
            {formData.content}
          </div>
        </div>
        
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
      <form id="content-form" onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {/* Title field */}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Article Title</FormLabel>
              <FormControl>
                <Input 
                  placeholder="e.g. Building Strategic Networks in a Digital World" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {/* Subtitle field */}
        <FormField
          control={form.control}
          name="subtitle"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Subtitle (optional)</FormLabel>
              <FormControl>
                <Input 
                  placeholder="A brief description or subtitle for your article" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {/* Content field */}
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Article Content</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Write your article content here..." 
                  className="min-h-[300px] font-mono" 
                  {...field} 
                />
              </FormControl>
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
                  placeholder="Add tags relevant to your article"
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
