import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { 
  Users, 
  MapPin, 
  Globe, 
  Mail, 
  Calendar,
  TrendingUp,
  Award,
  ExternalLink,
  MessageCircle,
  Heart,
  Share2,
  Edit,
  Settings
} from 'lucide-react';
import { Community, GROWTH_STATUS_COLORS } from '@/types/community';

const CommunityProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [community, setCommunity] = useState<Community | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCommunity = () => {
      try {
        const communities = JSON.parse(localStorage.getItem('communities') || '[]');
        const foundCommunity = communities.find((c: Community) => c.id === id);
        setCommunity(foundCommunity || null);
        setLoading(false);
      } catch (error) {
        console.error('Error loading community:', error);
        setLoading(false);
      }
    };

    if (id) {
      loadCommunity();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!community) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <Card className="backdrop-blur-md bg-white/5 border border-white/10 text-center p-8">
          <CardContent>
            <h2 className="text-2xl font-bold mb-4">Community Not Found</h2>
            <p className="text-muted-foreground mb-6">The community you're looking for doesn't exist.</p>
            <Button asChild>
              <Link to="/eco8">Back to Directory</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isActive = new Date(community.updated_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Community Header */}
        <Card className="backdrop-blur-md bg-white/5 border border-white/10 mb-8">
          <div className="relative">
            {/* Banner */}
            <div 
              className="h-48 bg-cover bg-center rounded-t-2xl relative"
              style={{ backgroundImage: `url(${community.banner})` }}
            >
              <div className="absolute inset-0 bg-black/40 rounded-t-2xl"></div>
              
              {/* Status Badges */}
              <div className="absolute top-4 right-4 flex gap-2">
                <Badge className={`${GROWTH_STATUS_COLORS[community.growthStatus]} text-white border-0`}>
                  {community.growthStatus}
                </Badge>
                {isActive && (
                  <div className="flex items-center gap-1 bg-green-500/20 px-2 py-1 rounded-full">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-xs text-green-400">Active</span>
                  </div>
                )}
              </div>

              {/* Management Controls - TODO: Show only for community owner */}
              <div className="absolute top-4 left-4 flex gap-2">
                <Button size="sm" variant="outline" className="bg-black/20 border-white/20 text-white hover:bg-white/10">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                <Button size="sm" variant="outline" className="bg-black/20 border-white/20 text-white hover:bg-white/10">
                  <Settings className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <CardContent className="p-8">
              <div className="flex flex-col lg:flex-row gap-8">
                {/* Left Column - Main Info */}
                <div className="flex-1">
                  <div className="flex items-start gap-4 mb-6">
                    <Avatar className="h-24 w-24 border-4 border-white/20">
                      <AvatarImage src={community.logo} alt={community.name} />
                      <AvatarFallback className="text-2xl">{community.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <h1 className="text-3xl font-bold">{community.name}</h1>
                        {community.badges.map(badge => (
                          <Badge key={badge} variant="secondary" className="bg-primary/20 text-primary">
                            <Award className="h-3 w-3 mr-1" />
                            {badge}
                          </Badge>
                        ))}
                      </div>
                      
                      <p className="text-muted-foreground mb-4">{community.description}</p>
                      
                      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          <span>{community.memberCount} members</span>
                        </div>
                        {community.location && (
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            <span>{community.location}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <TrendingUp className="h-4 w-4" />
                          <span>{community.growthStatus}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Bio */}
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-3">About</h3>
                    <p className="text-muted-foreground leading-relaxed">{community.bio}</p>
                  </div>

                  {/* Tags */}
                  {community.tags.length > 0 && (
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold mb-3">Topics</h3>
                      <div className="flex flex-wrap gap-2">
                        {community.tags.map(tag => (
                          <Badge key={tag} variant="outline" className="border-primary/30 text-primary">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Organizer */}
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Community Organizer</h3>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={community.organizerPhoto} alt={community.organizer} />
                        <AvatarFallback>{community.organizer.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{community.organizer}</p>
                        <p className="text-sm text-muted-foreground">Community Leader</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column - Actions & Contact */}
                <div className="lg:w-80">
                  <Card className="backdrop-blur-md bg-white/5 border border-white/20">
                    <CardHeader>
                      <CardTitle className="text-lg">Connect & Join</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <Button className="w-full" size="lg">
                        <Users className="h-4 w-4 mr-2" />
                        Join Community
                      </Button>
                      
                      <div className="grid grid-cols-3 gap-2">
                        <Button variant="outline" size="sm">
                          <MessageCircle className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Heart className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Share2 className="h-4 w-4" />
                        </Button>
                      </div>

                      <Separator />

                      {/* Contact Information */}
                      <div className="space-y-3">
                        {community.website && (
                          <a
                            href={community.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                          >
                            <Globe className="h-4 w-4" />
                            <span>Visit Website</span>
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        )}
                        
                        {community.email && (
                          <a
                            href={`mailto:${community.email}`}
                            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                          >
                            <Mail className="h-4 w-4" />
                            <span>Contact</span>
                          </a>
                        )}

                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          <span>Created {new Date(community.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </div>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
          <Card className="backdrop-blur-md bg-white/5 border border-white/10 text-center p-4">
            <div className="text-2xl font-bold text-primary">{community.memberCount}</div>
            <div className="text-sm text-muted-foreground">Members</div>
          </Card>
          <Card className="backdrop-blur-md bg-white/5 border border-white/10 text-center p-4">
            <div className="text-2xl font-bold text-green-500">+12</div>
            <div className="text-sm text-muted-foreground">This Month</div>
          </Card>
          <Card className="backdrop-blur-md bg-white/5 border border-white/10 text-center p-4">
            <div className="text-2xl font-bold text-blue-500">85%</div>
            <div className="text-sm text-muted-foreground">Engagement</div>
          </Card>
          <Card className="backdrop-blur-md bg-white/5 border border-white/10 text-center p-4">
            <div className="text-2xl font-bold text-yellow-500">4.8</div>
            <div className="text-sm text-muted-foreground">Rating</div>
          </Card>
          <Card className="backdrop-blur-md bg-white/5 border border-white/10 text-center p-4">
            <div className="text-2xl font-bold text-purple-500">24</div>
            <div className="text-sm text-muted-foreground">Events</div>
          </Card>
        </div>

        {/* Two Column Grid */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Media Gallery */}
          <Card className="backdrop-blur-md bg-white/5 border border-white/10">
            <CardHeader>
              <CardTitle>Media Gallery</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                  <span className="text-muted-foreground">Video Content</span>
                </div>
                <div className="aspect-square bg-muted rounded-lg flex items-center justify-center">
                  <span className="text-muted-foreground">Image Gallery</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Active Members */}
          <Card className="backdrop-blur-md bg-white/5 border border-white/10">
            <CardHeader>
              <CardTitle>Active Members</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={`https://images.unsplash.com/photo-150${i}003171169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face`} />
                          <AvatarFallback>M{i}</AvatarFallback>
                        </Avatar>
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full flex items-center justify-center text-xs font-bold text-black">
                          {i}
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Member {i}</p>
                        <p className="text-xs text-muted-foreground">Active contributor</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-xs">Rank #{i}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Status Updates Wall */}
        <Card className="backdrop-blur-md bg-white/5 border border-white/10">
          <CardHeader>
            <CardTitle>Community Updates</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* New Update Form */}
              <Card className="backdrop-blur-md bg-white/5 border border-white/20">
                <CardContent className="p-4">
                  <div className="flex gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={community.organizerPhoto} />
                      <AvatarFallback>{community.organizer.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <textarea 
                        placeholder="Share an update with the community..."
                        className="w-full p-3 bg-transparent border border-white/20 rounded-lg resize-none"
                        rows={3}
                      />
                      <div className="flex justify-between items-center mt-3">
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm">📷</Button>
                          <Button variant="ghost" size="sm">📹</Button>
                        </div>
                        <Button size="sm">Post Update</Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Sample Updates */}
              {[
                {
                  author: community.organizer,
                  avatar: community.organizerPhoto,
                  time: '2 hours ago',
                  content: 'Excited to announce our upcoming workshop on sustainable living practices! Registration opens tomorrow.',
                  likes: 12,
                  comments: 3
                },
                {
                  author: 'Alex Thompson',
                  avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
                  time: '1 day ago',
                  content: 'Great meetup last night! Thank you everyone who attended and shared their insights.',
                  likes: 8,
                  comments: 5
                }
              ].map((update, i) => (
                <Card key={i} className="backdrop-blur-md bg-white/5 border border-white/20">
                  <CardContent className="p-4">
                    <div className="flex gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={update.avatar} />
                        <AvatarFallback>{update.author.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <p className="font-medium">{update.author}</p>
                            <p className="text-xs text-muted-foreground">{update.time}</p>
                          </div>
                          <Button variant="ghost" size="sm">⋯</Button>
                        </div>
                        <p className="text-sm mb-3">{update.content}</p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <button className="flex items-center gap-1 hover:text-primary transition-colors">
                            <Heart className="h-4 w-4" />
                            <span>{update.likes}</span>
                          </button>
                          <button className="flex items-center gap-1 hover:text-primary transition-colors">
                            <MessageCircle className="h-4 w-4" />
                            <span>{update.comments}</span>
                          </button>
                          <button className="flex items-center gap-1 hover:text-primary transition-colors">
                            <Share2 className="h-4 w-4" />
                            <span>Share</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CommunityProfile;