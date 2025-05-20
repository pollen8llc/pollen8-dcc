
import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";
import { ExtendedProfile } from "@/services/profileService";
import { UserRole } from "@/models/types";

interface ProfileCardProps {
  profile: ExtendedProfile;
  connectionDepth?: number;
  onConnect?: () => void;
  isConnected?: boolean;
}

const ProfileCard: React.FC<ProfileCardProps> = ({
  profile,
  connectionDepth = 0,
  onConnect,
  isConnected = false,
}) => {
  const getConnectionBadge = () => {
    if (connectionDepth === 0) {
      return null;
    } else if (connectionDepth === 1) {
      return <Badge className="bg-[#00eada] text-black">1st Connection</Badge>;
    } else if (connectionDepth === 2) {
      return <Badge variant="secondary">2nd Connection</Badge>;
    } else if (connectionDepth === 3) {
      return <Badge variant="outline">3rd Connection</Badge>;
    }
    return null;
  };

  const fullName = [profile.first_name, profile.last_name]
    .filter(Boolean)
    .join(" ") || "Anonymous User";

  // Safely check if category exists
  const hasCategory = profile && 'category' in profile && (profile as any).category;
  
  // Check if the user is an admin - use optional chaining to safely access role
  const isAdmin = profile.role_name === UserRole.ADMIN;

  return (
    <Card className={`h-[220px] flex flex-col ${isAdmin ? 'admin-profile-border' : ''}`}>
      <CardHeader className="flex-col gap-1 items-start">
        <div className="flex justify-between w-full">
          <Link to={`/profile/${profile.id}`} className="font-medium text-lg hover:underline">
            {fullName}
          </Link>
          
          {hasCategory && (
            <Badge variant="outline" className="bg-[#00eada]/10 text-[#00eada] border-[#00eada]/30">
              {(profile as any).category}
            </Badge>
          )}
        </div>
        
        {profile.location && (
          <div className="flex items-center text-xs text-muted-foreground">
            <MapPin className="h-3 w-3 mr-1" />
            <span>{profile.location}</span>
          </div>
        )}
      </CardHeader>
      
      <CardContent className="flex-grow">
        {profile.bio && (
          <p className="text-sm text-muted-foreground line-clamp-3">{profile.bio}</p>
        )}
        
        {profile.interests && profile.interests.length > 0 && (
          <div className="mt-4">
            <p className="text-xs text-muted-foreground mb-1">Interests</p>
            <div className="flex flex-wrap gap-1">
              {profile.interests.slice(0, 3).map((interest, i) => (
                <Badge key={i} variant="outline" className="text-xs bg-[#00eada]/10 text-[#00eada] border-[#00eada]/30">
                  {interest}
                </Badge>
              ))}
              {profile.interests.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{profile.interests.length - 3}
                </Badge>
              )}
            </div>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-between items-center">
        {getConnectionBadge()}
        
        {onConnect && !isConnected && (
          <Button size="sm" onClick={onConnect}>
            Connect
          </Button>
        )}
        
        {isConnected && (
          <Badge variant="secondary">Connected</Badge>
        )}
      </CardFooter>
    </Card>
  );
};

export default ProfileCard;
