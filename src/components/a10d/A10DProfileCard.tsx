import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { MoreHorizontal, Calendar, BarChart3, Star, ExternalLink } from 'lucide-react';
import { A10DProfile, A10DClassification } from '@/types/a10d';
import { formatDistanceToNow } from 'date-fns';

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
        return 'bg-primary text-primary-foreground';
      case 'Volunteer':
        return 'bg-green-500 text-white';
      case 'Moderator':
        return 'bg-blue-500 text-white';
      case 'Supporter':
        return 'bg-orange-500 text-white';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getEngagementColor = (engagement: number) => {
    if (engagement >= 80) return 'text-green-500';
    if (engagement >= 60) return 'text-orange-500';
    return 'text-red-500';
  };

  const handleCardClick = () => {
    if (onClick) onClick(profile);
  };

  return (
    <Card 
      className="group hover:shadow-lg transition-all duration-200 cursor-pointer border-border/50"
      onClick={handleCardClick}
    >
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <Avatar className="w-12 h-12 border-2 border-primary/20">
              <AvatarImage src={profile.avatar} alt={profile.name} />
              <AvatarFallback className="bg-gradient-to-br from-primary/20 to-secondary/20 text-sm font-semibold">
                {getInitials(profile.name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-base truncate">{profile.name}</h3>
              <p className="text-sm text-muted-foreground truncate">{profile.email}</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="w-8 h-8 opacity-0 group-hover:opacity-100 transition-opacity">
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </div>

        {/* Classification Badge */}
        <div className="mb-4">
          <Badge className={`${getClassificationColor(profile.classification)} text-xs font-medium`}>
            {profile.classification}
          </Badge>
        </div>

        {/* Engagement Metrics */}
        <div className="space-y-3 mb-4">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground">Engagement</span>
            </div>
            <span className={`font-semibold ${getEngagementColor(profile.communityEngagement)}`}>
              {profile.communityEngagement}%
            </span>
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground">Events</span>
            </div>
            <span className="font-semibold">{profile.eventsAttended}</span>
          </div>
        </div>

        {/* Interests */}
        <div className="mb-4">
          <div className="flex flex-wrap gap-1 max-h-12 overflow-hidden">
            {profile.interests.slice(0, 2).map((interest, index) => (
              <Badge 
                key={index} 
                variant="outline" 
                className="text-xs px-2 py-1 bg-muted/20 border-muted"
              >
                {interest}
              </Badge>
            ))}
            {profile.interests.length > 2 && (
              <Badge variant="outline" className="text-xs px-2 py-1 bg-muted/20 border-muted">
                +{profile.interests.length - 2}
              </Badge>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between text-xs text-muted-foreground pt-3 border-t border-border/50">
          <span>
            Last active {formatDistanceToNow(new Date(profile.lastActive), { addSuffix: true })}
          </span>
          {(profile.socialMedia?.twitter || profile.socialMedia?.linkedin) && (
            <div className="flex items-center gap-1">
              <ExternalLink className="w-3 h-3" />
              <span>Social</span>
            </div>
          )}
        </div>

        {/* Progress Bar for Engagement */}
        <div className="mt-3">
          <div className="w-full bg-muted rounded-full h-1.5">
            <div 
              className={`h-1.5 rounded-full transition-all duration-300 ${
                profile.communityEngagement >= 80 
                  ? 'bg-green-500' 
                  : profile.communityEngagement >= 60 
                    ? 'bg-orange-500' 
                    : 'bg-red-500'
              }`}
              style={{ width: `${profile.communityEngagement}%` }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default A10DProfileCard;