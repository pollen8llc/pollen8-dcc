
import React, { useState } from 'react';
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
}

export const QuestionForm: React.FC<QuestionFormProps> = ({ onSubmit, isSubmitting, step = 1 }) => {
  const { useTags } = useKnowledgeBase();
  const { data: availableTags } = useTags();
  const [localData, setLocalData] = useState<Partial<FormValues>>({
    title: '',
    content: '',
    tags: []
  });
  
  // Create form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: localData.title || '',
      content: localData.content || '',
      tags: localData.tags || []
    }
  });
  
  // Handle submission
  const handleSubmit = (values: FormValues) => {
    setLocalData(values);
    onSubmit(values);
  };
  
  // Handle step navigation
  const handleStepSubmit = (values: FormValues) => {
    setLocalData(values);
  };

  return (
    <Form {...form}>
      <form 
        id="content-form" 
        onSubmit={step === 2 ? form.handleSubmit(handleSubmit) : form.handleSubmit(handleStepSubmit)}
        className="space-y-6"
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
            <div>
              <h3 className="text-lg font-medium mb-2">Question Title</h3>
              <p className="p-3 bg-muted rounded-md">{localData.title}</p>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-2">Question Details</h3>
              <div className="p-3 bg-muted rounded-md whitespace-pre-wrap">
                {localData.content}
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-2">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {localData.tags?.map(tag => (
                  <div key={tag} className="bg-primary/10 text-primary px-2 py-1 rounded-md text-sm">
                    {tag}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </form>
    </Form>
  );
};
