
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useUser } from "@/contexts/UserContext";
import Navbar from "@/components/Navbar";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Card, 
  CardContent, 
  CardDescription,
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { MapPin, Edit, UserCheck } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useToast } from "@/hooks/use-toast";

interface ProfileData {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  bio: string | null;
  location: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
  interests: string[] | null;
  social_links: Record<string, string> | null;
  privacy_settings: {
    profile_visibility: string;
  };
  profile_complete: boolean;
  // Add other fields that might be in the database but not used here
  user_id?: string;
  invited_by?: string | null;
}

const ProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { currentUser } = useUser();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isOwnProfile = currentUser && (!id || id === currentUser.id);

  useEffect(() => {
    async function fetchProfile() {
      setIsLoading(true);
      setError(null);
      
      try {
        const profileId = id || currentUser?.id;
        if (!profileId) {
          setError("No profile ID provided");
          setIsLoading(false);
          return;
        }
        
        // Fetch profile data from Supabase
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', profileId)
          .single();
          
        if (error) {
          console.error("Error fetching profile:", error);
          setError("Failed to load profile data");
          return;
        }
        
        if (!data) {
          setError("Profile not found");
          return;
        }
        
        // Convert data.social_links from any JSON type to Record<string, string>
        const social_links = data.social_links ? 
          (typeof data.social_links === 'string' ? 
            JSON.parse(data.social_links) : data.social_links) as Record<string, string> : null;
            
        // Similarly handle privacy_settings
        const privacy_settings = data.privacy_settings ? 
          (typeof data.privacy_settings === 'string' ? 
            JSON.parse(data.privacy_settings) : data.privacy_settings) : { profile_visibility: "connections" };
        
        // Create a ProfileData object with properly typed fields
        const profileData: ProfileData = {
          id: data.id,
          first_name: data.first_name || '',
          last_name: data.last_name || '',
          email: data.email || '',
          bio: data.bio,
          location: data.location,
          avatar_url: data.avatar_url,
          created_at: data.created_at,
          updated_at: data.updated_at,
          interests: data.interests,
          social_links: social_links,
          privacy_settings: privacy_settings,
          profile_complete: !!data.profile_complete,
          user_id: data.user_id,
          invited_by: data.invited_by,
        };
        
        setProfile(profileData);
      } catch (error) {
        console.error("Error in fetchProfile:", error);
        setError("An unexpected error occurred");
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchProfile();
  }, [id, currentUser]);

  const getFullName = () => {
    if (!profile) return "";
    
    return [profile.first_name, profile.last_name]
      .filter(Boolean)
      .join(" ") || "Anonymous User";
  };

  const getInitials = () => {
    if (!profile) return "?";
    
    const firstName = profile.first_name || '';
    const lastName = profile.last_name || '';
    
    if (firstName && lastName) {
      return `${firstName[0]}${lastName[0]}`.toUpperCase();
    } else if (firstName) {
      return firstName[0].toUpperCase();
    } else if (lastName) {
      return lastName[0].toUpperCase();
    }
    
    return '?';
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container mx-auto py-8">
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
        <div className="container mx-auto py-8">
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle>Error</CardTitle>
              <CardDescription>{error}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => navigate("/")}>Go Home</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // No profile state
  if (!profile) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container mx-auto py-8">
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle>Profile Not Found</CardTitle>
              <CardDescription>The requested profile could not be found.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => navigate("/")}>Go Home</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-4xl mx-auto">
          <CardHeader className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={profile.avatar_url || ""} alt={getFullName()} />
                <AvatarFallback>{getInitials()}</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-2xl">{getFullName()}</CardTitle>
                {profile.location && (
                  <div className="flex items-center text-muted-foreground mt-1">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>{profile.location}</span>
                  </div>
                )}
                <CardDescription className="mt-1">
                  Member since {formatDistanceToNow(new Date(profile.created_at), { addSuffix: true })}
                </CardDescription>
              </div>
            </div>
            {isOwnProfile && (
              <div className="flex gap-2">
                <Button 
                  onClick={() => navigate("/profile/setup")}
                  variant="outline"
                >
                  <Edit className="h-4 w-4 mr-2" /> Edit Profile
                </Button>
              </div>
            )}
          </CardHeader>
          
          <CardContent className="space-y-6">
            {profile.bio && (
              <div className="space-y-2">
                <h3 className="font-medium">About</h3>
                <p className="text-muted-foreground">{profile.bio}</p>
              </div>
            )}
            
            <Separator />
            
            {profile.interests && profile.interests.length > 0 && (
              <div className="space-y-2">
                <h3 className="font-medium">Interests</h3>
                <div className="flex flex-wrap gap-2">
                  {profile.interests.map((interest, idx) => (
                    <Badge key={idx} variant="secondary">{interest}</Badge>
                  ))}
                </div>
              </div>
            )}
            
            {profile.social_links && Object.keys(profile.social_links).length > 0 && (
              <div className="space-y-2">
                <h3 className="font-medium">Social Links</h3>
                <div className="flex flex-wrap gap-4">
                  {Object.entries(profile.social_links).map(([platform, url]) => (
                    <a 
                      key={platform}
                      href={url.startsWith('http') ? url : `https://${url}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      {platform}
                    </a>
                  ))}
                </div>
              </div>
            )}
            
            {isOwnProfile && (
              <div className="mt-8 bg-muted p-4 rounded-lg">
                <div className="flex items-center gap-2">
                  <UserCheck className="h-5 w-5" />
                  <span className="font-medium">Profile Status: </span>
                  {profile.profile_complete ? (
                    <Badge>Complete</Badge>
                  ) : (
                    <Badge variant="destructive">Incomplete</Badge>
                  )}
                </div>
                {!profile.profile_complete && (
                  <Button 
                    onClick={() => navigate("/profile/setup")} 
                    className="mt-2"
                  >
                    Complete Your Profile
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfilePage;
