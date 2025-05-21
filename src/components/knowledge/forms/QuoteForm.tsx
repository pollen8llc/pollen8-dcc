
import React, { useState } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { X, PlusCircle } from 'lucide-react';

// UI Components
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

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
  step?: number; // Add step prop
}

export const QuoteForm: React.FC<QuoteFormProps> = ({ 
  onSubmit, 
  isSubmitting,
  step = 1 // Default value for step
}) => {
  const [tagInput, setTagInput] = useState('');
  const [localData, setLocalData] = useState<Partial<QuoteFormValues>>({
    quote: "",
    author: "",
    context: "",
    tags: [],
  });
  
  // Form setup
  const form = useForm<QuoteFormValues>({
    resolver: zodResolver(quoteFormSchema),
    defaultValues: {
      quote: localData.quote || "",
      author: localData.author || "",
      context: localData.context || "",
      tags: localData.tags || [],
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

  // Handle form submission based on step
  const handleSubmit = (data: QuoteFormValues) => {
    if (step === 1) {
      setLocalData(data);
    } else {
      onSubmit(data);
    }
  };
  
  // Content to render based on step
  if (step === 2) {
    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium mb-2">Quote</h3>
          <div className="p-3 bg-muted rounded-md whitespace-pre-wrap">
            {form.getValues("quote")}
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-medium mb-2">Author</h3>
          <p className="p-3 bg-muted rounded-md">{form.getValues("author")}</p>
        </div>
        
        {form.getValues("context") && (
          <div>
            <h3 className="text-lg font-medium mb-2">Context</h3>
            <div className="p-3 bg-muted rounded-md whitespace-pre-wrap">
              {form.getValues("context")}
            </div>
          </div>
        )}
        
        <div>
          <h3 className="text-lg font-medium mb-2">Tags</h3>
          <div className="flex flex-wrap gap-2">
            {form.getValues("tags").map(tag => (
              <div key={tag} className="bg-primary/10 text-primary px-2 py-1 rounded-md text-sm">
                {tag}
              </div>
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
                  placeholder="Add a tag (e.g. inspiration, leadership)"
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
      </form>
    </Form>
  );
};
