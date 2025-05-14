
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { getCategories, getContactGroups } from "@/services/rel8t/contactService";
import { MultiSelect } from "./MultiSelect";

interface ContactFormProps {
  contact?: any;
  onSubmit: (data: any) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export const ContactForm = ({ 
  contact, 
  onSubmit, 
  onCancel,
  isSubmitting = false
}: ContactFormProps) => {
  const [tags, setTags] = useState<string[]>(contact?.tags || []);
  
  // Get categories for the select dropdown
  const { data: categories = [] } = useQuery({
    queryKey: ["contact-categories"],
    queryFn: getCategories,
  });
  
  // Get groups for the multi-select
  const { data: groups = [] } = useQuery({
    queryKey: ["contact-groups"],
    queryFn: getContactGroups,
  });
  
  // Initialize the form with default values or contact data
  const form = useForm({
    defaultValues: contact ? {
      name: contact.name || "",
      email: contact.email || "",
      phone: contact.phone || "",
      organization: contact.organization || "",
      role: contact.role || "",
      location: contact.location || "",
      notes: contact.notes || "",
      category_id: contact.category_id || "",
      selectedGroups: contact.groups?.map((g: any) => g.id) || [],
    } : {
      name: "",
      email: "",
      phone: "",
      organization: "",
      role: "",
      location: "",
      notes: "",
      category_id: "",
      selectedGroups: [],
    }
  });
  
  // Handle tag input
  const handleAddTag = (newTag: string) => {
    if (newTag && !tags.includes(newTag)) {
      setTags([...tags, newTag]);
    }
  };
  
  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };
  
  const handleSubmit = (data: any) => {
    // Include tags in the submitted data
    onSubmit({
      ...data,
      tags
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="name"
            rules={{ required: "Name is required" }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name*</FormLabel>
                <FormControl>
                  <Input placeholder="Enter name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email Address</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="Enter email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <Input placeholder="Enter phone number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="organization"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Organization</FormLabel>
                <FormControl>
                  <Input placeholder="Enter organization" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Role / Title</FormLabel>
                <FormControl>
                  <Input placeholder="Enter role or title" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location</FormLabel>
                <FormControl>
                  <Input placeholder="Enter location" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="category_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <FormControl>
                  <select
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    {...field}
                  >
                    <option value="">Select a category</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="selectedGroups"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Groups</FormLabel>
                <FormControl>
                  <MultiSelect
                    options={groups.map((group) => ({
                      label: group.name,
                      value: group.id,
                    }))}
                    selectedValues={field.value}
                    onChange={field.onChange}
                    placeholder="Select groups"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-2">
          <FormLabel htmlFor="tags">Tags</FormLabel>
          <div className="flex items-center space-x-2">
            <Input 
              id="tag-input" 
              placeholder="Add tag and press Enter"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  const input = e.currentTarget;
                  handleAddTag(input.value);
                  input.value = '';
                }
              }}
            />
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                const input = document.getElementById('tag-input') as HTMLInputElement;
                handleAddTag(input.value);
                input.value = '';
              }}
            >
              Add
            </Button>
          </div>
          
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {tags.map(tag => (
                <div 
                  key={tag}
                  className="bg-secondary text-secondary-foreground px-2 py-1 rounded-md text-sm flex items-center gap-1"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="text-secondary-foreground/70 hover:text-secondary-foreground ml-1"
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter any additional notes"
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : contact ? "Update Contact" : "Save Contact"}
          </Button>
        </div>
      </form>
    </Form>
  );
};
