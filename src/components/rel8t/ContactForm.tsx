
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { getCategories, ContactCategory } from "@/services/rel8t/contactService";

interface ContactFormProps {
  initialValues?: {
    name: string;
    email?: string;
    phone?: string;
    organization?: string;
    role?: string;
    notes?: string;
    tags?: string[];
    category_id?: string;
  };
  onSubmit: (values: any) => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

const DEFAULT_VALUES = {
  name: "",
  email: "",
  phone: "",
  organization: "",
  role: "",
  notes: "",
  tags: [],
  category_id: ""
};

const ContactForm = ({
  initialValues = DEFAULT_VALUES,
  onSubmit,
  onCancel,
  isSubmitting
}: ContactFormProps) => {
  const [values, setValues] = useState(initialValues);
  const [tagsInput, setTagsInput] = useState("");
  const [categories, setCategories] = useState<ContactCategory[]>([]);
  
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const fetchedCategories = await getCategories();
        setCategories(fetchedCategories);
      } catch (error) {
        console.error("Error loading categories:", error);
      }
    };
    
    loadCategories();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
  };

  const handleTagsKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      
      if (!tagsInput.trim()) return;
      
      // Add the tag if it doesn't exist already
      const newTag = tagsInput.trim();
      if (!values.tags?.includes(newTag)) {
        setValues({
          ...values,
          tags: [...(values.tags || []), newTag]
        });
      }
      
      // Clear the input
      setTagsInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setValues({
      ...values,
      tags: values.tags?.filter(tag => tag !== tagToRemove) || []
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(values);
  };

  const handleSelectCategory = (category_id: string) => {
    setValues({
      ...values,
      category_id
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Name field */}
      <div>
        <Label htmlFor="name">Name*</Label>
        <Input
          id="name"
          name="name"
          value={values.name}
          onChange={handleChange}
          required
        />
      </div>

      {/* Email field */}
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          value={values.email}
          onChange={handleChange}
        />
      </div>

      {/* Phone field */}
      <div>
        <Label htmlFor="phone">Phone</Label>
        <Input
          id="phone"
          name="phone"
          value={values.phone}
          onChange={handleChange}
        />
      </div>

      {/* Organization field */}
      <div>
        <Label htmlFor="organization">Organization</Label>
        <Input
          id="organization"
          name="organization"
          value={values.organization}
          onChange={handleChange}
        />
      </div>

      {/* Role field */}
      <div>
        <Label htmlFor="role">Role</Label>
        <Input
          id="role"
          name="role"
          value={values.role}
          onChange={handleChange}
        />
      </div>
      
      {/* Category field */}
      <div>
        <Label htmlFor="category">Category</Label>
        <Select
          value={values.category_id}
          onValueChange={handleSelectCategory}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">None</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                <span className="flex items-center gap-2">
                  <span 
                    className="inline-block w-3 h-3 rounded-full" 
                    style={{ backgroundColor: category.color }} 
                  />
                  {category.name}
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Tags field */}
      <div>
        <Label htmlFor="tags">Tags</Label>
        <div className="flex flex-wrap gap-1 border rounded-md p-2 min-h-[42px]">
          {values.tags?.map((tag) => (
            <span
              key={tag}
              className="bg-secondary text-secondary-foreground px-2 py-1 rounded-full text-sm flex items-center gap-1"
            >
              {tag}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="text-xs hover:text-destructive focus:outline-none"
              >
                &times;
              </button>
            </span>
          ))}
          <Input
            id="tagsInput"
            value={tagsInput}
            onChange={(e) => setTagsInput(e.target.value)}
            onKeyDown={handleTagsKeyDown}
            className="flex-1 min-w-[100px] border-none focus-visible:ring-0 focus-visible:ring-offset-0 h-7 p-0"
            placeholder={values.tags?.length ? "" : "Add tags (press Enter)"}
          />
        </div>
      </div>

      {/* Notes field */}
      <div>
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          name="notes"
          value={values.notes}
          onChange={handleChange}
          rows={4}
        />
      </div>

      {/* Form actions */}
      <div className="flex justify-end gap-2 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save Contact"}
        </Button>
      </div>
    </form>
  );
};

export default ContactForm;
