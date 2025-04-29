
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useProfiles } from "@/hooks/useProfiles";
import { useConnections } from "@/hooks/useConnections";
import { useUser } from "@/contexts/UserContext";
import Navbar from "@/components/Navbar";
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
import { 
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog"
import { MapPin, Lock, Globe, Users, Twitter, Linkedin, Facebook, Instagram, Edit, UserCheck } from "lucide-react";
import { ExtendedProfile } from "@/services/profileService";
import { formatDistanceToNow } from "date-fns";

const ProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getProfileById, canViewProfile, isLoading: profileLoading } = useProfiles();
  const { getConnectionDepth, createConnection, isLoading: connectionLoading } = useConnections();
  const { currentUser } = useUser();
  const navigate = useNavigate();
  
  const [profile, setProfile] = useState<ExtendedProfile | null>(null);
  const [connectionDepth, setConnectionDepth] = useState<number | null>(null);
  const [canView, setCanView] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isPrivacyDialogOpen, setIsPrivacyDialogOpen] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  const isOwnProfile = currentUser && id === currentUser.id;
  const isLoading = profileLoading || connectionLoading;

  useEffect(() => {
    const loadProfile = async () => {
      if (!id) return;
      
      // First check if the user can view this profile
      if (!isOwnProfile && currentUser) {
        const hasAccess = await canViewProfile(id);
        setCanView(hasAccess);
        
        if (!hasAccess) {
          setIsPrivacyDialogOpen(true);
          return;
        }
        
        // Get connection depth
        const depth = await getConnectionDepth(id);
        setConnectionDepth(depth);
        setIsConnected(depth === 1);
      } else if (isOwnProfile) {
        setCanView(true);
      } else {
        // User not logged in
        setCanView(false);
        setIsPrivacyDialogOpen(true);
        return;
      }
      
      // Load profile data
      const profileData = await getProfileById(id);
      setProfile(profileData);
    };
    
    loadProfile();
  }, [id, currentUser, isOwnProfile, canViewProfile, getConnectionDepth, getProfileById]);

  const handleConnect = async () => {
    if (!currentUser || !profile) return;
    
    setIsConnecting(true);
    
    try {
      const success = await createConnection(profile.id);
      
      if (success) {
        setIsConnected(true);
        setConnectionDepth(1);
      }
    } catch (error) {
      console.error("Error connecting with user:", error);
    } finally {
      setIsConnecting(false);
    }
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

  const getConnectionBadge = () => {
    if (connectionDepth === null) {
      return null;
    } else if (connectionDepth === 1) {
      return <Badge className="ml-2">1st Connection</Badge>;
    } else if (connectionDepth === 2) {
      return <Badge variant="secondary" className="ml-2">2nd Connection</Badge>;
    } else if (connectionDepth === 3) {
      return <Badge variant="outline" className="ml-2">3rd Connection</Badge>;
    }
    return null;
  };

  const getSocialIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'twitter':
        return <Twitter className="h-4 w-4" />;
      case 'linkedin':
        return <Linkedin className="h-4 w-4" />;
      case 'facebook':
        return <Facebook className="h-4 w-4" />;
      case 'instagram':
        return <Instagram className="h-4 w-4" />;
      default:
        return <Globe className="h-4 w-4" />;
    }
  };

  const getFullName = () => {
    if (!profile) return "";
    
    return [profile.first_name, profile.last_name]
      .filter(Boolean)
      .join(" ") || "Anonymous User";
  };

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="flex justify-center items-center min-h-[70vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-lg">Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Privacy Dialog */}
      <AlertDialog open={isPrivacyDialogOpen} onOpenChange={setIsPrivacyDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Private Profile</AlertDialogTitle>
            <AlertDialogDescription>
              This profile is private or you don't have permission to view it based on the user's privacy settings.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => navigate("/")}>Go Back</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {canView && profile && (
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <Card>
              <CardHeader className="flex flex-col md:flex-row justify-between items-start gap-4">
                <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={profile.avatar_url} alt={getFullName()} />
                    <AvatarFallback>{getInitials()}</AvatarFallback>
                  </Avatar>
                  
                  <div>
                    <div className="flex items-center flex-wrap">
                      <CardTitle className="text-2xl">{getFullName()}</CardTitle>
                      {getConnectionBadge()}
                    </div>
                    
                    {profile.location && (
                      <div className="flex items-center text-muted-foreground mt-2">
                        <MapPin className="h-4 w-4 mr-1" />
                        <span>{profile.location}</span>
                      </div>
                    )}
                    
                    <CardDescription className="mt-2">
                      Member since {formatDistanceToNow(new Date(profile.created_at || Date.now()), { addSuffix: true })}
                    </CardDescription>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  {isOwnProfile ? (
                    <Button onClick={() => navigate("/profile/edit")}>
                      <Edit className="h-4 w-4 mr-2" /> Edit Profile
                    </Button>
                  ) : (
                    <>
                      {isConnected ? (
                        <Button variant="outline" disabled>
                          <UserCheck className="h-4 w-4 mr-2" /> Connected
                        </Button>
                      ) : (
                        <Button onClick={handleConnect} disabled={isConnecting}>
                          {isConnecting ? "Connecting..." : "Connect"}
                        </Button>
                      )}
                    </>
                  )}
                </div>
              </CardHeader>
              
              <CardContent className="space-y-6">
                {profile.bio && (
                  <div className="space-y-2">
                    <h3 className="font-medium">About</h3>
                    <p>{profile.bio}</p>
                  </div>
                )}
                
                <Separator />
                
                {profile.interests && profile.interests.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="font-medium">Interests</h3>
                    <div className="flex flex-wrap gap-2">
                      {profile.interests.map((interest, idx) => (
                        <Badge key={idx} variant="secondary">
                          {interest}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                {profile.social_links && Object.keys(profile.social_links).length > 0 && (
                  <div className="space-y-2">
                    <h3 className="font-medium">Social Links</h3>
                    <div className="flex flex-wrap gap-3">
                      {Object.entries(profile.social_links).map(([platform, url]) => (
                        <a
                          key={platform}
                          href={url.startsWith("http") ? url : `https://${url}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {getSocialIcon(platform)}
                          <span>{platform}</span>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
                
                {isOwnProfile && (
                  <div className="mt-8 p-4 bg-muted rounded-lg">
                    <div className="flex items-start gap-2">
                      <div className="bg-primary-foreground rounded-full p-2">
                        <Lock className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium">Privacy Settings</h4>
                        <p className="text-sm text-muted-foreground">
                          Your profile is visible to: {" "}
                          {profile.privacy_settings?.profile_visibility === "public" && "Everyone (Public)"}
                          {profile.privacy_settings?.profile_visibility === "connections" && "Direct Connections Only"}
                          {profile.privacy_settings?.profile_visibility === "connections2" && "Connections of Connections (2nd degree)"}
                          {profile.privacy_settings?.profile_visibility === "connections3" && "Extended Network (3rd degree)"}
                          {profile.privacy_settings?.profile_visibility === "private" && "Only You (Private)"}
                        </p>
                        <Button variant="link" className="mt-2 h-auto p-0" onClick={() => navigate("/profile/edit")}>
                          Change Privacy Settings
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
