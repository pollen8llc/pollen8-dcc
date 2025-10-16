
import React, { useState, useEffect } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useKnowledgeBase } from '@/hooks/useKnowledgeBase';
import { useDebounce } from '@/hooks/useDebounce';
import DOMPurify from 'dompurify';

// UI Components
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Badge } from '@/components/ui/badge';
import { TagInputField } from '@/components/knowledge/TagInputField';
import { TiptapEditor } from '@/components/ui/tiptap-editor';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Eye, Edit } from "lucide-react";

// Validation schema - updated to make subtitle optional
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

const KNOWLEDGE_DRAFT_KEY = 'knowledge-article-draft';

export const ArticleForm: React.FC<ArticleFormProps> = ({
  onSubmit,
  isSubmitting,
  step = 1,
  initialData
}) => {
  const { useTags } = useKnowledgeBase();
  const { data: availableTags } = useTags();
  const [popularTags, setPopularTags] = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = useState<string>("editor");
  
  // Load draft from localStorage
  const loadDraft = () => {
    try {
      const saved = localStorage.getItem(KNOWLEDGE_DRAFT_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  };

  const savedDraft = loadDraft();
  const defaultValues = savedDraft || {
    title: initialData?.title || "",
    subtitle: initialData?.subtitle || "",
    content: initialData?.content || "",
    tags: initialData?.tags || [],
  };
  
  // Form setup with draft persistence
  const form = useForm<ArticleFormValues>({
    resolver: zodResolver(articleFormSchema),
    shouldUnregister: false,
    defaultValues,
  });

  // Watch form values for autosave
  const watchedValues = form.watch();
  const debouncedValues = useDebounce(watchedValues, 1000);

  // Autosave to localStorage
  useEffect(() => {
    if (debouncedValues.title || debouncedValues.content || debouncedValues.tags.length > 0) {
      localStorage.setItem(KNOWLEDGE_DRAFT_KEY, JSON.stringify(debouncedValues));
    }
  }, [debouncedValues]);
  
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
    // Sanitize HTML content before submission
    const sanitizedData = {
      ...data,
      content: DOMPurify.sanitize(data.content)
    };
    onSubmit(sanitizedData);
  };
  
  // Content to render based on step
  if (step === 2) {
    const formData = form.getValues();
    const sanitizedContent = DOMPurify.sanitize(formData.content);
    
    return (
      <div className="bg-card/50 border rounded-md p-6 space-y-6">
        <div>
          <h3 className="text-lg font-medium mb-2 text-white">Article Title</h3>
          <p className="p-4 bg-muted/50 rounded-md text-white">{formData.title}</p>
        </div>
        
        {formData.subtitle && (
          <div>
            <h3 className="text-lg font-medium mb-2 text-white">Subtitle</h3>
            <p className="p-4 bg-muted/50 rounded-md text-white">{formData.subtitle}</p>
          </div>
        )}
        
        <div>
          <h3 className="text-lg font-medium mb-2 text-white">Article Content</h3>
          <div 
            className="p-4 bg-muted/50 rounded-md max-h-60 overflow-y-auto text-white leading-relaxed
              [&_p]:text-white [&_p]:text-base [&_p]:leading-relaxed [&_p]:mb-4
              [&_h1]:text-white [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:leading-tight [&_h1]:mt-6 [&_h1]:mb-4 [&_h1:first-child]:mt-0
              [&_h2]:text-white [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:leading-tight [&_h2]:mt-5 [&_h2]:mb-3
              [&_h3]:text-white [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:leading-tight [&_h3]:mt-4 [&_h3]:mb-2
              [&_h4]:text-white [&_h4]:text-base [&_h4]:font-medium [&_h4]:leading-tight [&_h4]:mt-4 [&_h4]:mb-2
              [&_h5]:text-white [&_h5]:text-sm [&_h5]:font-medium [&_h5]:leading-tight [&_h5]:mt-3 [&_h5]:mb-2
              [&_h6]:text-white [&_h6]:text-xs [&_h6]:font-medium [&_h6]:leading-tight [&_h6]:mt-3 [&_h6]:mb-1
              [&_strong]:text-white [&_strong]:font-semibold
              [&_em]:text-white [&_em]:italic
              [&_li]:text-white [&_li]:text-base [&_li]:leading-relaxed [&_li]:mb-1
              [&_ul]:text-white [&_ul]:mb-4 [&_ul]:pl-6 [&_ul]:list-disc
              [&_ol]:text-white [&_ol]:mb-4 [&_ol]:pl-6 [&_ol]:list-decimal
              [&_blockquote]:text-white [&_blockquote]:border-l-4 [&_blockquote]:border-gray-300 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:my-4
              [&_span]:text-white
              [&_div]:text-white
              [&_a]:text-[#00eada] [&_a]:underline [&_a:hover]:opacity-80
              [&_code]:text-white [&_code]:bg-gray-800 [&_code]:px-2 [&_code]:py-1 [&_code]:rounded [&_code]:text-sm
              [&_pre]:text-white [&_pre]:bg-gray-800 [&_pre]:p-4 [&_pre]:rounded-lg [&_pre]:overflow-x-auto [&_pre]:my-4
              [&_table]:text-white [&_table]:border-collapse [&_table]:w-full [&_table]:my-4
              [&_th]:text-white [&_th]:border [&_th]:border-gray-600 [&_th]:px-4 [&_th]:py-3 [&_th]:text-left [&_th]:font-semibold
              [&_td]:text-white [&_td]:border [&_td]:border-gray-600 [&_td]:px-4 [&_td]:py-3"
            dangerouslySetInnerHTML={{ __html: sanitizedContent }}
          />
        </div>
        
        <div>
          <h3 className="text-lg font-medium mb-2 text-white">Tags</h3>
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
      <form id="content-form" onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 sm:space-y-6">
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
        
        {/* Subtitle field - kept optional */}
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
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <div className="flex justify-between items-center mb-2">
                    <TabsList>
                      <TabsTrigger value="editor" className="flex items-center gap-1">
                        <Edit className="h-4 w-4" />
                        Editor
                      </TabsTrigger>
                      <TabsTrigger value="preview" className="flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        Preview
                      </TabsTrigger>
                    </TabsList>
                  </div>
                  
                  <TabsContent value="editor" className="mt-2" forceMount>
                    <div className={activeTab === "editor" ? "block" : "hidden"}>
                      <TiptapEditor content={field.value} onChange={field.onChange} />
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="preview" className="mt-2">
                    <div 
                      className="w-full max-w-none bg-muted/30 rounded-md p-4 min-h-[250px] border text-white leading-relaxed
                        [&_p]:text-white [&_p]:text-base [&_p]:leading-relaxed [&_p]:mb-4
                        [&_h1]:text-white [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:leading-tight [&_h1]:mt-6 [&_h1]:mb-4 [&_h1:first-child]:mt-0
                        [&_h2]:text-white [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:leading-tight [&_h2]:mt-5 [&_h2]:mb-3
                        [&_h3]:text-white [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:leading-tight [&_h3]:mt-4 [&_h3]:mb-2
                        [&_h4]:text-white [&_h4]:text-base [&_h4]:font-medium [&_h4]:leading-tight [&_h4]:mt-4 [&_h4]:mb-2
                        [&_h5]:text-white [&_h5]:text-sm [&_h5]:font-medium [&_h5]:leading-tight [&_h5]:mt-3 [&_h5]:mb-2
                        [&_h6]:text-white [&_h6]:text-xs [&_h6]:font-medium [&_h6]:leading-tight [&_h6]:mt-3 [&_h6]:mb-1
                        [&_strong]:text-white [&_strong]:font-semibold
                        [&_em]:text-white [&_em]:italic
                        [&_li]:text-white [&_li]:text-base [&_li]:leading-relaxed [&_li]:mb-1
                        [&_ul]:text-white [&_ul]:mb-4 [&_ul]:pl-6 [&_ul]:list-disc
                        [&_ol]:text-white [&_ol]:mb-4 [&_ol]:pl-6 [&_ol]:list-decimal
                        [&_blockquote]:text-white [&_blockquote]:border-l-4 [&_blockquote]:border-gray-300 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:my-4
                        [&_span]:text-white
                        [&_div]:text-white
                        [&_a]:text-[#00eada] [&_a]:underline [&_a:hover]:opacity-80
                        [&_code]:text-white [&_code]:bg-gray-800 [&_code]:px-2 [&_code]:py-1 [&_code]:rounded [&_code]:text-sm
                        [&_pre]:text-white [&_pre]:bg-gray-800 [&_pre]:p-4 [&_pre]:rounded-lg [&_pre]:overflow-x-auto [&_pre]:my-4
                        [&_table]:text-white [&_table]:border-collapse [&_table]:w-full [&_table]:my-4
                        [&_th]:text-white [&_th]:border [&_th]:border-gray-600 [&_th]:px-4 [&_th]:py-3 [&_th]:text-left [&_th]:font-semibold
                        [&_td]:text-white [&_td]:border [&_td]:border-gray-600 [&_td]:px-4 [&_td]:py-3"
                      dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(field.value) }}
                    />
                  </TabsContent>
                </Tabs>
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
              <FormLabel>Tags (1-5)</FormLabel>
              <FormControl>
                <TagInputField 
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Add tags..."
                  maxTags={5}
                  availableTags={availableTags?.map(tag => tag.name) || []}
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
