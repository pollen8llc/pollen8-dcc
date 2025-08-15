import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import Navbar from '@/components/Navbar';
import { A10DNavigation } from '@/components/a10d/A10DNavigation';
import { 
  Calendar, 
  BarChart3, 
  Mail, 
  ExternalLink,
  Edit,
  MessageCircle,
  Star,
  TrendingUp
} from 'lucide-react';
import { A10DProfile, A10DClassification } from '@/types/a10d';
import { formatDistanceToNow } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

// Mock data - in real app this would come from API/context
const mockProfiles: A10DProfile[] = [
  {
    id: '1',
    contactId: 'contact-1',
    name: 'Sarah Chen',
    email: 'sarah.chen@example.com',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=200',
    classification: 'Ambassador',
    communityEngagement: 95,
    eventsAttended: 12,
    interests: ['Tech Leadership', 'AI/ML', 'Community Building'],
    joinDate: '2024-01-15',
    lastActive: '2024-03-10',
    notes: 'Highly engaged community leader, excellent speaker',
    socialMedia: {
      twitter: '@sarahchen',
      linkedin: 'sarah-chen-tech'
    }
  },
  {
    id: '2',
    contactId: 'contact-2',
    name: 'Marcus Rodriguez',
    email: 'marcus@example.com',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
    classification: 'Volunteer',
    communityEngagement: 78,
    eventsAttended: 8,
    interests: ['Event Planning', 'Community Outreach', 'Non-Profit'],
    joinDate: '2024-02-01',
    lastActive: '2024-03-08',
    notes: 'Reliable volunteer, great with logistics',
    socialMedia: {
      linkedin: 'marcus-rodriguez'
    }
  },
  {
    id: '3',
    contactId: 'contact-3',
    name: 'Elena Vasquez',
    email: 'elena.v@example.com',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200',
    classification: 'Moderator',
    communityEngagement: 88,
    eventsAttended: 15,
    interests: ['Content Moderation', 'Community Guidelines', 'Digital Safety'],
    joinDate: '2023-11-20',
    lastActive: '2024-03-09',
    notes: 'Excellent moderator, handles conflicts well',
    socialMedia: {
      twitter: '@elena_v',
      linkedin: 'elena-vasquez-community'
    }
  },
  {
    id: '4',
    contactId: 'contact-4',
    name: 'David Kim',
    email: 'david.kim@example.com',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200',
    classification: 'Supporter',
    communityEngagement: 45,
    eventsAttended: 3,
    interests: ['Tech Trends', 'Startups', 'Innovation'],
    joinDate: '2024-02-20',
    lastActive: '2024-03-05',
    notes: 'New to community, showing interest',
    socialMedia: {
      linkedin: 'david-kim-tech'
    }
  },
  {
    id: '5',
    contactId: 'contact-5',
    name: 'Priya Patel',
    email: 'priya.patel@example.com',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200',
    classification: 'Ambassador',
    communityEngagement: 92,
    eventsAttended: 18,
    interests: ['Women in Tech', 'Diversity & Inclusion', 'Mentorship'],
    joinDate: '2023-09-10',
    lastActive: '2024-03-11',
    notes: 'Champion for diversity, excellent mentor',
    socialMedia: {
      twitter: '@priya_tech',
      linkedin: 'priya-patel-tech'
    }
  },
  {
    id: '6',
    contactId: 'contact-6',
    name: 'James Wilson',
    email: 'james.w@example.com',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200',
    classification: 'Volunteer',
    communityEngagement: 67,
    eventsAttended: 6,
    interests: ['Event Photography', 'Content Creation', 'Social Media'],
    joinDate: '2024-01-08',
    lastActive: '2024-03-07',
    notes: 'Talented photographer, helps with event coverage',
    socialMedia: {
      instagram: '@jameswilson_photo',
      linkedin: 'james-wilson-creative'
    }
  }
];

const A10DProfileDetails: React.FC = () => {
  const { profileId } = useParams<{ profileId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Find profile by ID
  const profile = mockProfiles.find(p => p.id === profileId);

  if (!profile) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-6 space-y-6">
          <A10DNavigation />
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-muted-foreground">Profile Not Found</h2>
            <p className="text-muted-foreground mt-2">The profile you're looking for doesn't exist.</p>
            <Button onClick={() => navigate('/a10d')} className="mt-4">
              Back to A10D Dashboard
            </Button>
          </div>
        </div>
      </div>
    );
  }

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
    toast({
      title: "Edit Profile",
      description: "Edit functionality will be implemented soon.",
    });
  };

  const handleContact = () => {
    window.location.href = `mailto:${profile.email}`;
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Navigation */}
        <A10DNavigation />

        <div className="max-w-4xl mx-auto space-y-6">
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
                <h1 className="text-3xl font-bold">{profile.name}</h1>
                <p className="text-muted-foreground text-lg">{profile.email}</p>
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
                <Button onClick={handleContact} variant="outline" size="sm">
                  <Mail className="w-4 h-4 mr-2" />
                  Contact
                </Button>
              </div>
            </div>
          </div>

          <Separator />

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                    <span className={`text-3xl font-bold ${getEngagementColor(profile.communityEngagement)}`}>
                      {profile.communityEngagement}%
                    </span>
                    <TrendingUp className="w-6 h-6 text-green-500" />
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
                <div className="text-3xl font-bold">{profile.eventsAttended}</div>
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
                <div className="text-lg font-medium">
                  {formatDistanceToNow(new Date(profile.lastActive), { addSuffix: true })}
                </div>
                <p className="text-sm text-muted-foreground">Recent activity</p>
              </CardContent>
            </Card>
          </div>

          {/* Interests Section */}
          <Card>
            <CardHeader>
              <CardTitle>Interests</CardTitle>
            </CardHeader>
            <CardContent>
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
            </CardContent>
          </Card>

          {/* Notes Section */}
          {profile.notes && (
            <Card>
              <CardHeader>
                <CardTitle>Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground whitespace-pre-wrap">
                  {profile.notes}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Social Media Section */}
          {profile.socialMedia && Object.keys(profile.socialMedia).length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Social Media</CardTitle>
              </CardHeader>
              <CardContent>
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
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default A10DProfileDetails;