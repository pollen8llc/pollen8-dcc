
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useKnowledgeBase } from '@/hooks/useKnowledgeBase';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { TagInputField } from '@/components/knowledge/TagInputField';
import { Badge } from '@/components/ui/badge';
import { KnowledgeTag } from '@/models/knowledgeTypes';

// Define the form schema
const formSchema = z.object({
  title: z.string().min(5, { message: "Title must be at least 5 characters" }),
  content: z.string().min(20, { message: "Question details must be at least 20 characters" }),
  tags: z.array(z.string()).min(1, { message: "At least one tag is required" }).max(5, { message: "Maximum 5 tags allowed" }),
});

type FormValues = z.infer<typeof formSchema>;

interface QuestionFormProps {
  onSubmit: (data: FormValues) => void;
  isSubmitting: boolean;
  step?: number;
  initialData?: Partial<FormValues>;
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
  
  // Create form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: initialData?.title || '',
      content: initialData?.content || '',
      tags: initialData?.tags || []
    }
  });
  
  // Update form when initialData changes
  useEffect(() => {
    if (initialData) {
      Object.entries(initialData).forEach(([key, value]) => {
        if (value !== undefined) {
          form.setValue(key as keyof FormValues, value);
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
  
  // Handle submission
  const handleSubmit = (values: FormValues) => {
    onSubmit(values);
  };
  
  return (
    <Form {...form}>
      <form 
        id="content-form" 
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-4 sm:space-y-6"
      >
        {step === 1 && (
          <>
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="required">Question Title</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="e.g., How to implement authentication with JWT in a React application?" 
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="required">Question Details</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Provide additional context and details about your question" 
                      className="min-h-[200px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="required">Tags</FormLabel>
                  <FormControl>
                    <TagInputField
                      value={field.value}
                      onChange={field.onChange}
                      availableTags={availableTags?.map(tag => tag.name) || []}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}
        
        {step === 2 && (
          <div className="space-y-6">
            <div className="bg-card/50 border rounded-md p-6 space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-2">Question Title</h3>
                <p className="p-4 bg-muted/50 rounded-md">{form.getValues().title}</p>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">Question Details</h3>
                <div className="p-4 bg-muted/50 rounded-md whitespace-pre-wrap">
                  {form.getValues().content}
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {form.getValues().tags.map(tag => (
                    <Badge key={tag} 
                      variant={popularTags.has(tag) ? "popularTag" : "tag"}
                      className="flex items-center gap-1 py-1.5 px-3 text-sm"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </form>
    </Form>
  );
};
