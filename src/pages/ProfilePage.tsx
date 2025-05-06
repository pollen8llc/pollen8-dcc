
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useUser } from "@/contexts/UserContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import ProfileView from "@/components/profile/ProfileView";
import ProfileEdit from "@/components/profile/ProfileEdit";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Edit, Eye, AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface ProfileData {
  id: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  bio?: string;
  location?: string;
  avatar_url?: string;
  created_at: string;
  interests?: string[];
  social_links?: Record<string, string>;
  privacy_settings?: {
    profile_visibility: "public" | "connections" | "connections2" | "connections3" | "private";
  };
  profile_complete?: boolean;
}

const ProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { currentUser } = useUser();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const isOwnProfile = currentUser && (!id || id === currentUser.id);
  const profileId = id || currentUser?.id;

  // Fetch profile data
  useEffect(() => {
    async function fetchProfile() {
      if (!profileId) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        // Check if user is authenticated
        if (!currentUser) {
          console.log("User not authenticated, redirecting to login");
          navigate("/auth?redirectTo=" + window.location.pathname);
          return;
        }
        
        // Get profile data
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', profileId)
          .single();
          
        if (error) {
          console.error("Error fetching profile:", error);
          
          if (error.code === 'PGRST116') {
            setError("Profile not found");
          } else {
            setError("Failed to load profile data: " + error.message);
          }
          return;
        }
        
        if (!data) {
          setError("Profile not found");
          return;
        }
        
        // Parse JSON fields
        const social_links = data.social_links ? 
          (typeof data.social_links === 'string' ? 
            JSON.parse(data.social_links) : data.social_links) : {};
            
        const privacy_settings = data.privacy_settings ? 
          (typeof data.privacy_settings === 'string' ? 
            JSON.parse(data.privacy_settings) : data.privacy_settings) : { 
              profile_visibility: "connections" 
            };
        
        setProfile({
          ...data,
          social_links,
          privacy_settings,
        });
      } catch (error: any) {
        console.error("Error in fetchProfile:", error);
        setError("An unexpected error occurred: " + (error.message || "Unknown error"));
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchProfile();
  }, [profileId, isEditing, currentUser, navigate]);

  // Handle profile update
  const handleProfileUpdate = async (updatedProfile: Partial<ProfileData>) => {
    if (!currentUser || !isOwnProfile) return;
    
    try {
      setError(null);
      const { data, error } = await supabase
        .from('profiles')
        .update({
          ...updatedProfile,
          updated_at: new Date().toISOString(),
          privacy_settings: {
            ...updatedProfile.privacy_settings,
            profile_visibility: updatedProfile.privacy_settings?.profile_visibility || "public" // Default to public
          }
        })
        .eq('id', currentUser.id)
        .select()
        .single();
        
      if (error) {
        console.error("Error updating profile:", error);
        setError("Update failed: " + error.message);
        toast({
          title: "Update failed",
          description: error.message,
          variant: "destructive",
        });
        return;
      }
      
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
      
      setIsEditing(false);
      
      // Parse JSON fields for updated profile
      const social_links = data.social_links ? 
        (typeof data.social_links === 'string' ? 
          JSON.parse(data.social_links) : data.social_links) : {};
          
      const privacy_settings = data.privacy_settings ? 
        (typeof data.privacy_settings === 'string' ? 
          JSON.parse(data.privacy_settings) : data.privacy_settings) : { 
            profile_visibility: "public" 
          };
      
      setProfile({
        ...data,
        social_links,
        privacy_settings,
      });
    } catch (error: any) {
      console.error("Error in handleProfileUpdate:", error);
      setError("Update failed: " + (error.message || "Unknown error"));
      toast({
        title: "Update failed",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container mx-auto py-8 px-4">
          <div className="flex justify-center items-center min-h-[50vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container mx-auto py-8 px-4">
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <AlertCircle className="h-5 w-5 text-red-500" />
                <h2 className="text-xl font-semibold">Error</h2>
              </div>
            </CardHeader>
            <CardContent>
              <Alert variant="destructive" className="mb-4">
                <AlertTitle>Profile Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
              <div className="flex gap-2 mt-4">
                <Button onClick={() => navigate("/")}>Go Home</Button>
                {!isOwnProfile && currentUser && (
                  <Button variant="outline" onClick={() => navigate("/profile")}>
                    View Your Profile
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="container mx-auto py-8 px-4">
        {isOwnProfile && (
          <div className="flex justify-end mb-4">
            <Button
              variant="outline"
              onClick={() => setIsEditing(!isEditing)}
              className="flex items-center gap-2"
            >
              {isEditing ? (
                <>
                  <Eye className="h-4 w-4" />
                  View Mode
                </>
              ) : (
                <>
                  <Edit className="h-4 w-4" />
                  Edit Profile
                </>
              )}
            </Button>
          </div>
        )}
        
        {isEditing && isOwnProfile ? (
          <ProfileEdit 
            profile={profile} 
            onUpdate={handleProfileUpdate} 
            onCancel={() => setIsEditing(false)}
          />
        ) : (
          <ProfileView 
            profile={profile}
            isOwnProfile={isOwnProfile}
            onEdit={() => setIsEditing(true)}
          />
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
