
import React, { useState } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { X, PlusCircle, Trash2 } from 'lucide-react';

// UI Components
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
}

export const PollForm: React.FC<PollFormProps> = ({ onSubmit, isSubmitting }) => {
  const [tagInput, setTagInput] = useState('');
  
  // Form setup
  const form = useForm<PollFormValues>({
    resolver: zodResolver(pollFormSchema),
    defaultValues: {
      question: "",
      options: [{ text: "" }, { text: "" }],
      allowMultipleSelections: false,
      duration: "7",
      tags: [],
    },
  });
  
  // Field array for options
  const { fields, append, remove } = useFieldArray({
    name: "options",
    control: form.control
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
  
  // Add a new option
  const addOption = () => {
    append({ text: "" });
  };
  
  // Submit handler
  const onFormSubmit = (data: PollFormValues) => {
    onSubmit(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onFormSubmit)} className="space-y-6">
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
                  placeholder="Add a tag (e.g. poll, opinion)"
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
          {isSubmitting ? "Submitting..." : "Create Poll"}
        </Button>
      </form>
    </Form>
  );
};
