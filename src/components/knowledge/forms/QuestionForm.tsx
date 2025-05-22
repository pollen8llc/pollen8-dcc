import React, { useState, useEffect } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useKnowledgeBase } from '@/hooks/useKnowledgeBase';

// UI Components
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { TagInputField } from '@/components/knowledge/TagInputField';
import { Badge } from '@/components/ui/badge';

// Validation schema
const questionFormSchema = z.object({
  title: z.string()
    .min(5, { message: "Title must be at least 5 characters" })
    .max(100, { message: "Title cannot be longer than 100 characters" }),
  content: z.string()
    .min(10, { message: "Question must be at least 10 characters" }),
  tags: z.array(z.string())
    .min(1, { message: "Please add at least 1 tag" })
    .max(5, { message: "You cannot add more than 5 tags" })
});

type QuestionFormValues = z.infer<typeof questionFormSchema>;

interface QuestionFormProps {
  onSubmit: (data: QuestionFormValues) => void;
  isSubmitting: boolean;
  step?: number;
  initialData?: Partial<QuestionFormValues>;
}

export const QuestionForm: React.FC<QuestionFormProps> = ({ 
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
    title: initialData?.title || "",
    content: initialData?.content || "",
    tags: initialData?.tags || [],
  };
  
  // Form setup
  const form = useForm<QuestionFormValues>({
    resolver: zodResolver(questionFormSchema),
    defaultValues
  });
  
  // Update form when initialData changes
  useEffect(() => {
    if (initialData) {
      Object.entries(initialData).forEach(([key, value]) => {
        if (value !== undefined) {
          form.setValue(key as keyof QuestionFormValues, value);
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
  
  const handleSubmit = (values: QuestionFormValues) => {
    onSubmit(values);
  };
  
  // Content to render based on step
  if (step === 2) {
    const formData = form.getValues();
    return (
      <div className="bg-card/50 border rounded-md p-6 space-y-6">
        <div>
          <h3 className="text-lg font-medium mb-2">Title</h3>
          <p className="p-4 bg-muted/50 rounded-md">{formData.title}</p>
        </div>
        
        <div>
          <h3 className="text-lg font-medium mb-2">Question</h3>
          <div className="p-4 bg-muted/50 rounded-md whitespace-pre-wrap">
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
      <form onSubmit={form.handleSubmit(handleSubmit)} id="content-form" className="space-y-6">
        {/* Title field */}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Enter the question title..." 
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
              <FormLabel>Question</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Enter your question..." 
                  className="min-h-[100px]"
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

