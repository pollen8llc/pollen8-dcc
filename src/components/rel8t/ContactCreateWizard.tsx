import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Steps } from "@/components/ui/steps";
import { LocationSelector } from "@/components/ui/location-selector";
import { ArrowLeft, ArrowRight, Check, Tag as TagIcon, Heart } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface ContactCreateWizardProps {
  onSubmit: (values: any) => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

const ContactCreateWizard = ({ onSubmit, onCancel, isSubmitting }: ContactCreateWizardProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [values, setValues] = useState({
    email: "",
    name: "",
    phone: "",
    location: "",
    organization: "",
    role: "",
    category_id: "",
    bio: "",
    status: "active" as 'active' | 'inactive',
    interests: [] as string[],
    tags: [] as string[],
    notes: ""
  });

  const [tagInput, setTagInput] = useState("");
  const [interestInput, setInterestInput] = useState("");

  // Fetch categories
  const { data: categories = [] } = useQuery({
    queryKey: ["contact-categories"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("rms_contact_categories")
        .select("*")
        .eq("user_id", user.id)
        .order("name");

      if (error) throw error;
      return data || [];
    }
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      if (!tagInput.trim()) return;
      const newTag = tagInput.trim();
      if (!values.tags.includes(newTag)) {
        setValues({ ...values, tags: [...values.tags, newTag] });
      }
      setTagInput("");
    }
  };

  const handleInterestKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      if (!interestInput.trim()) return;
      const newInterest = interestInput.trim();
      if (!values.interests.includes(newInterest)) {
        setValues({ ...values, interests: [...values.interests, newInterest] });
      }
      setInterestInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setValues({ ...values, tags: values.tags.filter(tag => tag !== tagToRemove) });
  };

  const removeInterest = (interestToRemove: string) => {
    setValues({ ...values, interests: values.interests.filter(interest => interest !== interestToRemove) });
  };

  const canProceed = () => {
    if (currentStep === 1) {
      return values.email.trim() !== "" && values.name.trim() !== "";
    }
    return true;
  };

  const handleNext = () => {
    if (canProceed() && currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(values);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <Steps 
        currentStep={currentStep} 
        steps={["Contact Details", "Professional Info", "Additional Details"]}
        className="mb-8"
      />

      <div className="min-h-[400px]">
        {currentStep === 1 && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <Label htmlFor="email" className="text-sm font-medium">Email Address *</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={values.email}
                onChange={handleChange}
                placeholder="contact@example.com"
                className="mt-1.5"
                required
              />
            </div>

            <div>
              <Label htmlFor="name" className="text-sm font-medium">Full Name *</Label>
              <Input
                id="name"
                name="name"
                value={values.name}
                onChange={handleChange}
                placeholder="John Doe"
                className="mt-1.5"
                required
              />
            </div>

            <div>
              <Label htmlFor="phone" className="text-sm font-medium">Phone Number</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={values.phone}
                onChange={handleChange}
                placeholder="+1 (555) 000-0000"
                className="mt-1.5"
              />
            </div>

            <div>
              <Label htmlFor="location" className="text-sm font-medium">Location</Label>
              <div className="mt-1.5">
                <LocationSelector
                  value={values.location}
                  onValueChange={(value) => setValues({ ...values, location: value })}
                  placeholder="Select or search location..."
                  allowCustomInput
                />
              </div>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <Label htmlFor="organization" className="text-sm font-medium">Organization</Label>
              <Input
                id="organization"
                name="organization"
                value={values.organization}
                onChange={handleChange}
                placeholder="Company or organization name"
                className="mt-1.5"
              />
            </div>

            <div>
              <Label htmlFor="role" className="text-sm font-medium">Role / Title</Label>
              <Input
                id="role"
                name="role"
                value={values.role}
                onChange={handleChange}
                placeholder="e.g., CEO, Developer, Designer"
                className="mt-1.5"
              />
            </div>

            <div>
              <Label htmlFor="category_id" className="text-sm font-medium">Category</Label>
              <Select
                value={values.category_id}
                onValueChange={(value) => setValues({ ...values, category_id: value })}
              >
                <SelectTrigger className="mt-1.5">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="status" className="text-sm font-medium">Status</Label>
              <Select
                value={values.status}
                onValueChange={(value) => setValues({ ...values, status: value as 'active' | 'inactive' })}
              >
                <SelectTrigger className="mt-1.5">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <Label htmlFor="bio" className="text-sm font-medium">Bio / Description</Label>
              <Textarea
                id="bio"
                name="bio"
                value={values.bio}
                onChange={handleChange}
                rows={4}
                className="mt-1.5 resize-none"
                placeholder="Add a brief description about this contact..."
              />
            </div>

            <div>
              <Label htmlFor="interests" className="text-sm font-medium">Interests</Label>
              <Input
                id="interests"
                value={interestInput}
                onChange={(e) => setInterestInput(e.target.value)}
                onKeyDown={handleInterestKeyDown}
                placeholder="Type and press Enter to add"
                className="mt-1.5"
              />
              {values.interests.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {values.interests.map((interest, index) => (
                    <Badge 
                      key={index} 
                      variant="secondary"
                      className="px-2.5 py-1 flex items-center gap-1.5 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100"
                    >
                      <Heart className="h-3 w-3" />
                      {interest}
                      <button
                        type="button"
                        onClick={() => removeInterest(interest)}
                        className="ml-1 hover:text-destructive transition-colors"
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <div>
              <Label htmlFor="tags" className="text-sm font-medium">Tags</Label>
              <Input
                id="tags"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagKeyDown}
                placeholder="Type and press Enter to add"
                className="mt-1.5"
              />
              {values.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {values.tags.map((tag, index) => (
                    <Badge 
                      key={index} 
                      variant="secondary"
                      className="px-2.5 py-1 flex items-center gap-1.5"
                    >
                      <TagIcon className="h-3 w-3" />
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="ml-1 hover:text-destructive transition-colors"
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <div>
              <Label htmlFor="notes" className="text-sm font-medium">Notes</Label>
              <Textarea
                id="notes"
                name="notes"
                value={values.notes}
                onChange={handleChange}
                rows={4}
                className="mt-1.5 resize-none"
                placeholder="Any additional notes or details..."
              />
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-between items-center pt-6 border-t">
        <Button
          type="button"
          variant="outline"
          onClick={currentStep === 1 ? onCancel : handleBack}
          disabled={isSubmitting}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          {currentStep === 1 ? "Cancel" : "Back"}
        </Button>

        {currentStep < 3 ? (
          <Button
            type="button"
            onClick={handleNext}
            disabled={!canProceed()}
            className="min-w-[120px]"
          >
            Next
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        ) : (
          <Button
            type="submit"
            disabled={isSubmitting || !canProceed()}
            className="min-w-[120px]"
          >
            {isSubmitting ? (
              "Creating..."
            ) : (
              <>
                <Check className="w-4 h-4 mr-2" />
                Create Contact
              </>
            )}
          </Button>
        )}
      </div>
    </form>
  );
};

export default ContactCreateWizard;
