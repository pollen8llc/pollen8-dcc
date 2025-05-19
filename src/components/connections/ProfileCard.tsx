
import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";
import { ExtendedProfile } from "@/services/profileService";

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
  const getInitials = () => {
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
    if (connectionDepth === 0) {
      return null;
    } else if (connectionDepth === 1) {
      return <Badge className="bg-royal-blue-500 text-white">1st Connection</Badge>;
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

  return (
    <Card className="h-[220px] flex flex-col">
      <CardHeader className="flex-row gap-4 items-center">
        <Avatar className="h-12 w-12 bg-royal-blue-100/20 text-royal-blue-500 ring-2 ring-royal-blue-200/20">
          <AvatarImage src={profile.avatar_url} alt={fullName} />
          <AvatarFallback>{getInitials()}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <Link to={`/profile/${profile.id}`} className="font-medium hover:underline">
            {fullName}
          </Link>
          {profile.location && (
            <div className="flex items-center text-xs text-muted-foreground">
              <MapPin className="h-3 w-3 mr-1" />
              <span>{profile.location}</span>
            </div>
          )}
        </div>
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
                <Badge key={i} variant="outline" className="text-xs bg-royal-blue-100/20 text-royal-blue-300 border-royal-blue-200/20">
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
