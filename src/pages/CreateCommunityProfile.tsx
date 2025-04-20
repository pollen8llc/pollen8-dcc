import React, { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

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
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCheckbox = (platform: string) => {
    setForm(prev => ({
      ...prev,
      platforms: prev.platforms.includes(platform)
        ? prev.platforms.filter(p => p !== platform)
        : [...prev.platforms, platform]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Add any basic validation here if needed

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

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background py-12 px-4">
      <div className="w-full max-w-xl rounded-xl shadow-lg p-8 bg-card border border-primary/10 space-y-6">
        <h2 className="text-3xl font-bold mb-2 text-center">Create Community Profile</h2>
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="block font-medium mb-1">Name *</label>
            <Input
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              placeholder="Your Community Name"
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Description *</label>
            <Textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              required
              minLength={10}
              placeholder="Describe your community"
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Type *</label>
            <select
              name="type"
              className="w-full border rounded py-2 px-3"
              value={form.type}
              onChange={handleChange}
              required
            >
              <option value="">Select type...</option>
              <option value="tech">Tech</option>
              <option value="wellness">Wellness</option>
              <option value="creative">Creative</option>
              <option value="professional">Professional</option>
              <option value="social-impact">Social Impact</option>
              <option value="education">Education</option>
              <option value="social">Social</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label className="block font-medium mb-1">Location *</label>
            <Input
              name="location"
              value={form.location}
              onChange={handleChange}
              placeholder="City, Region, or Global"
              required
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Website</label>
            <Input
              name="website"
              type="url"
              value={form.website}
              onChange={handleChange}
              placeholder="https://yourcommunity.com"
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Platforms</label>
            <div className="flex flex-wrap gap-4 mb-2">
              {defaultPlatforms.map(platform => (
                <div key={platform} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id={platform}
                    checked={form.platforms.includes(platform)}
                    onChange={() => handleCheckbox(platform)}
                  />
                  <label htmlFor={platform}>{platform}</label>
                </div>
              ))}
            </div>
          </div>
          <div>
            <label className="block font-medium mb-1">Socials</label>
            <div className="grid grid-cols-2 gap-4">
              <Input
                name="twitter"
                value={form.twitter}
                onChange={handleChange}
                placeholder="Twitter handle"
              />
              <Input
                name="instagram"
                value={form.instagram}
                onChange={handleChange}
                placeholder="Instagram handle"
              />
              <Input
                name="linkedin"
                value={form.linkedin}
                onChange={handleChange}
                placeholder="LinkedIn URL"
              />
              <Input
                name="facebook"
                value={form.facebook}
                onChange={handleChange}
                placeholder="Facebook URL"
              />
            </div>
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Creating..." : "Create Community"}
          </Button>
        </form>
      </div>
    </div>
  );
}
