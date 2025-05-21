
import React, { useState, useEffect } from 'react';
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
import { Card } from '@/components/ui/card';

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
}

export const ArticleForm: React.FC<ArticleFormProps> = ({ onSubmit, isSubmitting }) => {
  const [tagInput, setTagInput] = useState('');
  
  // Form setup
  const form = useForm<ArticleFormValues>({
    resolver: zodResolver(articleFormSchema),
    defaultValues: {
      title: "",
      subtitle: "",
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
  
  // Setup rich text editor
  useEffect(() => {
    // @ts-ignore - TinyMCE is loaded from CDN
    if (window.tinymce) return;
    
    const script = document.createElement('script');
    script.src = 'https://cdn.tiny.cloud/1/no-api-key/tinymce/6/tinymce.min.js';
    script.referrerPolicy = 'origin';
    
    script.onload = () => {
      // @ts-ignore
      window.tinymce?.init({
        selector: '#article-content',
        plugins: 'link image lists table code help wordcount',
        toolbar: 'undo redo | blocks | bold italic underline strikethrough | link image | numlist bullist | table | code',
        menubar: 'file edit view insert format tools table help',
        setup: (editor: any) => {
          // Update content in state when editor content changes
          editor.on('change', () => {
            form.setValue('content', editor.getContent());
          });
        },
        height: 400,
        content_style: `
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
            font-size: 16px;
            color: #374151;
            margin: 1rem;
          }
          .dark body {
            color: #e5e7eb;
            background-color: #1f2937;
          }
          .dark a { color: #60a5fa; }
          .dark h1, .dark h2, .dark h3, .dark h4, .dark h5, .dark h6 { color: #f3f4f6; }
          .dark code { 
            background-color: #374151; 
            color: #e5e7eb; 
            padding: 0.2em 0.4em;
            border-radius: 3px;
          }
        `,
        skin: window.matchMedia('(prefers-color-scheme: dark)').matches ? 'oxide-dark' : 'oxide',
        content_css: window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'default'
      });
    };
    
    document.head.appendChild(script);
    
    return () => {
      // @ts-ignore
      if (window.tinymce) {
        // @ts-ignore
        window.tinymce.remove('#article-content');
      }
    };
  }, []);
  
  // Submit handler
  const onFormSubmit = (data: ArticleFormValues) => {
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
                <Card>
                  <textarea id="article-content" {...field} />
                </Card>
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
          {isSubmitting ? "Submitting..." : "Publish Article"}
        </Button>
      </form>
    </Form>
  );
};
