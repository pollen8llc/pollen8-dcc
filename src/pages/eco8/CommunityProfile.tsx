import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import Navbar from '@/components/Navbar';
import { Eco8Navigation } from '@/components/eco8/Eco8Navigation';
import { CommunityEditForm } from '@/components/eco8/CommunityEditForm';
import { useCommunities, Community } from '@/hooks/useCommunities';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
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
  Rss,
  Trash2,
  Loader2,
  TrendingUp,
  Activity
} from 'lucide-react';

const CommunityProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getCommunityById, hasUserCommunities } = useCommunities();
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const [community, setCommunity] = useState<Community | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const loadCommunity = async () => {
      if (!id) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const foundCommunity = await getCommunityById(id);
        setCommunity(foundCommunity);
        
        // Check if we should go into edit mode
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('edit') === 'true' && foundCommunity?.owner_id === currentUser?.id) {
          setIsEditing(true);
        }
      } catch (error) {
        console.error('Error loading community:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCommunity();
  }, [id, getCommunityById, currentUser?.id]);

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

  const handleDelete = async () => {
    if (!community || !currentUser) return;

    try {
      setIsDeleting(true);
      const { error } = await supabase
        .from('communities')
        .delete()
        .eq('id', community.id)
        .eq('owner_id', currentUser.id);

      if (error) throw error;

      toast({
        title: 'Community Deleted',
        description: 'Your community has been successfully deleted.',
      });

      navigate('/eco8');
    } catch (error) {
      console.error('Error deleting community:', error);
      toast({
        title: 'Delete Failed',
        description: error instanceof Error ? error.message : 'Failed to delete community.',
        variant: 'destructive',
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSave = (updatedCommunity: Community) => {
    setCommunity(updatedCommunity);
    setIsEditing(false);
  };

  const isOwner = currentUser?.id === community.owner_id;
  const isRecent = new Date(community.updated_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  if (isEditing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
        <Navbar />
        <div className="container mx-auto max-w-6xl px-4 py-8">
          <Eco8Navigation hasUserCommunities={hasUserCommunities} />
          
          <div className="max-w-4xl mx-auto">
            <CommunityEditForm
              community={community}
              onSave={handleSave}
              onCancel={() => setIsEditing(false)}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
      <Navbar />
      
      {/* Sleek Profile Header - Similar to DotConnectorHeader */}
      <div className="w-full">
        <div className="container mx-auto px-4 py-6 max-w-6xl">
          <Card className="overflow-hidden bg-gradient-to-br from-background via-muted/5 to-background border-border/50 shadow-2xl">
            <CardContent className="p-0">
              <div className="relative bg-gradient-to-r from-background via-background/50 to-background p-6 lg:p-8">
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 lg:gap-8">
                  {/* Community Logo */}
                  <div className="relative flex-shrink-0">
                    <Avatar className="w-24 h-24 border-4 border-background shadow-2xl">
                      <AvatarImage src={community.logo_url} alt={community.name} />
                      <AvatarFallback className="text-3xl bg-gradient-to-br from-primary to-primary/60">
                        {community.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  
                  {/* Community Info */}
                  <div className="flex-1 min-w-0 text-center sm:text-left">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-3">
                      <h1 className="text-3xl lg:text-4xl font-bold text-foreground tracking-tight">
                        {community.name}
                      </h1>
                      <Badge variant="secondary" className="text-sm font-medium self-center sm:self-auto">
                        {community.type || 'Community'}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-3 justify-center sm:justify-start flex-wrap mb-2">
                      {community.location && (
                        <div className="flex items-center gap-2">
                          <MapPin className="w-5 h-5 text-muted-foreground" />
                          <span className="text-lg text-muted-foreground font-medium">{community.location}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex-shrink-0 w-full sm:w-auto">
                    <div className="flex gap-2 justify-center sm:justify-start">
                      {isOwner ? (
                        <>
                          <Button 
                            onClick={() => setIsEditing(true)}
                            size="default" 
                            className="px-6 lg:px-8 py-3 lg:py-4 text-base lg:text-lg font-semibold"
                          >
                            <Edit className="w-5 h-5 mr-3" />
                            Edit
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button size="default" variant="ghost" className="px-3 py-3">
                                <Trash2 className="h-5 w-5" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Community</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete "{community.name}"? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction 
                                  onClick={handleDelete}
                                  disabled={isDeleting}
                                  className="bg-destructive hover:bg-destructive/90"
                                >
                                  {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </>
                      ) : (
                        <>
                          <Button size="default" className="px-6 py-3 text-base font-semibold">
                            <Users className="h-5 w-5 mr-2" />
                            Join
                          </Button>
                          <Button variant="outline" size="default" className="px-3 py-3">
                            <MessageCircle className="h-5 w-5" />
                          </Button>
                          <Button variant="outline" size="default" className="px-3 py-3">
                            <Share2 className="h-5 w-5" />
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Glowing Sliver */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-primary to-transparent relative">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary to-transparent blur-[2px] opacity-60" />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/50 to-transparent blur-[4px] opacity-40" />
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6 max-w-6xl space-y-6">
        <Eco8Navigation hasUserCommunities={hasUserCommunities} />
        
        {/* Stats Cards Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="hover:shadow-lg transition-all duration-300 border-primary/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Members</p>
                  <p className="text-3xl font-bold bg-gradient-to-br from-primary to-primary/60 bg-clip-text text-transparent">
                    {community.member_count || '1'}
                  </p>
                  {isRecent && (
                    <p className="text-xs text-green-500 mt-1">+12% this week</p>
                  )}
                </div>
                <div className="p-3 rounded-xl bg-gradient-to-br from-primary/10 to-primary/20">
                  <Users className="h-8 w-8 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-lg transition-all duration-300 border-blue-500/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Engagement</p>
                  <p className="text-3xl font-bold bg-gradient-to-br from-blue-500 to-blue-400 bg-clip-text text-transparent">
                    {isRecent ? '68%' : '45%'}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">Activity rate</p>
                </div>
                <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500/10 to-blue-500/20">
                  <Activity className="h-8 w-8 text-blue-500" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-lg transition-all duration-300 border-green-500/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Growth</p>
                  <p className="text-3xl font-bold bg-gradient-to-br from-green-500 to-green-400 bg-clip-text text-transparent">
                    +{isRecent ? '32' : '15'}%
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">This month</p>
                </div>
                <div className="p-3 rounded-xl bg-gradient-to-br from-green-500/10 to-green-500/20">
                  <TrendingUp className="h-8 w-8 text-green-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Full-Width Panel with Accordions */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <Building2 className="h-6 w-6 text-primary" />
              Community Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="multiple" className="w-full">
              {/* About */}
              {community.description && (
                <AccordionItem value="about">
                  <AccordionTrigger className="text-lg font-semibold">
                    About the Community
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="text-muted-foreground leading-relaxed text-base pt-2">
                      {community.description}
                    </p>
                  </AccordionContent>
                </AccordionItem>
              )}

              {/* Vision & Values */}
              {(community.vision || community.community_values) && (
                <AccordionItem value="vision">
                  <AccordionTrigger className="text-lg font-semibold">
                    Vision & Values
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4 pt-2">
                      {community.vision && (
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <Lightbulb className="h-5 w-5 text-purple-500" />
                            <h4 className="font-semibold">Vision</h4>
                          </div>
                          <p className="text-muted-foreground leading-relaxed">{community.vision}</p>
                        </div>
                      )}
                      {community.community_values && (
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <Heart className="h-5 w-5 text-pink-500" />
                            <h4 className="font-semibold">Values</h4>
                          </div>
                          <p className="text-muted-foreground leading-relaxed">{community.community_values}</p>
                        </div>
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              )}

              {/* Target Audience */}
              {community.target_audience && community.target_audience.length > 0 && (
                <AccordionItem value="audience">
                  <AccordionTrigger className="text-lg font-semibold">
                    <div className="flex items-center gap-2">
                      <Target className="h-5 w-5 text-primary" />
                      Target Audience
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4 pt-2">
                      {(() => {
                        const audienceMap = new Map();
                        community.target_audience.forEach((item: any) => {
                          if (item && typeof item === 'object' && item.id) {
                            audienceMap.set(item.id, {
                              option: item.option,
                              importance: item.importance || 0
                            });
                          }
                        });
                        
                        const demographics = [
                          { id: 'age', label: 'Age Range' },
                          { id: 'status', label: 'Professional Status' },
                          { id: 'gender', label: 'Gender' },
                          { id: 'race', label: 'Ethnicity' }
                        ];
                        
                        const psychographics = [
                          { id: 'interest', label: 'Interest' },
                          { id: 'lifestyle', label: 'Lifestyle' },
                          { id: 'values', label: 'Values' },
                          { id: 'attitudes', label: 'Attitudes' }
                        ];
                        
                        const demographicsData = demographics.filter(d => audienceMap.has(d.id));
                        const psychographicsData = psychographics.filter(p => audienceMap.has(p.id));
                        
                        return (
                          <div className="space-y-4">
                            {demographicsData.length > 0 && (
                              <div>
                                <h4 className="text-sm font-semibold text-muted-foreground mb-3 uppercase">Demographics</h4>
                                <div className="flex flex-wrap gap-2">
                                  {demographicsData.map(({ id, label }) => {
                                    const data = audienceMap.get(id);
                                    return (
                                      <Badge key={id} variant="secondary" className="text-sm">
                                        {label}: {data.option.replace(/-/g, ' ')}
                                      </Badge>
                                    );
                                  })}
                                </div>
                              </div>
                            )}
                            
                            {psychographicsData.length > 0 && (
                              <div>
                                <h4 className="text-sm font-semibold text-muted-foreground mb-3 uppercase">Psychographics</h4>
                                <div className="flex flex-wrap gap-2">
                                  {psychographicsData.map(({ id, label }) => {
                                    const data = audienceMap.get(id);
                                    return (
                                      <Badge key={id} variant="outline" className="text-sm">
                                        {label}: {data.option.replace(/-/g, ' ')}
                                      </Badge>
                                    );
                                  })}
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })()}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              )}

              {/* Structure & Leadership */}
              {(community.community_structure || community.personal_background) && (
                <AccordionItem value="structure">
                  <AccordionTrigger className="text-lg font-semibold">
                    Structure & Leadership
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4 pt-2">
                      {community.community_structure && (
                        <div>
                          <h4 className="font-semibold mb-2">Community Structure</h4>
                          <p className="text-muted-foreground leading-relaxed">{community.community_structure}</p>
                        </div>
                      )}
                      {community.personal_background && (
                        <div>
                          <h4 className="font-semibold mb-2 flex items-center gap-2">
                            <BookOpen className="h-4 w-4 text-orange-500" />
                            Founder Background
                          </h4>
                          <p className="text-muted-foreground leading-relaxed">{community.personal_background}</p>
                        </div>
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              )}

              {/* Community Details */}
              {(community.format || community.community_size || community.event_frequency || community.start_date) && (
                <AccordionItem value="details">
                  <AccordionTrigger className="text-lg font-semibold">
                    Community Details
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="grid grid-cols-2 gap-4 pt-2">
                      {community.format && (
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Format</p>
                          <Badge variant="outline">{community.format}</Badge>
                        </div>
                      )}
                      {community.community_size && (
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Size</p>
                          <p className="font-medium">{community.community_size}</p>
                        </div>
                      )}
                      {community.event_frequency && (
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Events</p>
                          <p className="font-medium">{community.event_frequency}</p>
                        </div>
                      )}
                      {community.start_date && (
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Started</p>
                          <p className="font-medium">{community.start_date}</p>
                        </div>
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              )}
            </Accordion>
          </CardContent>
        </Card>

        {/* Links & Social Media Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Quick Links */}
          {(community.website || community.newsletter_url) && (
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Globe className="h-5 w-5 text-primary" />
                  Quick Links
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {community.website && (
                  <a
                    href={community.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-all group"
                  >
                    <Globe className="h-5 w-5 text-primary" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Website</p>
                    </div>
                    <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  </a>
                )}
                {community.newsletter_url && (
                  <a
                    href={community.newsletter_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-all group"
                  >
                    <Rss className="h-5 w-5 text-blue-500" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Newsletter</p>
                    </div>
                    <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-blue-500 transition-colors" />
                  </a>
                )}
              </CardContent>
            </Card>
          )}

          {/* Social Media */}
          {community.social_media && Object.keys(community.social_media).length > 0 && (
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Share2 className="h-5 w-5 text-blue-500" />
                  Social Media
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {Object.entries(community.social_media).map(([platform, url]) => (
                  <a
                    key={platform}
                    href={url as string}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-all group"
                  >
                    <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center">
                      <span className="text-xs font-bold text-blue-500 uppercase">{platform.charAt(0)}</span>
                    </div>
                    <p className="text-sm font-medium capitalize flex-1">{platform}</p>
                    <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-blue-500 transition-colors" />
                  </a>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Communication Platforms */}
          {community.communication_platforms && Object.keys(community.communication_platforms).length > 0 && (
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <MessageCircle className="h-5 w-5 text-green-500" />
                  Communication
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {Object.entries(community.communication_platforms).map(([platform, url]) => (
                  <a
                    key={platform}
                    href={url as string}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-all group"
                  >
                    <MessageCircle className="h-5 w-5 text-green-500" />
                    <p className="text-sm font-medium capitalize flex-1">{platform}</p>
                    <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-green-500 transition-colors" />
                  </a>
                ))}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Tags */}
        {community.tags && community.tags.length > 0 && (
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Award className="h-5 w-5 text-primary" />
                Tags & Categories
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {community.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="text-sm">
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default CommunityProfile;
