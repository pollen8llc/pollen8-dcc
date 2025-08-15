import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
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

  const handleCardClick = () => {
    if (onClick) onClick(profile);
  };

  return (
    <Card 
      className="aspect-square hover:shadow-lg transition-all duration-200 cursor-pointer border-border/50"
      onClick={handleCardClick}
    >
      <CardContent className="p-6 flex flex-col items-center justify-center h-full text-center">
        <Avatar className="w-16 h-16 mb-4">
          <AvatarImage src={profile.avatar} alt={profile.name} />
          <AvatarFallback className="bg-gradient-to-br from-primary/20 to-secondary/20 text-lg font-semibold">
            {getInitials(profile.name)}
          </AvatarFallback>
        </Avatar>
        
        <h3 className="font-semibold text-base mb-2 truncate w-full">{profile.name}</h3>
        
        <Badge className={`${getClassificationColor(profile.classification)} text-xs font-medium`}>
          {profile.classification}
        </Badge>
      </CardContent>
    </Card>
  );
};

export default A10DProfileCard;