import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Twitter, Linkedin, Instagram, Facebook } from 'lucide-react';
import { A10DProfile, A10DClassification } from '@/types/a10d';

interface A10DProfileCardProps {
  profile: A10DProfile;
  onClick?: (profile: A10DProfile) => void;
}

const A10DProfileCard: React.FC<A10DProfileCardProps> = ({ profile, onClick }) => {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  const getClassificationColor = (classification: A10DClassification) => {
    switch (classification) {
      case 'Ambassador':
        return 'bg-primary/80 text-primary-foreground border-primary/40';
      case 'Volunteer':
        return 'bg-green-500/80 text-white border-green-500/40';
      case 'Moderator':
        return 'bg-blue-500/80 text-white border-blue-500/40';
      case 'Supporter':
        return 'bg-orange-500/80 text-white border-orange-500/40';
      default:
        return 'bg-muted/80 text-muted-foreground border-muted/40';
    }
  };

  const getSocialIcon = (platform: string) => {
    switch (platform) {
      case 'twitter':
        return Twitter;
      case 'linkedin':
        return Linkedin;
      case 'instagram':
        return Instagram;
      case 'facebook':
        return Facebook;
      default:
        return null;
    }
  };

  const handleCardClick = () => {
    if (onClick) onClick(profile);
  };

  // Use location from profile or fallback
  const location = profile.location || 'Remote';

  return (
    <Card 
      className="group hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 cursor-pointer 
                 border-0 bg-white/5 backdrop-blur-lg hover:bg-white/10 
                 rounded-2xl overflow-hidden"
      onClick={handleCardClick}
    >
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          {/* Avatar */}
          <Avatar className="w-12 h-12 border-2 border-white/20 shadow-lg flex-shrink-0">
            <AvatarImage src={profile.avatar} alt={profile.name} />
            <AvatarFallback className="bg-gradient-to-br from-primary/30 to-secondary/30 text-sm font-bold text-white">
              {getInitials(profile.name)}
            </AvatarFallback>
          </Avatar>

          {/* Main Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-foreground truncate">
                {profile.name}
              </h3>
              <Badge className={`${getClassificationColor(profile.classification)} text-xs font-medium border flex-shrink-0`}>
                {profile.classification}
              </Badge>
            </div>
            
            {/* Location */}
            <div className="flex items-center gap-1 text-muted-foreground">
              <MapPin className="w-3 h-3 flex-shrink-0" />
              <span className="text-sm truncate">{location}</span>
            </div>
          </div>

          {/* Social Icons */}
          <div className="flex gap-1 flex-shrink-0">
            {profile.socialMedia && Object.entries(profile.socialMedia).map(([platform, handle]) => {
              const IconComponent = getSocialIcon(platform);
              if (!IconComponent || !handle) return null;
              
              return (
                <div
                  key={platform}
                  className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    // Handle social link click
                  }}
                >
                  <IconComponent className="w-3 h-3 text-white/80" />
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default A10DProfileCard;