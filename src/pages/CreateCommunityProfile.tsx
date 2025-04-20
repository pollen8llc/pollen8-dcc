
import React, { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { AlertCircle } from "lucide-react";

const defaultPlatforms = [
  "Discord", "Slack", "WhatsApp", "Luma", "Meetup", "Circle"
];

export default function CreateCommunityProfile() {
  const [form, setForm] = useState({
    name: "",
    description: "",
    type: "",
    location: "",
    website: "",
    platforms: [] as string[],
    twitter: "",
    instagram: "",
    linkedin: "",
    facebook: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSelectChange = (value: string, name: string) => {
    setForm({ ...form, [name]: value });
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleCheckbox = (platform: string) => {
    setForm(prev => ({
      ...prev,
      platforms: prev.platforms.includes(platform)
        ? prev.platforms.filter(p => p !== platform)
        : [...prev.platforms, platform]
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!form.name.trim()) {
      newErrors.name = "Name is required";
    }
    
    if (!form.description.trim()) {
      newErrors.description = "Description is required";
    } else if (form.description.trim().length < 10) {
      newErrors.description = "Description must be at least 10 characters";
    }
    
    if (!form.type) {
      newErrors.type = "Type is required";
    }
    
    if (!form.location.trim()) {
      newErrors.location = "Location is required";
    }
    
    if (form.website && !/^https?:\/\/.+/.test(form.website)) {
      newErrors.website = "Please enter a valid URL starting with http:// or https://";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Please fix the errors in the form",
      });
      return;
    }
    
    setLoading(true);

    try {
      // Get current user
      const session = await supabase.auth.getSession();
      const user = session?.data?.session?.user;
      if (!user) throw new Error("Not authenticated");

      // Build communication_platforms and social_media fields for db
      const communication_platforms = {};
      form.platforms.forEach(p => {
        communication_platforms[p.toLowerCase()] = { enabled: true }
      });
      const social_media = {
        twitter: form.twitter,
        instagram: form.instagram,
        linkedin: form.linkedin,
        facebook: form.facebook,
      };

      const { data, error } = await supabase
        .from("communities")
        .insert({
          name: form.name,
          description: form.description,
          type: form.type,
          location: form.location,
          website: form.website,
          communication_platforms,
          social_media,
          owner_id: user.id,
          is_public: true,
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Community Created!",
        description: "Your community profile has been created.",
      });
      setTimeout(() => navigate(`/community/${data.id}`), 1200);
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: err.message || "Failed to create community."
      });
    } finally {
      setLoading(false);
    }
  };

  const renderFieldError = (fieldName: string) => {
    if (!errors[fieldName]) return null;
    return (
      <div className="text-red-500 text-xs flex items-center mt-1">
        <AlertCircle className="w-3 h-3 mr-1" />
        {errors[fieldName]}
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background py-12 px-4">
      <div className="w-full max-w-xl rounded-xl shadow-lg p-8 bg-card border border-primary/10 space-y-6">
        <h2 className="text-3xl font-bold mb-2 text-center">Create Community Profile</h2>
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <Label htmlFor="name" className="font-medium">
              Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              name="name"
              value={form.name}
              onChange={handleChange}
              className={errors.name ? "border-red-500" : ""}
              placeholder="Your Community Name"
            />
            {renderFieldError("name")}
          </div>
          
          <div>
            <Label htmlFor="description" className="font-medium">
              Description <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="description"
              name="description"
              value={form.description}
              onChange={handleChange}
              className={errors.description ? "border-red-500" : ""}
              minLength={10}
              placeholder="Describe your community (min 10 characters)"
            />
            {renderFieldError("description")}
          </div>
          
          <div>
            <Label htmlFor="type" className="font-medium">
              Type <span className="text-red-500">*</span>
            </Label>
            <Select 
              value={form.type} 
              onValueChange={(value) => handleSelectChange(value, "type")}
            >
              <SelectTrigger id="type" className={errors.type ? "border-red-500" : ""}>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tech">Tech</SelectItem>
                <SelectItem value="wellness">Wellness</SelectItem>
                <SelectItem value="creative">Creative</SelectItem>
                <SelectItem value="professional">Professional</SelectItem>
                <SelectItem value="social-impact">Social Impact</SelectItem>
                <SelectItem value="education">Education</SelectItem>
                <SelectItem value="social">Social</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
            {renderFieldError("type")}
          </div>
          
          <div>
            <Label htmlFor="location" className="font-medium">
              Location <span className="text-red-500">*</span>
            </Label>
            <Input
              id="location"
              name="location"
              value={form.location}
              onChange={handleChange}
              className={errors.location ? "border-red-500" : ""}
              placeholder="City, Region, or Global"
            />
            {renderFieldError("location")}
          </div>
          
          <div>
            <Label htmlFor="website" className="font-medium">
              Website
            </Label>
            <Input
              id="website"
              name="website"
              type="url"
              value={form.website}
              onChange={handleChange}
              className={errors.website ? "border-red-500" : ""}
              placeholder="https://yourcommunity.com"
            />
            {renderFieldError("website")}
          </div>
          
          <div>
            <Label className="font-medium block mb-2">Platforms</Label>
            <div className="flex flex-wrap gap-4">
              {defaultPlatforms.map(platform => (
                <div key={platform} className="flex items-center gap-2">
                  <Checkbox
                    id={platform}
                    checked={form.platforms.includes(platform)}
                    onCheckedChange={() => handleCheckbox(platform)}
                  />
                  <Label htmlFor={platform} className="cursor-pointer text-sm font-normal">
                    {platform}
                  </Label>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <Label className="font-medium block mb-2">Socials</Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="twitter" className="text-sm">Twitter</Label>
                <Input
                  id="twitter"
                  name="twitter"
                  value={form.twitter}
                  onChange={handleChange}
                  placeholder="Twitter handle"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="instagram" className="text-sm">Instagram</Label>
                <Input
                  id="instagram"
                  name="instagram"
                  value={form.instagram}
                  onChange={handleChange}
                  placeholder="Instagram handle"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="linkedin" className="text-sm">LinkedIn</Label>
                <Input
                  id="linkedin"
                  name="linkedin"
                  value={form.linkedin}
                  onChange={handleChange}
                  placeholder="LinkedIn URL"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="facebook" className="text-sm">Facebook</Label>
                <Input
                  id="facebook"
                  name="facebook"
                  value={form.facebook}
                  onChange={handleChange}
                  placeholder="Facebook URL"
                  className="mt-1"
                />
              </div>
            </div>
          </div>
          
          <Button 
            type="submit" 
            className="w-full mt-6" 
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Community"}
          </Button>
        </form>
      </div>
    </div>
  );
}
