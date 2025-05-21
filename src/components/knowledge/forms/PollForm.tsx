
import React, { useState, useEffect } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { PlusCircle, Trash2 } from 'lucide-react';
import { useKnowledgeBase } from '@/hooks/useKnowledgeBase';

// UI Components
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from '@/components/ui/badge';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TagInputField } from '@/components/knowledge/TagInputField';

// Validation schema
const pollFormSchema = z.object({
  question: z.string()
    .min(5, { message: "Poll question must be at least 5 characters" })
    .max(200, { message: "Poll question cannot be longer than 200 characters" }),
  options: z.array(
    z.object({
      text: z.string().min(1, { message: "Option text cannot be empty" })
    })
  ).min(2, { message: "You must add at least 2 options" }),
  allowMultipleSelections: z.boolean().default(false),
  duration: z.string().default("7"),
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
  const [popularTags, setPopularTags] = useState<Set<string>>(new Set());
  
  // Form setup
  const form = useForm<PollFormValues>({
    resolver: zodResolver(pollFormSchema),
    defaultValues: {
      question: initialData?.question || "",
      options: initialData?.options || [{ text: "" }, { text: "" }],
      allowMultipleSelections: initialData?.allowMultipleSelections || false,
      duration: initialData?.duration || "7",
      tags: initialData?.tags || [],
    },
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
  
  // Field array for options
  const { fields, append, remove } = useFieldArray({
    name: "options",
    control: form.control
  });

  // Identify popular tags
  useEffect(() => {
    if (availableTags) {
      const sortedTags = [...availableTags].sort((a, b) => (b.count || 0) - (a.count || 0));
      const popularThreshold = Math.ceil(sortedTags.length / 4);
      const popular = new Set(sortedTags.slice(0, popularThreshold).map(tag => tag.name));
      setPopularTags(popular);
    }
  }, [availableTags]);
  
  // Add a new option
  const addOption = () => {
    append({ text: "" });
  };
  
  // Handle form submission based on step
  const handleSubmit = (data: PollFormValues) => {
    onSubmit(data);
  };

  // Content to render based on step
  if (step === 2) {
    const formData = form.getValues();
    return (
      <div className="bg-card/50 border rounded-md p-6 space-y-6">
        <div>
          <h3 className="text-lg font-medium mb-2">Poll Question</h3>
          <p className="p-4 bg-muted/50 rounded-md">{formData.question}</p>
        </div>
        
        <div>
          <h3 className="text-lg font-medium mb-2">Poll Options</h3>
          <div className="space-y-2">
            {formData.options.map((option, index) => (
              <div key={index} className="p-4 bg-muted/50 rounded-md">
                {index + 1}. {option.text}
              </div>
            ))}
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-medium mb-2">Settings</h3>
          <div className="p-4 bg-muted/50 rounded-md space-y-2">
            <p>Allow multiple selections: {formData.allowMultipleSelections ? "Yes" : "No"}</p>
            <p>Duration: {formData.duration} days</p>
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
        {/* Poll question field */}
        <FormField
          control={form.control}
          name="question"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Poll Question</FormLabel>
              <FormControl>
                <Input 
                  placeholder="What would you like to ask the community?" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {/* Poll options */}
        <div className="space-y-4">
          <FormLabel>Poll Options</FormLabel>
          
          {fields.map((field, index) => (
            <div key={field.id} className="flex items-center gap-2">
              <FormField
                control={form.control}
                name={`options.${index}.text`}
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <Input 
                        placeholder={`Option ${index + 1}`} 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {index > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => remove(index)}
                  className="shrink-0"
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">Remove option</span>
                </Button>
              )}
            </div>
          ))}
          
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addOption}
            className="mt-2"
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Option
          </Button>
          
          {form.formState.errors.options?.root && (
            <p className="text-sm font-medium text-destructive">
              {form.formState.errors.options.root.message}
            </p>
          )}
        </div>
        
        {/* Allow multiple selections */}
        <FormField
          control={form.control}
          name="allowMultipleSelections"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
              <div className="space-y-0.5">
                <FormLabel>Allow Multiple Selections</FormLabel>
                <FormDescription>
                  Let users select more than one option
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
        
        {/* Poll duration */}
        <FormField
          control={form.control}
          name="duration"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Poll Duration</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="1">1 day</SelectItem>
                  <SelectItem value="3">3 days</SelectItem>
                  <SelectItem value="7">7 days</SelectItem>
                  <SelectItem value="14">14 days</SelectItem>
                  <SelectItem value="30">30 days</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                How long the poll will remain active
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
                  placeholder="Add a tag (e.g. poll, opinion)"
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
