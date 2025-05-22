import React, { useState, useEffect } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useKnowledgeBase } from '@/hooks/useKnowledgeBase';

// UI Components
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { TagInputField } from '@/components/knowledge/TagInputField';
import { Badge } from '@/components/ui/badge';

// Validation schema
const pollFormSchema = z.object({
  question: z.string()
    .min(5, { message: "Question must be at least 5 characters" })
    .max(300, { message: "Question cannot be longer than 300 characters" }),
  options: z.array(z.string())
    .min(2, { message: "You must provide at least 2 options" })
    .max(5, { message: "You cannot provide more than 5 options" }),
  tags: z.array(z.string())
    .min(1, { message: "Please add at least 1 tag" })
    .max(5, { message: "You cannot add more than 5 tags" })
});

type PollFormValues = z.infer<typeof pollFormSchema>;

interface PollFormProps {
  onSubmit: (data: PollFormValues) => void;
  isSubmitting: boolean;
  step?: number;
  initialData?: Partial<PollFormValues>;
}

export const PollForm: React.FC<PollFormProps> = ({ 
  onSubmit, 
  isSubmitting,
  step = 1,
  initialData
}) => {
  const { useTags } = useKnowledgeBase();
  const { data: availableTags } = useTags();
  const [newOption, setNewOption] = useState("");
  const [popularTags, setPopularTags] = useState<Set<string>>(new Set());
  
  // Merge provided initial data with defaults
  const defaultValues = {
    question: initialData?.question || "",
    options: initialData?.options || ["", ""],
    tags: initialData?.tags || [],
  };
  
  // Form setup
  const form = useForm<PollFormValues>({
    resolver: zodResolver(pollFormSchema),
    defaultValues
  });
  
  // Update form when initialData changes
  useEffect(() => {
    if (initialData) {
      Object.entries(initialData).forEach(([key, value]) => {
        if (value !== undefined) {
          form.setValue(key as keyof PollFormValues, value);
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
  
  const handleSubmit = (values: PollFormValues) => {
    onSubmit(values);
  };
  
  // Handle adding a new option
  const handleAddOption = () => {
    if (newOption.trim() && form.getValues().options.length < 5) {
      form.setValue("options", [...form.getValues().options, newOption.trim()]);
      setNewOption("");
    }
  };
  
  // Handle removing an option
  const handleRemoveOption = (index: number) => {
    const updatedOptions = [...form.getValues().options];
    updatedOptions.splice(index, 1);
    form.setValue("options", updatedOptions);
  };
  
  // Content to render based on step
  if (step === 2) {
    const formData = form.getValues();
    return (
      <div className="bg-card/50 border rounded-md p-6 space-y-6">
        <div>
          <h3 className="text-lg font-medium mb-2">Question</h3>
          <div className="p-4 bg-muted/50 rounded-md whitespace-pre-wrap">
            {formData.question}
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-medium mb-2">Options</h3>
          <ul className="list-disc pl-5 space-y-2">
            {formData.options.map((option, index) => (
              <li key={index} className="p-4 bg-muted/50 rounded-md">
                {option}
              </li>
            ))}
          </ul>
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
        {/* Question text field */}
        <FormField
          control={form.control}
          name="question"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Question</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Enter the question for the poll..." 
                  className="min-h-[100px]"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {/* Options field */}
        <div>
          <FormLabel>Options</FormLabel>
          <FormDescription>
            Provide options for the poll. You must provide at least 2 options.
          </FormDescription>
          
          {form.watch("options").map((option, index) => (
            <FormField
              key={index}
              control={form.control}
              name={`options.${index}`}
              render={({ field }) => (
                <FormItem className="flex items-center space-x-2">
                  <FormLabel>{`Option ${index + 1}`}</FormLabel>
                  <FormControl className="flex-1">
                    <Input 
                      placeholder="Enter an option" 
                      {...field} 
                    />
                  </FormControl>
                  <Button 
                    type="button" 
                    variant="destructive"
                    size="sm"
                    onClick={() => handleRemoveOption(index)}
                  >
                    Remove
                  </Button>
                </FormItem>
              )}
            />
          ))}
          
          {/* Add new option input */}
          {form.getValues().options.length < 5 && (
            <div className="flex items-center space-x-2">
              <Input
                type="text"
                placeholder="Add a new option"
                value={newOption}
                onChange={(e) => setNewOption(e.target.value)}
              />
              <Button 
                type="button" 
                onClick={handleAddOption}
                disabled={!newOption.trim()}
              >
                Add Option
              </Button>
            </div>
          )}
          
          <FormMessage />
        </div>
        
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
                  placeholder="Add a tag (e.g. community, feedback)"
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
