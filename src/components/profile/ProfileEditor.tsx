import React, { useEffect, useState } from "react";
import { useProfiles } from "@/hooks/useProfiles";
import { useUser } from "@/contexts/UserContext";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { ExtendedProfile } from "@/services/profileService";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

// Form schema for profile editor
const profileFormSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  bio: z.string().optional(),
  location: z.string().optional(),
  avatar_url: z.string().optional(),
  privacy_settings: z.object({
    profile_visibility: z.enum(["public", "connections", "connections2", "connections3", "private"]),
  }),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

const ProfileEditor: React.FC = () => {
  const { updateProfile, getProfileById, isLoading } = useProfiles();
  const { currentUser } = useUser();
  const [interests, setInterests] = useState<string[]>([]);
  const [newInterest, setNewInterest] = useState("");
  const [socialLinks, setSocialLinks] = useState<Record<string, string>>({});
  const [newSocialPlatform, setNewSocialPlatform] = useState("");
  const [newSocialUrl, setNewSocialUrl] = useState("");

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      bio: "",
      location: "",
      avatar_url: "",
      privacy_settings: {
        profile_visibility: "connections",
      },
    },
  });

  // Load initial profile data
  useEffect(() => {
    const loadProfile = async () => {
      if (!currentUser) return;
      
      const profile = await getProfileById(currentUser.id);
      if (profile) {
        // Set form values
        form.reset({
          first_name: profile.first_name || "",
          last_name: profile.last_name || "",
          bio: profile.bio || "",
          location: profile.location || "",
          avatar_url: profile.avatar_url || "",
          privacy_settings: profile.privacy_settings || {
            profile_visibility: "connections",
          },
        });
        
        // Set interests and social links
        setInterests(profile.interests || []);
        setSocialLinks(profile.social_links || {});
      }
    };
    
    loadProfile();
  }, [currentUser, getProfileById]);

  const handleAddInterest = () => {
    if (!newInterest.trim()) return;
    
    if (!interests.includes(newInterest.trim())) {
      setInterests([...interests, newInterest.trim()]);
    }
    
    setNewInterest("");
  };

  const handleRemoveInterest = (interest: string) => {
    setInterests(interests.filter((i) => i !== interest));
  };

  const handleAddSocialLink = () => {
    if (!newSocialPlatform.trim() || !newSocialUrl.trim()) return;
    
    setSocialLinks({
      ...socialLinks,
      [newSocialPlatform.trim()]: newSocialUrl.trim(),
    });
    
    setNewSocialPlatform("");
    setNewSocialUrl("");
  };

  const handleRemoveSocialLink = (platform: string) => {
    const updatedLinks = { ...socialLinks };
    delete updatedLinks[platform];
    setSocialLinks(updatedLinks);
  };

  const onSubmit = async (values: ProfileFormValues) => {
    if (!currentUser) return;
    
    // Ensure privacy_settings has required property
    const privacy_settings = {
      profile_visibility: values.privacy_settings.profile_visibility
    };
    
    const updatedProfile: Partial<ExtendedProfile> = {
      id: currentUser.id,
      ...values,
      interests,
      social_links: socialLinks,
      privacy_settings: privacy_settings
    };
    
    await updateProfile(updatedProfile);
  };

  if (!currentUser) {
    return <div>You need to be logged in to edit your profile.</div>;
  }

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Edit Profile</h2>
        <p className="text-muted-foreground">Update your profile information and privacy settings.</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Avatar */}
          <div className="flex items-center gap-4">
            <Avatar className="h-24 w-24">
              <AvatarImage src={form.watch("avatar_url")} />
              <AvatarFallback>
                {`${form.watch("first_name")?.[0] || ""}${form.watch("last_name")?.[0] || ""}`}
              </AvatarFallback>
            </Avatar>

            <FormField
              control={form.control}
              name="avatar_url"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Avatar URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com/avatar.png" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="first_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="last_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location</FormLabel>
                <FormControl>
                  <Input placeholder="City, Country" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="bio"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bio</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Tell others about yourself" 
                    {...field} 
                    className="min-h-[120px]"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Interests */}
          <div className="space-y-4">
            <Label>Interests</Label>
            
            <div className="flex flex-wrap gap-2">
              {interests.map((interest, index) => (
                <Badge key={index} variant="secondary" className="px-2 py-1">
                  {interest}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-4 w-4 ml-1"
                    onClick={() => handleRemoveInterest(interest)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
            </div>
            
            <div className="flex gap-2">
              <Input
                placeholder="Add an interest"
                value={newInterest}
                onChange={(e) => setNewInterest(e.target.value)}
                className="flex-1"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddInterest();
                  }
                }}
              />
              <Button type="button" onClick={handleAddInterest}>
                Add
              </Button>
            </div>
          </div>

          {/* Social Links */}
          <div className="space-y-4">
            <Label>Social Links</Label>
            
            {Object.entries(socialLinks).length > 0 && (
              <div className="space-y-2">
                {Object.entries(socialLinks).map(([platform, url]) => (
                  <div key={platform} className="flex items-center justify-between p-2 border rounded-md">
                    <div>
                      <span className="font-medium">{platform}:</span>{" "}
                      <a 
                        href={url.startsWith("http") ? url : `https://${url}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline"
                      >
                        {url}
                      </a>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveSocialLink(platform)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr_auto] gap-2">
              <Input
                placeholder="Platform"
                value={newSocialPlatform}
                onChange={(e) => setNewSocialPlatform(e.target.value)}
              />
              <Input
                placeholder="URL"
                value={newSocialUrl}
                onChange={(e) => setNewSocialUrl(e.target.value)}
              />
              <Button type="button" onClick={handleAddSocialLink}>
                Add
              </Button>
            </div>
          </div>

          {/* Privacy Settings */}
          <FormField
            control={form.control}
            name="privacy_settings.profile_visibility"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Profile Visibility</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Who can see your profile" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="public">Everyone (Public)</SelectItem>
                    <SelectItem value="connections">Direct Connections Only</SelectItem>
                    <SelectItem value="connections2">Connections of Connections (2nd degree)</SelectItem>
                    <SelectItem value="connections3">Extended Network (3rd degree)</SelectItem>
                    <SelectItem value="private">Private (Only you)</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Profile"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default ProfileEditor;
