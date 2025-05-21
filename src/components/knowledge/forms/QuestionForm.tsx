
import React, { useState } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { X, PlusCircle } from 'lucide-react';

// UI Components
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

// Validation schema
const questionFormSchema = z.object({
  title: z.string()
    .min(10, { message: "Title must be at least 10 characters" })
    .max(150, { message: "Title cannot be longer than 150 characters" }),
  content: z.string()
    .min(30, { message: "Question details must be at least 30 characters" }),
  tags: z.array(z.string())
    .min(1, { message: "Please add at least 1 tag" })
    .max(5, { message: "You cannot add more than 5 tags" })
});

type QuestionFormValues = z.infer<typeof questionFormSchema>;

interface QuestionFormProps {
  onSubmit: (data: QuestionFormValues) => void;
  isSubmitting: boolean;
}

export const QuestionForm: React.FC<QuestionFormProps> = ({ onSubmit, isSubmitting }) => {
  const [tagInput, setTagInput] = useState('');
  
  // Form setup
  const form = useForm<QuestionFormValues>({
    resolver: zodResolver(questionFormSchema),
    defaultValues: {
      title: "",
      content: "",
      tags: [],
    },
  });
  
  // Handle tag addition
  const handleAddTag = () => {
    const tag = tagInput.trim().toLowerCase();
    if (!tag) return;
    
    const currentTags = form.getValues("tags");
    
    if (currentTags.includes(tag)) {
      setTagInput('');
      return;
    }
    
    if (currentTags.length >= 5) {
      form.setError("tags", { message: "You cannot add more than 5 tags" });
      return;
    }
    
    form.setValue("tags", [...currentTags, tag]);
    form.clearErrors("tags");
    setTagInput('');
  };
  
  // Handle tag removal
  const handleRemoveTag = (tagToRemove: string) => {
    const currentTags = form.getValues("tags");
    form.setValue("tags", currentTags.filter(tag => tag !== tagToRemove));
    form.clearErrors("tags");
  };
  
  // Handle tag input keydown
  const handleTagKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };
  
  // Submit handler
  const onFormSubmit = (data: QuestionFormValues) => {
    onSubmit(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onFormSubmit)} className="space-y-6">
        {/* Title field */}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Question Title</FormLabel>
              <FormControl>
                <Input 
                  placeholder="e.g. How do I build a strategic network in a new industry?" 
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
              <FormLabel>Question Details</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Provide more details about your question..." 
                  className="min-h-[150px]" 
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
              
              {/* Display selected tags */}
              <div className="flex flex-wrap gap-2 mb-2">
                {field.value.map(tag => (
                  <Badge key={tag} variant="outline" className="flex items-center gap-1">
                    {tag}
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-auto p-0 ml-1"
                      onClick={() => handleRemoveTag(tag)}
                    >
                      <X className="h-3 w-3" />
                      <span className="sr-only">Remove {tag}</span>
                    </Button>
                  </Badge>
                ))}
              </div>
              
              {/* Tag input */}
              <div className="flex gap-2">
                <Input
                  placeholder="Add a tag (e.g. networking, strategy)"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleTagKeyDown}
                  className="flex-1"
                />
                <Button 
                  type="button" 
                  onClick={handleAddTag} 
                  variant="outline"
                >
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Add
                </Button>
              </div>
              
              <FormMessage />
            </FormItem>
          )}
        />
        
        {/* Submit button */}
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Post Question"}
        </Button>
      </form>
    </Form>
  );
};
