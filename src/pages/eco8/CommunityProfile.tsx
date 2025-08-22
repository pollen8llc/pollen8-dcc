import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import Navbar from '@/components/Navbar';
import { useCommunities, Community } from '@/hooks/useCommunities';
import { useAuth } from '@/hooks/useAuth';
import { 
  Users, 
  MapPin, 
  Globe, 
  Mail, 
  Calendar,
  Award,
  ExternalLink,
  MessageCircle,
  Heart,
  Share2,
  Edit,
  Settings,
  Building2,
  Target,
  Lightbulb,
  BookOpen,
  Rss
} from 'lucide-react';

const CommunityProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getCommunityById } = useCommunities();
  const { currentUser } = useAuth();
  const [community, setCommunity] = useState<Community | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCommunity = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const foundCommunity = await getCommunityById(id);
        setCommunity(foundCommunity);
      } catch (error) {
        console.error('Error loading community:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCommunity();
  }, [id, getCommunityById]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
        <Navbar />
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (!community) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
        <Navbar />
        <div className="flex items-center justify-center min-h-[50vh]">
          <Card className="text-center p-8 max-w-md">
            <CardContent>
              <h2 className="text-2xl font-bold mb-4">Community Not Found</h2>
              <p className="text-muted-foreground mb-6">The community you're looking for doesn't exist.</p>
              <Button asChild>
                <Link to="/eco8/directory">Back to Directory</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const isOwner = currentUser?.id === community.owner_id;
  const isRecent = new Date(community.updated_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
      <Navbar />
      <div className="w-full px-4 py-8">
        {/* LinkedIn-style Community Header */}
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <Card className="mb-6 overflow-hidden">
            {/* Cover Photo */}
            <div className="h-48 bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20 relative">
              {isOwner && (
                <div className="absolute top-4 right-4 flex gap-2">
                  <Button size="sm" variant="outline" className="bg-background/80 backdrop-blur-sm">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                </div>
              )}
            </div>
            
            {/* Profile Section */}
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-6">
                {/* Avatar and Basic Info */}
                <div className="flex-shrink-0">
                  <div className="w-32 h-32 -mt-16 mb-4 relative">
                    <Avatar className="w-32 h-32 border-4 border-background">
                      <AvatarImage src={community.logo_url} alt={community.name} />
                      <AvatarFallback className="text-3xl bg-primary/10">
                        {community.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                </div>
                
                {/* Main Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
                    <div>
                      <h1 className="text-3xl font-bold mb-2">{community.name}</h1>
                      <p className="text-muted-foreground mb-2">{community.description}</p>
                      
                      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
                        {community.location && (
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            <span>{community.location}</span>
                          </div>
                        )}
                        {(community.type || community.community_type) && (
                          <Badge variant="secondary">{community.type || community.community_type}</Badge>
                        )}
                        {community.is_public && (
                          <Badge variant="outline">Public</Badge>
                        )}
                        {isRecent && (
                          <div className="flex items-center gap-1">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            <span className="text-green-600">Recently Active</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      {!isOwner && (
                        <Button>
                          <Users className="h-4 w-4 mr-2" />
                          Join Community
                        </Button>
                      )}
                      <Button variant="outline" size="sm">
                        <MessageCircle className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Content Grid */}
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">

              {/* About Section */}
              {community.description && (
                <Card>
                  <CardHeader>
                    <CardTitle>About</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">{community.description}</p>
                  </CardContent>
                </Card>
              )}

              {/* Vision */}
              {community.vision && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Lightbulb className="h-5 w-5" />
                      Vision
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">{community.vision}</p>
                  </CardContent>
                </Card>
              )}

              {/* Community Values */}
              {community.community_values && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Heart className="h-5 w-5" />
                      Values
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">{community.community_values}</p>
                  </CardContent>
                </Card>
              )}

              {/* Community Structure */}
              {community.community_structure && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Building2 className="h-5 w-5" />
                      Structure & Organization
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">{community.community_structure}</p>
                  </CardContent>
                </Card>
              )}

              {/* Target Audience */}
              {community.target_audience && community.target_audience.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5" />
                      Target Audience
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {community.target_audience.map((audience, index) => (
                        <Badge key={index} variant="outline">{audience}</Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Personal Background */}
              {community.personal_background && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BookOpen className="h-5 w-5" />
                      Founder Background
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">{community.personal_background}</p>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Contact & Links */}
              <Card>
                <CardHeader>
                  <CardTitle>Connect</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {community.website && (
                    <a
                      href={community.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      <Globe className="h-4 w-4" />
                      <span>Website</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                  
                  {community.newsletter_url && (
                    <a
                      href={community.newsletter_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      <Rss className="h-4 w-4" />
                      <span>Newsletter</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  )}

                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>Created {new Date(community.created_at).toLocaleDateString()}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Community Details */}
              <Card>
                <CardHeader>
                  <CardTitle>Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {community.format && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Format</span>
                      <Badge variant="outline">{community.format}</Badge>
                    </div>
                  )}
                  
                  {community.community_size && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Size</span>
                      <span className="text-sm">{community.community_size}</span>
                    </div>
                  )}

                  {community.event_frequency && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Events</span>
                      <span className="text-sm">{community.event_frequency}</span>
                    </div>
                  )}

                  {community.start_date && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Started</span>
                      <span className="text-sm">{community.start_date}</span>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Communication Platforms */}
              {community.communication_platforms && Object.keys(community.communication_platforms).length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Communication</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm text-muted-foreground">
                      Platforms: {Object.keys(community.communication_platforms).join(', ')}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Social Media */}
              {community.social_media && Object.keys(community.social_media).length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Social Media</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {Object.entries(community.social_media).map(([platform, url]) => (
                      <a
                        key={platform}
                        href={url as string}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                      >
                        <span className="capitalize">{platform}</span>
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    ))}
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityProfile;