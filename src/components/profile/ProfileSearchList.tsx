
import React from "react";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { UserSearch, MapPin, ArrowRight } from "lucide-react";
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

  // Get badge style based on role
  const getRoleBadgeStyles = (role?: UserRole) => {
    if (role === undefined) return "bg-gray-500 text-white";
    
    switch(role) {
      case UserRole.ADMIN:
        return "bg-purple-500 text-white";
      case UserRole.ORGANIZER:
        return "bg-blue-500 text-white";
      case UserRole.MEMBER:
        return "bg-green-500 text-white";
      case UserRole.SERVICE_PROVIDER:
        return "bg-orange-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };
  
  // Get role display name
  const getRoleDisplayName = (role?: UserRole) => {
    if (role === undefined) return "MEMBER";
    return UserRole[role] || "MEMBER";
  };

  // Check if user is admin
  const isAdmin = (role?: UserRole) => role === UserRole.ADMIN;

  if (isLoading) {
    return (
      <div className="bg-background/95 backdrop-blur-sm rounded-2xl p-6">
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
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="bg-background/95 backdrop-blur-sm rounded-2xl p-6">
        <Alert variant="destructive" className="my-4">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }
  
  if (profiles.length === 0) {
    return (
      <div className="bg-background/95 backdrop-blur-sm rounded-2xl p-6">
        <Card className="p-8 text-center border-border/30 bg-card/60 backdrop-blur-sm">
          <div className="mb-4 flex justify-center">
            <UserSearch className="h-12 w-12 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium mb-2">{emptyMessage}</h3>
          <p className="text-muted-foreground">
            Try different search criteria or check back later.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="bg-background/95 backdrop-blur-sm rounded-2xl p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {profiles.map((profile) => (
          <Card 
            key={profile.id} 
            className={`overflow-hidden border-border/30 bg-card/60 backdrop-blur-sm hover:shadow-lg hover:border-[#00eada]/20 transition-all duration-300 ${isAdmin(profile.role) ? 'admin-gradient-premium-border' : ''}`}
          >
            <div className="p-6">
              <div className="flex items-start gap-4">
                <Avatar className={`h-16 w-16 ${isAdmin(profile.role) ? 'ring-2 ring-[#9b87f5]/50' : 'ring-2 ring-[#00eada]/20'}`}>
                  <AvatarImage src={profile.avatar_url || ""} />
                  <AvatarFallback className="bg-[#00eada]/10 text-[#00eada] font-medium">
                    {getInitials(profile.first_name, profile.last_name)}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-lg">
                      {[profile.first_name, profile.last_name].filter(Boolean).join(" ") || "Anonymous User"}
                    </h3>
                    
                    {profile.role !== undefined && (
                      <Badge className={`${getRoleBadgeStyles(profile.role)}`}>
                        {getRoleDisplayName(profile.role)}
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
    </div>
  );
};

export default ProfileSearchList;
