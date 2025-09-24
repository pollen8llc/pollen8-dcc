
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/contexts/UserContext";
import { useProfiles } from "@/hooks/useProfiles";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Loader2, X, Plus, Lock, Users, Globe, Network } from "lucide-react";
import LocationInterestsStep from "./wizard-steps/LocationInterestsStep";
import SocialLinksStep from "./wizard-steps/SocialLinksStep";
import { ExtendedProfile } from "@/services/profileService";

const ProfileEditor = () => {
  const { currentUser, refreshUser } = useUser();
  const { getProfileById, updateProfile } = useProfiles();
  const { toast } = useToast();
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [profile, setProfile] = useState<ExtendedProfile | null>(null);
  const [formData, setFormData] = useState<Partial<ExtendedProfile>>({});
  const [activeTab, setActiveTab] = useState("basic");
  
  useEffect(() => {
    const fetchProfileData = async () => {
      if (currentUser) {
        setIsLoading(true);
        try {
          const fetchedProfile = await getProfileById(currentUser.id);
          setProfile(fetchedProfile);
          
          setFormData({
            first_name: fetchedProfile?.first_name || currentUser?.name?.split(' ')[0] || '',
            last_name: fetchedProfile?.last_name || currentUser?.name?.split(' ').slice(1).join(' ') || '',
            
            bio: fetchedProfile?.bio || '',
            location: fetchedProfile?.location || '',
            interests: fetchedProfile?.interests || [],
            social_links: fetchedProfile?.social_links || {},
            privacy_settings: fetchedProfile?.privacy_settings || { profile_visibility: "connections" },
          });
        } catch (error) {
          console.error("Error fetching profile:", error);
          toast({
            title: "Error",
            description: "Failed to load profile data",
            variant: "destructive",
          });
        } finally {
          setIsLoading(false);
        }
      }
    };
    
    fetchProfileData();
  }, [currentUser, getProfileById, toast]);
  
  const handleUpdateFormData = (data: Partial<ExtendedProfile>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };
  
  const handleSubmit = async () => {
    if (!currentUser) return;
    
    setIsSubmitting(true);
    try {
      const dataToUpdate = {
        ...formData,
        id: currentUser.id,
        profile_complete: true,
      };
      
      const updatedProfile = await updateProfile(dataToUpdate);
      
      if (updatedProfile) {
        await refreshUser();
        
        toast({
          title: "Profile updated",
          description: "Your profile has been successfully updated.",
        });
      } else {
        throw new Error("Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  const getInitials = () => {
    const first = formData.first_name?.charAt(0) || "";
    const last = formData.last_name?.charAt(0) || "";
    return (first + last).toUpperCase();
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit Profile</CardTitle>
        <CardDescription>
          Update your profile information and privacy settings
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="details">Details & Interests</TabsTrigger>
            <TabsTrigger value="privacy">Privacy</TabsTrigger>
          </TabsList>
          
          <TabsContent value="basic" className="pt-6">
            <div className="space-y-6">
              <div className="flex flex-col items-center mb-6">
                <div className="mb-4">
                  <Avatar className="w-24 h-24">
                    <AvatarFallback userId={currentUser?.id} useDynamicAvatar={true}>{getInitials() || "??"}</AvatarFallback>
                  </Avatar>
                </div>
                <p className="text-sm text-muted-foreground text-center">
                  Your avatar is managed through the dynamic avatar system
                </p>
              </div>
      
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    placeholder="Your first name"
                    value={formData.first_name}
                    onChange={(e) => handleUpdateFormData({ first_name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    placeholder="Your last name"
                    value={formData.last_name}
                    onChange={(e) => handleUpdateFormData({ last_name: e.target.value })}
                  />
                </div>
              </div>
      
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  placeholder="Tell us a bit about yourself..."
                  value={formData.bio}
                  onChange={(e) => handleUpdateFormData({ bio: e.target.value })}
                  rows={4}
                />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="details" className="pt-6">
            <div className="space-y-6">
              <LocationInterestsStep formData={formData} updateFormData={handleUpdateFormData} />
              <Separator className="my-6" />
              <SocialLinksStep formData={formData} updateFormData={handleUpdateFormData} />
            </div>
          </TabsContent>
          
          <TabsContent value="privacy" className="pt-6">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium">Privacy Settings</h3>
                <p className="text-sm text-muted-foreground">
                  Control who can view your profile information
                </p>
              </div>
        
              <div className="space-y-4">
                <Label>Who can see your profile?</Label>
                
                <RadioGroup 
                  value={formData.privacy_settings?.profile_visibility}
                  onValueChange={(val) => handleUpdateFormData({
                    privacy_settings: {
                      ...formData.privacy_settings,
                      profile_visibility: val as "public" | "connections" | "connections2" | "connections3" | "private"
                    }
                  })}
                  className="space-y-3"
                >
                  <div className="flex items-center space-x-2 border rounded-md p-3 hover:bg-accent transition-colors">
                    <RadioGroupItem value="public" id="public" />
                    <Label htmlFor="public" className="flex items-center gap-2 font-normal cursor-pointer flex-1">
                      <Globe className="h-4 w-4 text-blue-500" />
                      <div>
                        <p>Everyone (Public)</p>
                        <p className="text-xs text-muted-foreground">Anyone can view your full profile</p>
                      </div>
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2 border rounded-md p-3 hover:bg-accent transition-colors">
                    <RadioGroupItem value="connections" id="connections" />
                    <Label htmlFor="connections" className="flex items-center gap-2 font-normal cursor-pointer flex-1">
                      <Users className="h-4 w-4 text-green-500" />
                      <div>
                        <p>Direct Connections Only</p>
                        <p className="text-xs text-muted-foreground">Only people directly connected to you can view your profile</p>
                      </div>
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2 border rounded-md p-3 hover:bg-accent transition-colors">
                    <RadioGroupItem value="connections2" id="connections2" />
                    <Label htmlFor="connections2" className="flex items-center gap-2 font-normal cursor-pointer flex-1">
                      <Network className="h-4 w-4 text-purple-500" />
                      <div>
                        <p>2nd Degree Connections</p>
                        <p className="text-xs text-muted-foreground">Your connections and their connections can view your profile</p>
                      </div>
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2 border rounded-md p-3 hover:bg-accent transition-colors">
                    <RadioGroupItem value="connections3" id="connections3" />
                    <Label htmlFor="connections3" className="flex items-center gap-2 font-normal cursor-pointer flex-1">
                      <Network className="h-4 w-4 text-orange-500" />
                      <div>
                        <p>Extended Network (3rd degree)</p>
                        <p className="text-xs text-muted-foreground">Connections up to 3 degrees away can view your profile</p>
                      </div>
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2 border rounded-md p-3 hover:bg-accent transition-colors">
                    <RadioGroupItem value="private" id="private" />
                    <Label htmlFor="private" className="flex items-center gap-2 font-normal cursor-pointer flex-1">
                      <Lock className="h-4 w-4 text-red-500" />
                      <div>
                        <p>Only You (Private)</p>
                        <p className="text-xs text-muted-foreground">Only you can see your profile information</p>
                      </div>
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={() => history.back()}>
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            "Save Changes"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProfileEditor;
