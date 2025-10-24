import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
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
  Loader2
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
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Spotify-style Banner Header */}
      <div className="relative">
        {/* Banner Image */}
        <div className="h-80 bg-gradient-to-br from-primary/40 via-primary/20 to-accent/30 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-50"></div>
        </div>
        
        {/* Profile Section - Overlapping Banner */}
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative -mt-20 pb-8">
            <div className="flex flex-col md:flex-row gap-6 items-end md:items-start">
              {/* Avatar Circle */}
              <div className="flex-shrink-0">
                <Avatar className="w-40 h-40 border-4 border-background shadow-2xl">
                  <AvatarImage src={community.logo_url} alt={community.name} />
                  <AvatarFallback className="text-5xl bg-card">
                    {community.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
              </div>
              
              {/* Community Info */}
              <div className="flex-1 mt-4 md:mt-12">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div>
                    <h1 className="text-5xl font-bold mb-2">{community.name}</h1>
                    <p className="text-lg text-muted-foreground max-w-2xl">{community.description}</p>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex gap-2 flex-shrink-0">
                    {isOwner ? (
                      <>
                        <Button 
                          size="lg" 
                          variant="outline"
                          onClick={() => setIsEditing(true)}
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Edit Profile
                        </Button>
                        <Button variant="outline" size="lg">
                          <Share2 className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button size="lg" variant="ghost">
                              <Trash2 className="h-4 w-4" />
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
                        <Button size="lg">
                          <Users className="h-4 w-4 mr-2" />
                          Join Community
                        </Button>
                        <Button variant="outline" size="lg">
                          <MessageCircle className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="lg">
                          <Share2 className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <Eco8Navigation hasUserCommunities={hasUserCommunities} />
        
        {/* Badges Row */}
        <div className="flex flex-wrap gap-2 mb-8 items-center">
          {community.location && (
            <Badge variant="secondary" className="text-sm py-1 px-3">
              <MapPin className="h-3 w-3 mr-1" />
              {community.location}
            </Badge>
          )}
          {community.tags && community.tags.map((tag, index) => (
            <Badge key={index} variant="outline" className="text-sm py-1 px-3">
              {tag}
            </Badge>
          ))}
          {community.is_public && (
            <Badge variant="outline" className="text-sm py-1 px-3">
              Public Community
            </Badge>
          )}
          {isRecent && (
            <Badge className="text-sm py-1 px-3 bg-green-500/20 text-green-400 border-green-500/30">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse mr-2"></div>
              Recently Active
            </Badge>
          )}
        </div>

        {/* Dashboard Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column - Full Width on Mobile, 2 cols on Desktop */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Stats Cards - P8Dashboard Inspired */}
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
                      <p className="text-sm text-muted-foreground mb-1">Categories</p>
                      <p className="text-3xl font-bold bg-gradient-to-br from-blue-500 to-blue-400 bg-clip-text text-transparent">
                        {community.tags?.length || 0}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">Active topics</p>
                    </div>
                    <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500/10 to-blue-500/20">
                      <Award className="h-8 w-8 text-blue-500" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="hover:shadow-lg transition-all duration-300 border-green-500/20">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Location</p>
                      <p className="text-lg font-bold bg-gradient-to-br from-green-500 to-green-400 bg-clip-text text-transparent truncate">
                        {community.location || 'Remote'}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">Community base</p>
                    </div>
                    <div className="p-3 rounded-xl bg-gradient-to-br from-green-500/10 to-green-500/20">
                      <MapPin className="h-8 w-8 text-green-500" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* About Section - Enhanced */}
            {community.description && (
              <Card className="hover:shadow-lg transition-all duration-300 border-border/50">
                <CardHeader>
                  <CardTitle className="text-2xl flex items-center gap-2">
                    <Building2 className="h-6 w-6 text-primary" />
                    About
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed text-lg">
                    {community.description}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* 2-Column Layout - Enhanced Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Vision */}
              {community.vision && (
                <Card className="hover:shadow-lg transition-all duration-300 border-purple-500/20">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500/10 to-purple-500/20">
                        <Lightbulb className="h-5 w-5 text-purple-500" />
                      </div>
                      Vision
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">
                      {community.vision}
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Values */}
              {community.community_values && (
                <Card className="hover:shadow-lg transition-all duration-300 border-pink-500/20">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <div className="p-2 rounded-lg bg-gradient-to-br from-pink-500/10 to-pink-500/20">
                        <Heart className="h-5 w-5 text-pink-500" />
                      </div>
                      Values
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">
                      {community.community_values}
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Structure */}
              {community.community_structure && (
                <Card className="hover:shadow-lg transition-all duration-300 border-blue-500/20">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500/10 to-blue-500/20">
                        <Building2 className="h-5 w-5 text-blue-500" />
                      </div>
                      Structure
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">
                      {community.community_structure}
                    </p>
                  </CardContent>
                </Card>
              )}

              {/* Founder Background */}
              {community.personal_background && (
                <Card className="hover:shadow-lg transition-all duration-300 border-orange-500/20">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <div className="p-2 rounded-lg bg-gradient-to-br from-orange-500/10 to-orange-500/20">
                        <BookOpen className="h-5 w-5 text-orange-500" />
                      </div>
                      Founder
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">
                      {community.personal_background}
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Target Audience - Full Width with Demographics and Psychographics */}
            {community.target_audience && community.target_audience.length > 0 && (
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-primary" />
                    Target Audience
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {(() => {
                    // Convert array of objects to map for easy lookup
                    const audienceMap = new Map();
                    community.target_audience.forEach((item: any) => {
                      if (item && typeof item === 'object' && item.id) {
                        audienceMap.set(item.id, {
                          option: item.option,
                          importance: item.importance || 0
                        });
                      }
                    });
                    
                    // Helper function to get importance color
                    const getImportanceColor = (importance: number) => {
                      if (importance >= 75) return 'from-red-500/10 to-red-500/20 border-red-500/30';
                      if (importance >= 50) return 'from-orange-500/10 to-orange-500/20 border-orange-500/30';
                      if (importance >= 25) return 'from-yellow-500/10 to-yellow-500/20 border-yellow-500/30';
                      return 'from-gray-500/10 to-gray-500/20 border-gray-500/30';
                    };
                    
                    // Demographics categories
                    const demographics = [
                      { id: 'age', label: 'Age Range' },
                      { id: 'status', label: 'Professional Status' },
                      { id: 'gender', label: 'Gender' },
                      { id: 'race', label: 'Ethnicity' }
                    ];
                    
                    // Psychographics categories
                    const psychographics = [
                      { id: 'interest', label: 'Interest' },
                      { id: 'lifestyle', label: 'Lifestyle' },
                      { id: 'values', label: 'Values' },
                      { id: 'attitudes', label: 'Attitudes' }
                    ];
                    
                    const demographicsData = demographics.filter(d => audienceMap.has(d.id));
                    const psychographicsData = psychographics.filter(p => audienceMap.has(p.id));
                    
                    if (demographicsData.length === 0 && psychographicsData.length === 0) {
                      return <p className="text-muted-foreground text-center py-4">No target audience data available</p>;
                    }
                    
                    return (
                      <div className="space-y-6">
                        {/* Demographics Section */}
                        {demographicsData.length > 0 && (
                          <div>
                            <h4 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wider">Demographics</h4>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                              {demographicsData.map(({ id, label }) => {
                                const data = audienceMap.get(id);
                                return (
                                  <div key={id} className={`p-3 rounded-lg bg-gradient-to-br border ${getImportanceColor(data.importance)} relative overflow-hidden`}>
                                    {/* Importance indicator bar */}
                                    <div 
                                      className="absolute bottom-0 left-0 h-1 bg-primary/40 transition-all"
                                      style={{ width: `${data.importance}%` }}
                                    />
                                    <p className="text-xs text-muted-foreground mb-1">{label}</p>
                                    <Badge variant="secondary" className="text-xs font-semibold capitalize">
                                      {data.option.replace(/-/g, ' ')}
                                    </Badge>
                                    <p className="text-[10px] text-muted-foreground mt-1">
                                      {Math.round(data.importance / 10)}/10 importance
                                    </p>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}
                        
                        {/* Psychographics Section */}
                        {psychographicsData.length > 0 && (
                          <div>
                            <h4 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wider">Psychographics</h4>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                              {psychographicsData.map(({ id, label }) => {
                                const data = audienceMap.get(id);
                                return (
                                  <div key={id} className={`p-3 rounded-lg bg-gradient-to-br border ${getImportanceColor(data.importance)} relative overflow-hidden`}>
                                    {/* Importance indicator bar */}
                                    <div 
                                      className="absolute bottom-0 left-0 h-1 bg-blue-500/40 transition-all"
                                      style={{ width: `${data.importance}%` }}
                                    />
                                    <p className="text-xs text-muted-foreground mb-1">{label}</p>
                                    <Badge variant="secondary" className="text-xs font-semibold capitalize">
                                      {data.option.replace(/-/g, ' ')}
                                    </Badge>
                                    <p className="text-[10px] text-muted-foreground mt-1">
                                      {Math.round(data.importance / 10)}/10 importance
                                    </p>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })()}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Sidebar - Single Column */}
          <div className="space-y-6">
            
            {/* Quick Links - Enhanced */}
            <Card className="hover:shadow-lg transition-all duration-300 border-border/50 sticky top-4">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-primary/10 to-primary/20">
                    <Globe className="h-4 w-4 text-primary" />
                  </div>
                  Quick Links
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {community.website && (
                  <a
                    href={community.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-primary/5 to-primary/10 border border-primary/20 hover:border-primary/40 transition-all group"
                  >
                    <Globe className="h-5 w-5 text-primary" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">Website</p>
                      <p className="text-xs text-muted-foreground group-hover:text-foreground transition-colors truncate">
                        Visit our site
                      </p>
                    </div>
                    <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  </a>
                )}
                
                {community.newsletter_url && (
                  <a
                    href={community.newsletter_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-blue-500/5 to-blue-500/10 border border-blue-500/20 hover:border-blue-500/40 transition-all group"
                  >
                    <Rss className="h-5 w-5 text-blue-500" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">Newsletter</p>
                      <p className="text-xs text-muted-foreground group-hover:text-foreground transition-colors truncate">
                        Subscribe to updates
                      </p>
                    </div>
                    <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-blue-500 transition-colors" />
                  </a>
                )}

                <div className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-muted/30 to-muted/50 border border-border/30">
                  <Calendar className="h-5 w-5 text-primary" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Created</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(community.created_at).toLocaleDateString('en-US', { 
                        month: 'long', 
                        year: 'numeric' 
                      })}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Social Media - Enhanced */}
            {community.social_media && Object.keys(community.social_media).length > 0 && (
              <Card className="hover:shadow-lg transition-all duration-300 border-border/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500/10 to-blue-500/20">
                      <Share2 className="h-4 w-4 text-blue-500" />
                    </div>
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
                      className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-blue-500/5 to-blue-500/10 border border-blue-500/20 hover:border-blue-500/40 transition-all group"
                    >
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500/20 to-blue-500/30 flex items-center justify-center">
                        <span className="text-xs font-bold text-blue-500 uppercase">
                          {platform.charAt(0)}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium capitalize">{platform}</p>
                      </div>
                      <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-blue-500 transition-colors" />
                    </a>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Communication Platforms - Enhanced */}
            {community.communication_platforms && Object.keys(community.communication_platforms).length > 0 && (
              <Card className="hover:shadow-lg transition-all duration-300 border-border/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-green-500/10 to-green-500/20">
                      <MessageCircle className="h-4 w-4 text-green-500" />
                    </div>
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
                      className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-green-500/5 to-green-500/10 border border-green-500/20 hover:border-green-500/40 transition-all group"
                    >
                      <MessageCircle className="h-5 w-5 text-green-500" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium capitalize">{platform}</p>
                      </div>
                      <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-green-500 transition-colors" />
                    </a>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Community Details */}
            {(community.format || community.community_size || community.event_frequency || community.start_date) && (
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {community.format && (
                    <div className="flex justify-between items-center p-2">
                      <span className="text-sm text-muted-foreground">Format</span>
                      <Badge variant="outline">{community.format}</Badge>
                    </div>
                  )}
                  
                  {community.community_size && (
                    <div className="flex justify-between items-center p-2">
                      <span className="text-sm text-muted-foreground">Size</span>
                      <span className="text-sm font-medium">{community.community_size}</span>
                    </div>
                  )}

                  {community.event_frequency && (
                    <div className="flex justify-between items-center p-2">
                      <span className="text-sm text-muted-foreground">Events</span>
                      <span className="text-sm font-medium">{community.event_frequency}</span>
                    </div>
                  )}

                  {community.start_date && (
                    <div className="flex justify-between items-center p-2">
                      <span className="text-sm text-muted-foreground">Started</span>
                      <span className="text-sm font-medium">{community.start_date}</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityProfile;