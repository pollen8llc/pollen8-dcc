
import React from "react";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { UserSearch, MapPin, ArrowRight, BadgeCheck } from "lucide-react";
import { ExtendedProfile } from "@/services/profileService";
import { 
  Alert, 
  AlertDescription, 
  AlertTitle 
} from "@/components/ui/alert";
import { UserRole } from "@/models/types";

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
  
  // Get the appropriate badge style based on user role
  const getRoleBadgeStyle = (role?: UserRole) => {
    switch (role) {
      case UserRole.ADMIN:
        return "bg-[#9b87f5] text-white";
      case UserRole.ORGANIZER:
        return "bg-[#0EA5E9] text-white";
      case UserRole.MEMBER:
        return "bg-[#00eada]/80 text-black";
      default:
        return "bg-secondary text-secondary-foreground";
    }
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Card key={i} className="overflow-hidden border-border/30 bg-card/60 backdrop-blur-sm h-44 animate-pulse">
            <div className="p-6">
              <div className="flex items-start gap-4">
                <div className="h-16 w-16 rounded-full bg-muted"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-3/4 bg-muted rounded"></div>
                  <div className="h-3 w-1/2 bg-muted rounded"></div>
                  <div className="h-3 w-5/6 bg-muted rounded"></div>
                </div>
              </div>
            </div>
          </Card>
        ))}
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
      <Card className="p-8 text-center border-border/30 bg-card/60 backdrop-blur-sm">
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
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {profiles.map((profile) => (
        <Card 
          key={profile.id} 
          className="overflow-hidden border-border/30 bg-card/60 backdrop-blur-sm hover:shadow-lg hover:border-[#00eada]/20 transition-all duration-300"
        >
          <div className="p-6">
            <div className="flex items-start gap-4">
              <Avatar className="h-16 w-16 ring-2 ring-[#00eada]/20">
                <AvatarImage src={profile.avatar_url || ""} />
                <AvatarFallback className="bg-[#00eada]/10 text-[#00eada] font-medium">
                  {getInitials(profile.first_name, profile.last_name)}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-medium text-lg">
                    {[profile.first_name, profile.last_name].filter(Boolean).join(" ") || "Anonymous User"}
                  </h3>
                  
                  {profile.role && (
                    <Badge className={`flex items-center gap-1 ${getRoleBadgeStyle(profile.role)}`}>
                      <BadgeCheck className="h-3 w-3" />
                      <span>{UserRole[profile.role]}</span>
                    </Badge>
                  )}
                </div>
                
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
                className="w-full hover:bg-[#00eada]/10 hover:text-[#00eada] transition-colors"
                onClick={() => navigate(`/profile/${profile.id}`)}
              >
                View Profile
                <ArrowRight className="ml-2 h-3 w-3" />
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default ProfileSearchList;
