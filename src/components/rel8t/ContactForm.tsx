
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
import { 
  getCategories, 
  ContactCategory
} from "@/services/rel8t/contactService";
import { 
  MapPin,
  Building,
  Heart
} from "lucide-react";
import { LocationSelector } from "@/components/ui/location-selector";
import { DatePicker } from "@/components/ui/date-picker";
import { Badge } from "@/components/ui/badge";

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
    location?: string;
    status?: 'active' | 'inactive';
    interests?: string[];
    bio?: string;
    last_introduction_date?: string;
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
  category_id: "",
  location: "",
  status: "active" as 'active' | 'inactive',
  interests: [],
  bio: "",
  last_introduction_date: ""
};

const ContactForm = ({
  initialValues = DEFAULT_VALUES,
  onSubmit,
  onCancel,
  isSubmitting
}: ContactFormProps) => {
  const [values, setValues] = useState(initialValues);
  const [tagsInput, setTagsInput] = useState("");
  const [interestsInput, setInterestsInput] = useState("");
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

  const handleInterestsKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      
      if (!interestsInput.trim()) return;
      
      const newInterest = interestsInput.trim();
      if (!values.interests?.includes(newInterest)) {
        setValues({
          ...values,
          interests: [...(values.interests || []), newInterest]
        });
      }
      
      setInterestsInput("");
    }
  };

  const removeInterest = (interestToRemove: string) => {
    setValues({
      ...values,
      interests: values.interests?.filter(interest => interest !== interestToRemove) || []
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(values);
  };

  const handleSelectCategory = (category_id: string) => {
    setValues({
      ...values,
      category_id: category_id === "none" ? undefined : category_id
    });
  };

  const toggleGroupSelection = (groupId: string) => {
    // Groups removed - no-op
  };

  return (
    <div className="max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-foreground border-b pb-2">Basic Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name" className="text-sm font-medium">Name*</Label>
              <Input
                id="name"
                name="name"
                value={values.name}
                onChange={handleChange}
                className="mt-1"
                required
              />
            </div>

            <div>
              <Label htmlFor="email" className="text-sm font-medium">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={values.email}
                onChange={handleChange}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="phone" className="text-sm font-medium">Phone</Label>
              <Input
                id="phone"
                name="phone"
                value={values.phone}
                onChange={handleChange}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="location" className="text-sm font-medium flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-muted-foreground" /> Location
              </Label>
              <LocationSelector
                value={values.location || ""}
                onValueChange={(value) => setValues({ ...values, location: value })}
                placeholder="Select location"
                allowCustomInput={true}
                showHierarchy={true}
              />
            </div>
          </div>
        </div>

        {/* Profile Details Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-foreground border-b pb-2">Profile Details</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="status" className="text-sm font-medium">Status</Label>
              <Select
                value={values.status || "active"}
                onValueChange={(value) => setValues({ ...values, status: value as 'active' | 'inactive' })}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground mt-1">Current contact status</p>
            </div>
          </div>

          <div>
            <Label htmlFor="bio" className="text-sm font-medium">Bio / Description</Label>
            <Textarea
              id="bio"
              name="bio"
              value={values.bio || ""}
              onChange={handleChange}
              rows={6}
              className="mt-1 resize-none"
              placeholder="Add a bio or description for this contact..."
            />
            <p className="text-xs text-muted-foreground mt-1">A short description or summary about this contact</p>
          </div>
        </div>

        {/* Professional Information Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-foreground border-b pb-2">Professional Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="organization" className="text-sm font-medium flex items-center gap-1.5">
                <Building className="h-4 w-4 text-muted-foreground" /> Organization
              </Label>
              <Input
                id="organization"
                name="organization"
                value={values.organization}
                onChange={handleChange}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="role" className="text-sm font-medium">Role</Label>
              <Input
                id="role"
                name="role"
                value={values.role}
                onChange={handleChange}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="category" className="text-sm font-medium">Category</Label>
              <Select
                value={values.category_id || ""}
                onValueChange={handleSelectCategory}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
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
          </div>
        </div>

        {/* Interests & Tags Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-foreground border-b pb-2">Interests & Tags</h3>

          {/* Interests field */}
          <div>
            <Label htmlFor="interests" className="text-sm font-medium">Interests</Label>
            <Input
              id="interests"
              value={interestsInput}
              onChange={(e) => setInterestsInput(e.target.value)}
              onKeyDown={handleInterestsKeyDown}
              placeholder="Type and press Enter to add interests"
              className="mt-1"
            />
            <p className="text-xs text-muted-foreground mt-1">
              What topics or areas is this contact interested in? Press Enter or comma to add.
            </p>
            {values.interests && values.interests.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {values.interests.map((interest, index) => (
                  <Badge 
                    key={index} 
                    variant="secondary"
                    className="px-2 py-1 flex items-center gap-1"
                  >
                    <Heart className="h-3 w-3" />
                    {interest}
                    <button
                      type="button"
                      onClick={() => removeInterest(interest)}
                      className="ml-1 hover:text-destructive"
                    >
                      ×
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Tags field */}
          <div>
            <Label htmlFor="tags" className="text-sm font-medium">Tags</Label>
            <div className="flex flex-wrap gap-2 border border-border/40 rounded-md p-3 mt-1 min-h-[42px]">
              {values.tags?.map((tag) => (
                <span
                  key={tag}
                  className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm flex items-center gap-1"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="text-xs hover:text-destructive focus:outline-none ml-1"
                  >
                    ×
                  </button>
                </span>
              ))}
              <Input
                id="tagsInput"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                onKeyDown={handleTagsKeyDown}
                className="flex-1 min-w-[120px] border-none focus-visible:ring-0 focus-visible:ring-offset-0 h-7 p-0"
                placeholder={values.tags?.length ? "" : "Add tags (press Enter)"}
              />
            </div>
          </div>
        </div>

        {/* Introduction Tracking Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-foreground border-b pb-2">Introduction Tracking</h3>
          
          <div>
            <Label htmlFor="last_introduction_date" className="text-sm font-medium">Last Introduction Date</Label>
            <div className="mt-1">
              <DatePicker
                value={values.last_introduction_date ? new Date(values.last_introduction_date) : undefined}
                onChange={(date) => setValues({ 
                  ...values, 
                  last_introduction_date: date ? date.toISOString() : '' 
                })}
                className="w-full"
              />
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Track when you last introduced this contact to someone
            </p>
          </div>
        </div>

        {/* Notes Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-foreground border-b pb-2">Additional Notes</h3>
          
          <div>
            <Label htmlFor="notes" className="text-sm font-medium">Notes</Label>
            <Textarea
              id="notes"
              name="notes"
              value={values.notes}
              onChange={handleChange}
              rows={4}
              className="mt-1"
              placeholder="Add any additional notes about this contact..."
            />
          </div>
        </div>

        {/* Form actions */}
        <div className="flex justify-end gap-3 pt-6 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
            className="px-6"
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="px-6"
          >
            {isSubmitting ? "Saving..." : "Save Contact"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ContactForm;
