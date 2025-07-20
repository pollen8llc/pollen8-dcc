import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit3, MapPin } from 'lucide-react';
import { Profile } from '@/types/profile';

interface ProfileHeaderProps {
  profile: Profile;
  isOwnProfile: boolean;
  onEdit?: () => void;
  isMobile?: boolean;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ 
  profile, 
  isOwnProfile, 
  onEdit,
  isMobile = false 
}) => {
  const displayName = profile.first_name && profile.last_name 
    ? `${profile.first_name} ${profile.last_name}` 
    : profile.first_name || profile.email.split('@')[0];

  const initials = profile.first_name && profile.last_name
    ? `${profile.first_name[0]}${profile.last_name[0]}`.toUpperCase()
    : displayName.slice(0, 2).toUpperCase();

  if (isMobile) {
    return (
      <div className="relative bg-gradient-to-br from-primary/20 to-primary/5 p-6 pb-20">
        {isOwnProfile && onEdit && (
          <Button
            variant="ghost"
            size="sm"
            className="absolute top-4 right-4"
            onClick={onEdit}
          >
            <Edit3 className="h-4 w-4" />
          </Button>
        )}
        
        <div className="flex justify-center">
          <Avatar className="h-32 w-32 border-4 border-background shadow-lg">
            <AvatarImage src={profile.avatar_url} alt={displayName} />
            <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
          </Avatar>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row gap-6 p-8">
      <div className="flex-shrink-0">
        <Avatar className="h-32 w-32 border-4 border-background shadow-lg">
          <AvatarImage src={profile.avatar_url} alt={displayName} />
          <AvatarFallback className="text-3xl">{initials}</AvatarFallback>
        </Avatar>
      </div>

      <div className="flex-1 space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">{displayName}</h1>
            
            {profile.location && (
              <div className="flex items-center text-muted-foreground mb-4">
                <MapPin className="h-4 w-4 mr-2" />
                {profile.location}
              </div>
            )}
          </div>

          {isOwnProfile && onEdit && (
            <Button onClick={onEdit} className="gap-2">
              <Edit3 className="h-4 w-4" />
              Edit Profile
            </Button>
          )}
        </div>

        {profile.bio && (
          <p className="text-muted-foreground leading-relaxed max-w-2xl">
            {profile.bio}
          </p>
        )}
      </div>
    </div>
  );
};

export default ProfileHeader;