
import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusCircle, X, Save, User, Link, Settings } from "lucide-react";
import { LocationSelector } from "@/components/ui/location-selector";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

// Form schema for profile editing
const profileSchema = z.object({
  first_name: z.string().optional(),
  last_name: z.string().optional(),
  bio: z.string().optional(),
  location: z.string().optional(),
  
  interests: z.array(z.string()).optional(),
  privacy_settings: z.object({
    profile_visibility: z.enum(["public", "connections", "connections2", "connections3", "private"])
  }).optional(),
  social_links: z.record(z.string()).optional(),
});

interface ProfileEditProps {
  profile: any;
  onUpdate: (data: any) => Promise<void>;
  onCancel: () => void;
}

const ProfileEdit: React.FC<ProfileEditProps> = ({ profile, onUpdate, onCancel }) => {
  const [activeTab, setActiveTab] = useState("personal");
  const [newInterest, setNewInterest] = useState("");
  const [newSocialPlatform, setNewSocialPlatform] = useState("");
  const [newSocialUrl, setNewSocialUrl] = useState("");
  
  const { toast } = useToast();

  // Initialize the form with existing profile data
  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      first_name: profile?.first_name || "",
      last_name: profile?.last_name || "",
      bio: profile?.bio || "",
      location: profile?.location || "",
      
      interests: profile?.interests || [],
      privacy_settings: profile?.privacy_settings || { profile_visibility: "connections" },
      social_links: profile?.social_links || {},
    },
  });

  // Handle form submission
  const onSubmit = async (data: z.infer<typeof profileSchema>) => {
    await onUpdate({
      ...data,
      profile_complete: true,
    });
  };


  // Handle adding a new interest
  const handleAddInterest = () => {
    if (!newInterest.trim()) return;
    
    const currentInterests = form.getValues("interests") || [];
    if (currentInterests.includes(newInterest.trim())) {
      toast({
        title: "Duplicate interest",
        description: "This interest has already been added.",
        variant: "destructive",
      });
      return;
    }
    
    form.setValue("interests", [...currentInterests, newInterest.trim()]);
    setNewInterest("");
  };

  // Handle removing an interest
  const handleRemoveInterest = (interest: string) => {
    const currentInterests = form.getValues("interests") || [];
    form.setValue(
      "interests",
      currentInterests.filter((i) => i !== interest)
    );
  };

  // Handle adding a new social link
  const handleAddSocialLink = () => {
    if (!newSocialPlatform.trim() || !newSocialUrl.trim()) return;
    
    const currentLinks = form.getValues("social_links") || {};
    
    // Update social links
    form.setValue("social_links", {
      ...currentLinks,
      [newSocialPlatform.toLowerCase().trim()]: newSocialUrl.trim(),
    });
    
    // Reset inputs
    setNewSocialPlatform("");
    setNewSocialUrl("");
  };

  // Handle removing a social link
  const handleRemoveSocialLink = (platform: string) => {
    const currentLinks = form.getValues("social_links") || {};
    const updatedLinks = { ...currentLinks };
    delete updatedLinks[platform];
    form.setValue("social_links", updatedLinks);
  };

  return (
    <Card className="max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Edit Your Profile</CardTitle>
      </CardHeader>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="personal" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">Personal</span>
              </TabsTrigger>
              <TabsTrigger value="bio" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">Bio</span>
              </TabsTrigger>
              <TabsTrigger value="social" className="flex items-center gap-2">
                <Link className="h-4 w-4" />
                <span className="hidden sm:inline">Social</span>
              </TabsTrigger>
              <TabsTrigger value="privacy" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                <span className="hidden sm:inline">Privacy</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="personal" className="p-4">
              <div className="space-y-6">
                {/* Avatar Section */}
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <Avatar className="h-24 w-24">
                    <AvatarFallback useDynamicAvatar={true}>
                      {form.watch("first_name")?.[0]?.toUpperCase() || "?"}
                      {form.watch("last_name")?.[0]?.toUpperCase() || ""}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex flex-col gap-2">
                    <p className="text-sm text-muted-foreground">
                      Your avatar is managed through the dynamic avatar system
                    </p>
                  </div>
                </div>
                
                {/* Name Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="first_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John" {...field} />
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
                          <Input placeholder="Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                {/* Location */}
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <LocationSelector
                          value={field.value}
                          onValueChange={field.onChange}
                          placeholder="Select your location"
                          allowCustomInput={true}
                          showHierarchy={true}
                        />
                      </FormControl>
                      <FormDescription>
                        Share your city or country
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {/* Interests */}
                <FormField
                  control={form.control}
                  name="interests"
                  render={() => (
                    <FormItem>
                      <FormLabel>Interests</FormLabel>
                      <FormControl>
                        <div className="space-y-3">
                          <div className="flex flex-wrap gap-2">
                            {form.watch("interests")?.map((interest) => (
                              <Badge key={interest} variant="secondary" className="px-3 py-1">
                                {interest}
                                <button
                                  type="button"
                                  onClick={() => handleRemoveInterest(interest)}
                                  className="ml-2 text-muted-foreground hover:text-foreground transition-colors"
                                >
                                  <X className="h-3 w-3" />
                                </button>
                              </Badge>
                            ))}
                          </div>
                          
                          <div className="flex gap-2">
                            <Input
                              placeholder="Add an interest"
                              value={newInterest}
                              onChange={(e) => setNewInterest(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  e.preventDefault();
                                  handleAddInterest();
                                }
                              }}
                            />
                            <Button 
                              type="button" 
                              variant="outline" 
                              size="icon"
                              onClick={handleAddInterest}
                            >
                              <PlusCircle className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </FormControl>
                      <FormDescription>
                        Add your interests to connect with like-minded individuals
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </TabsContent>
            
            <TabsContent value="bio" className="p-4">
              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bio</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Tell us about yourself..."
                        className="min-h-[200px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Share a brief description about yourself, your background, and what you're passionate about.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </TabsContent>
            
            <TabsContent value="social" className="p-4">
              <div className="space-y-6">
                <FormField
                  control={form.control}
                  name="social_links"
                  render={() => (
                    <FormItem>
                      <FormLabel>Social Links</FormLabel>
                      <FormControl>
                        <div className="space-y-4">
                          {Object.entries(form.watch("social_links") || {}).map(([platform, url]) => (
                            <div key={platform} className="flex items-center gap-2">
                              <div className="flex-grow grid grid-cols-3 gap-2">
                                <div className="px-3 py-2 border rounded-md bg-muted flex items-center capitalize">
                                  {platform}
                                </div>
                                <Input
                                  value={url as string}
                                  readOnly
                                  className="col-span-2"
                                />
                              </div>
                              <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                onClick={() => handleRemoveSocialLink(platform)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                          
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                            <Input
                              placeholder="Platform (e.g. Twitter)"
                              value={newSocialPlatform}
                              onChange={(e) => setNewSocialPlatform(e.target.value)}
                            />
                            <Input
                              placeholder="URL"
                              value={newSocialUrl}
                              onChange={(e) => setNewSocialUrl(e.target.value)}
                              className="sm:col-span-2"
                            />
                          </div>
                          
                          <Button
                            type="button"
                            variant="outline"
                            onClick={handleAddSocialLink}
                            disabled={!newSocialPlatform || !newSocialUrl}
                            className="w-full"
                          >
                            <PlusCircle className="h-4 w-4 mr-2" />
                            Add Social Link
                          </Button>
                        </div>
                      </FormControl>
                      <FormDescription>
                        Add links to your social media profiles
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </TabsContent>
            
            <TabsContent value="privacy" className="p-4">
              <FormField
                control={form.control}
                name="privacy_settings.profile_visibility"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Profile Visibility</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select privacy level" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="public">Public - Visible to everyone</SelectItem>
                        <SelectItem value="connections">Connections Only - 1st degree</SelectItem>
                        <SelectItem value="connections2">Extended Network - Up to 2nd degree</SelectItem>
                        <SelectItem value="connections3">Broad Network - Up to 3rd degree</SelectItem>
                        <SelectItem value="private">Private - Only visible to you</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Control who can view your profile information
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </TabsContent>
          </Tabs>
          
          <CardFooter className="flex justify-between border-t px-6 py-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onCancel}
            >
              Cancel
            </Button>
            
            <Button 
              type="submit"
              className="flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              Save Changes
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
};

export default ProfileEdit;
