import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { 
  Calendar, 
  BarChart3, 
  MapPin, 
  Mail, 
  ExternalLink,
  Edit,
  MessageCircle,
  Star,
  TrendingUp
} from 'lucide-react';
import { A10DProfile, A10DClassification } from '@/types/a10d';
import { formatDistanceToNow } from 'date-fns';

interface A10DProfileDetailsModalProps {
  profile: A10DProfile | null;
  open: boolean;
  onClose: () => void;
  onEdit?: (profile: A10DProfile) => void;
}

const A10DProfileDetailsModal: React.FC<A10DProfileDetailsModalProps> = ({ 
  profile, 
  open, 
  onClose,
  onEdit 
}) => {
  if (!profile) return null;

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

  const handleEdit = () => {
    if (onEdit) onEdit(profile);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Profile Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Header Section */}
          <div className="flex items-start gap-6">
            <Avatar className="w-20 h-20 border-4 border-primary/20">
              <AvatarImage src={profile.avatar} alt={profile.name} />
              <AvatarFallback className="bg-gradient-to-br from-primary/20 to-secondary/20 text-lg font-semibold">
                {getInitials(profile.name)}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 space-y-3">
              <div>
                <h2 className="text-2xl font-bold">{profile.name}</h2>
                <p className="text-muted-foreground">{profile.email}</p>
              </div>
              
              <div className="flex items-center gap-3">
                <Badge className={`${getClassificationColor(profile.classification)} text-sm font-medium`}>
                  {profile.classification}
                </Badge>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span>Joined {formatDistanceToNow(new Date(profile.joinDate), { addSuffix: true })}</span>
                </div>
              </div>

              <div className="flex gap-2">
                <Button onClick={handleEdit} variant="outline" size="sm">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
                <Button variant="outline" size="sm">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Contact
                </Button>
              </div>
            </div>
          </div>

          <Separator />

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-primary" />
                  Community Engagement
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className={`text-2xl font-bold ${getEngagementColor(profile.communityEngagement)}`}>
                      {profile.communityEngagement}%
                    </span>
                    <TrendingUp className="w-5 h-5 text-green-500" />
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${
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

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-primary" />
                  Events Attended
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="text-2xl font-bold">{profile.eventsAttended}</div>
                <p className="text-sm text-muted-foreground">Total events</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Star className="w-4 h-4 text-primary" />
                  Last Active
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="text-sm font-medium">
                  {formatDistanceToNow(new Date(profile.lastActive), { addSuffix: true })}
                </div>
                <p className="text-sm text-muted-foreground">Recent activity</p>
              </CardContent>
            </Card>
          </div>

          {/* Interests Section */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Interests</h3>
            <div className="flex flex-wrap gap-2">
              {profile.interests.map((interest, index) => (
                <Badge 
                  key={index} 
                  variant="outline" 
                  className="bg-muted/20 border-muted hover:bg-muted/30 transition-colors"
                >
                  {interest}
                </Badge>
              ))}
            </div>
          </div>

          {/* Notes Section */}
          {profile.notes && (
            <div>
              <h3 className="text-lg font-semibold mb-3">Notes</h3>
              <Card>
                <CardContent className="pt-4">
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                    {profile.notes}
                  </p>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Social Media Section */}
          {profile.socialMedia && Object.keys(profile.socialMedia).length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-3">Social Media</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {profile.socialMedia.twitter && (
                  <Button variant="outline" size="sm" asChild>
                    <a href={profile.socialMedia.twitter} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Twitter
                    </a>
                  </Button>
                )}
                {profile.socialMedia.linkedin && (
                  <Button variant="outline" size="sm" asChild>
                    <a href={profile.socialMedia.linkedin} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      LinkedIn
                    </a>
                  </Button>
                )}
                {profile.socialMedia.instagram && (
                  <Button variant="outline" size="sm" asChild>
                    <a href={profile.socialMedia.instagram} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Instagram
                    </a>
                  </Button>
                )}
                {profile.socialMedia.facebook && (
                  <Button variant="outline" size="sm" asChild>
                    <a href={profile.socialMedia.facebook} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Facebook
                    </a>
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default A10DProfileDetailsModal;