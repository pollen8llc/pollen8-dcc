
import React from "react";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { UserSearch, MapPin } from "lucide-react";
import { ExtendedProfile } from "@/services/profileService";
import { 
  Alert, 
  AlertDescription, 
  AlertTitle 
} from "@/components/ui/alert";

interface ProfileSearchListProps {
  profiles: ExtendedProfile[];
  isLoading: boolean;
  error: string | null;
  emptyMessage?: string;
}

const ProfileSearchList: React.FC<ProfileSearchListProps> = ({
  profiles,
  isLoading,
  error,
  emptyMessage = "No profiles found"
}) => {
  const navigate = useNavigate();

  // Get initials for avatar fallback
  const getInitials = (firstName?: string, lastName?: string) => {
    if (!firstName && !lastName) return "?";
    
    const firstInitial = firstName ? firstName[0].toUpperCase() : "";
    const lastInitial = lastName ? lastName[0].toUpperCase() : "";
    
    return `${firstInitial}${lastInitial}`.trim() || "?";
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <Alert variant="destructive" className="my-4">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }
  
  if (profiles.length === 0) {
    return (
      <Card className="p-8 text-center">
        <div className="mb-4 flex justify-center">
          <UserSearch className="h-12 w-12 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-medium mb-2">{emptyMessage}</h3>
        <p className="text-muted-foreground">
          Try different search criteria or check back later.
        </p>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {profiles.map((profile) => (
        <Card key={profile.id} className="overflow-hidden">
          <div className="p-4">
            <div className="flex items-start gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={profile.avatar_url || ""} />
                <AvatarFallback>
                  {getInitials(profile.first_name, profile.last_name)}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <h3 className="font-medium text-lg">
                  {[profile.first_name, profile.last_name].filter(Boolean).join(" ") || "Anonymous User"}
                </h3>
                
                {profile.location && (
                  <div className="flex items-center text-muted-foreground mt-1">
                    <MapPin className="h-3 w-3 mr-1" />
                    <span className="text-sm">{profile.location}</span>
                  </div>
                )}
                
                {profile.bio && (
                  <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                    {profile.bio}
                  </p>
                )}
              </div>
            </div>
            
            {profile.interests && Array.isArray(profile.interests) && profile.interests.length > 0 && (
              <>
                <Separator className="my-3" />
                <div className="flex flex-wrap gap-1">
                  {profile.interests.slice(0, 3).map((interest, idx) => (
                    <Badge key={idx} variant="secondary" className="text-xs">
                      {interest}
                    </Badge>
                  ))}
                  {profile.interests.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{profile.interests.length - 3} more
                    </Badge>
                  )}
                </div>
              </>
            )}
            
            <div className="mt-4">
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => navigate(`/profile/${profile.id}`)}
              >
                View Profile
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default ProfileSearchList;
