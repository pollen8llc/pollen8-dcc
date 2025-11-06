
import React, { useState, useEffect } from "react";
import { Avatar } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import { Edit, MapPin, Globe, User, Users, Mail, Phone, ExternalLink, Settings, BarChart2, TrendingUp, Network } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { UnifiedProfile } from "@/types/unifiedProfile";
import { UserRole } from "@/models/types";
import { usePermissions } from "@/hooks/usePermissions";
import { supabase } from "@/integrations/supabase/client";
import RoleChangeDialog from "./RoleChangeDialog";

import { useUserKnowledgeStats } from "@/hooks/knowledge/useUserKnowledgeStats";

interface EnhancedProfileViewProps {
  profile: UnifiedProfile;
  isOwnProfile: boolean;
  onEdit: () => void;
}

const EnhancedProfileView: React.FC<EnhancedProfileViewProps> = ({ 
  profile, 
  isOwnProfile, 
  onEdit 
}) => {
  const [communities, setCommunities] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showRoleDialog, setShowRoleDialog] = useState(false);
  const { getRoleBadge } = usePermissions({
    id: profile.id,
    name: `${profile.first_name} ${profile.last_name}`,
    role: profile.role,
    imageUrl: '', // Simplified avatar system
    email: profile.email,
    bio: profile.bio || '',
    communities: []
  });
  const { stats } = useUserKnowledgeStats();

  useEffect(() => {
    const fetchUserCommunities = async () => {
      if (!profile?.id) return;
      setIsLoading(true);
      try {
        // Fetch owned communities
        const { data: ownedData, error: ownedError } = await supabase
          .from('communities')
          .select('*')
          .eq('owner_id', profile.id);
        
        if (ownedError) {
          console.error("Error fetching owned communities:", ownedError);
        }
        
        // Fetch communities where user is a member
        const { data: memberData, error: memberError } = await supabase
          .from('community_members')
          .select(`
            community_id,
            communities (
              id,
              name,
              description,
              type,
              location,
              is_public,
              website,
              logo_url,
              created_at,
              updated_at
            )
          `)
          .eq('user_id', profile.id);
        
        if (memberError) {
          console.error("Error fetching member communities:", memberError);
        }
        
        // Extract community data from member result
        const memberCommunities = memberData
          ?.map(item => item.communities)
          .filter(Boolean) || [];
        
        // Combine and deduplicate by id
        const allCommunities = [...(ownedData || []), ...memberCommunities];
        const uniqueCommunities = Array.from(
          new Map(allCommunities.map(c => [c.id, c])).values()
        );
        
        setCommunities(uniqueCommunities as any);
      } catch (error) {
        console.error("Error in fetchUserCommunities:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUserCommunities();
  }, [profile?.id]);

  const getFullName = () => {
    return [profile.first_name, profile.last_name]
      .filter(Boolean)
      .join(" ") || "Anonymous User";
  };

  const getInitials = () => {
    const firstName = profile.first_name || '';
    const lastName = profile.last_name || '';
    if (firstName && lastName) {
      return `${firstName[0]}${lastName[0]}`.toUpperCase();
    } else if (firstName) {
      return firstName[0].toUpperCase();
    } else if (lastName) {
      return lastName[0].toUpperCase();
    }
    return '?';
  };

  const isAdmin = profile?.role === UserRole.ADMIN;
  const roleBadge = getRoleBadge();

  // Debug: log interests and social links
  console.log("Profile interests:", profile.interests);
  console.log("Profile social_links:", profile.social_links);
  console.log("Profile social_links type:", typeof profile.social_links);
  console.log("Profile social_links keys:", profile.social_links ? Object.keys(profile.social_links) : 'no social_links');

  return (
    <div className="w-full max-w-7xl mx-auto p-3 sm:p-4 lg:p-6 space-y-4 sm:space-y-6 lg:space-y-8">
      {/* Simplified Profile Header - Only Avatar, Name, Location */}
      <Card className="overflow-hidden bg-gradient-to-br from-background via-muted/5 to-background border-border/50 shadow-2xl">
        <CardContent className="p-0">
          <div className="relative bg-gradient-to-r from-background via-background/50 to-background p-4 sm:p-6 lg:p-8">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 lg:gap-8">
              {/* Avatar */}
              <div className="relative flex-shrink-0">
                <Avatar userId={profile.user_id} size={96} />
              </div>
              
              {/* Profile Info - Name and Location Only */}
              <div className="flex-1 min-w-0 text-center sm:text-left">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-2 sm:mb-3">
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground tracking-tight">
                    {getFullName()}
                  </h1>
                  {profile.role && (
                    <Badge variant="secondary" className="text-xs sm:text-sm font-medium self-center sm:self-auto">
                      {profile.role}
                    </Badge>
                  )}
                </div>
                
                <div className="flex items-center gap-2 sm:gap-3 justify-center sm:justify-start flex-wrap">
                  {profile.location && (
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
                      <span className="text-base sm:text-lg lg:text-xl text-muted-foreground font-medium">{profile.location}</span>
                    </div>
                  )}
                  {profile.website && (
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Globe className="w-3 h-3" />
                      <a 
                        href={profile.website.startsWith('http') ? profile.website : `https://${profile.website}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs hover:underline"
                      >
                        Website
                      </a>
                    </Badge>
                  )}
                </div>
              </div>
              
              {/* Action Button */}
              <div className="flex-shrink-0 w-full sm:w-auto">
                {isOwnProfile ? (
                  <Button onClick={onEdit} size="default" className="w-full sm:w-auto px-4 sm:px-6 lg:px-8 py-2 sm:py-3 lg:py-4 text-sm sm:text-base lg:text-lg font-semibold">
                    <Edit className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3" />
                    Edit Profile
                  </Button>
                ) : (
                  <Button variant="default" size="default" className="w-full sm:w-auto px-4 sm:px-6 lg:px-8 py-2 sm:py-3 lg:py-4 text-sm sm:text-base lg:text-lg font-semibold">
                    <Mail className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3" />
                    Connect
                  </Button>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>


      {/* Enhanced Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 lg:gap-8">
        {/* Left Column - Bio & Activity */}
        <div className="lg:col-span-8 space-y-4 sm:space-y-6 lg:space-y-8">
          {/* Bio Section with enhanced styling */}
          {profile.bio && (
            <Card className="border-border/50 shadow-lg">
              <CardHeader className="pb-3 sm:pb-4">
                <CardTitle className="flex items-center gap-2 sm:gap-3 text-lg sm:text-xl lg:text-2xl">
                  <User className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                  About
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm sm:text-base lg:text-lg text-foreground/90 leading-relaxed whitespace-pre-wrap">
                  {profile.bio}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Network Stats Card */}
          <Card className="border-border/50 shadow-lg">
            <CardHeader className="pb-4 sm:pb-6">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 sm:gap-3 text-lg sm:text-xl lg:text-2xl">
                  <Network className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                  Network Stats
                </CardTitle>
                {isOwnProfile && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => window.location.href = '/rel8t'}
                    className="gap-2"
                  >
                    <Users className="w-4 h-4" />
                    Rel8t
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-6 sm:space-y-8">
              {/* Active vs Total Connections - Percentage Bar */}
              <div className="p-4 sm:p-6 bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20 rounded-xl space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm sm:text-base font-semibold text-foreground">Connection Activity</h4>
                  <span className="text-sm sm:text-base font-bold text-primary">35 of 48 active</span>
                </div>
                <div className="relative h-6 sm:h-8 bg-background/40 backdrop-blur-sm rounded-full overflow-hidden border border-primary/30">
                  <div 
                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary via-primary-glow to-primary rounded-full transition-all duration-500 flex items-center justify-center"
                    style={{ width: '73%' }}
                  >
                    <span className="text-xs sm:text-sm font-bold text-primary-foreground px-2">73%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs sm:text-sm text-muted-foreground">
                  <span>73% actively communicating</span>
                  <span>13 inactive</span>
                </div>
              </div>

              {/* Rapport Growth Line Graph */}
              <div className="p-4 sm:p-6 bg-gradient-to-br from-green-500/5 to-green-500/10 border border-green-500/20 rounded-xl space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm sm:text-base font-semibold text-foreground">Rapport Growth</h4>
                  <span className="text-sm sm:text-base font-bold text-green-500">+24% this month</span>
                </div>
                <div className="h-40 sm:h-48 bg-background/20 backdrop-blur-sm rounded-lg border border-green-500/30 p-4 flex items-end gap-2">
                  {/* Mock line graph bars */}
                  <div className="flex-1 flex flex-col justify-end items-center gap-1">
                    <div className="w-full bg-gradient-to-t from-green-500/60 to-green-500/30 rounded-t" style={{ height: '45%' }}></div>
                    <span className="text-xs text-muted-foreground">W1</span>
                  </div>
                  <div className="flex-1 flex flex-col justify-end items-center gap-1">
                    <div className="w-full bg-gradient-to-t from-green-500/60 to-green-500/30 rounded-t" style={{ height: '62%' }}></div>
                    <span className="text-xs text-muted-foreground">W2</span>
                  </div>
                  <div className="flex-1 flex flex-col justify-end items-center gap-1">
                    <div className="w-full bg-gradient-to-t from-green-500/60 to-green-500/30 rounded-t" style={{ height: '58%' }}></div>
                    <span className="text-xs text-muted-foreground">W3</span>
                  </div>
                  <div className="flex-1 flex flex-col justify-end items-center gap-1">
                    <div className="w-full bg-gradient-to-t from-green-500/70 to-green-500/40 rounded-t" style={{ height: '85%' }}></div>
                    <span className="text-xs text-muted-foreground">W4</span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs sm:text-sm text-muted-foreground">
                  <span>Based on messages, calls & meetings</span>
                  <TrendingUp className="h-4 w-4 text-green-500" />
                </div>
              </div>

              {/* Cross Connections Line Graph */}
              <div className="p-4 sm:p-6 bg-gradient-to-br from-blue-500/5 to-blue-500/10 border border-blue-500/20 rounded-xl space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm sm:text-base font-semibold text-foreground">Cross Connections</h4>
                  <span className="text-sm sm:text-base font-bold text-blue-500">12 new links</span>
                </div>
                <div className="h-40 sm:h-48 bg-background/20 backdrop-blur-sm rounded-lg border border-blue-500/30 p-4 flex items-end gap-2">
                  {/* Mock cross-connection graph */}
                  <div className="flex-1 flex flex-col justify-end items-center gap-1">
                    <div className="w-full bg-gradient-to-t from-blue-500/60 to-blue-500/30 rounded-t" style={{ height: '35%' }}></div>
                    <span className="text-xs text-muted-foreground">W1</span>
                  </div>
                  <div className="flex-1 flex flex-col justify-end items-center gap-1">
                    <div className="w-full bg-gradient-to-t from-blue-500/60 to-blue-500/30 rounded-t" style={{ height: '48%' }}></div>
                    <span className="text-xs text-muted-foreground">W2</span>
                  </div>
                  <div className="flex-1 flex flex-col justify-end items-center gap-1">
                    <div className="w-full bg-gradient-to-t from-blue-500/70 to-blue-500/40 rounded-t" style={{ height: '72%' }}></div>
                    <span className="text-xs text-muted-foreground">W3</span>
                  </div>
                  <div className="flex-1 flex flex-col justify-end items-center gap-1">
                    <div className="w-full bg-gradient-to-t from-blue-500/70 to-blue-500/40 rounded-t" style={{ height: '90%' }}></div>
                    <span className="text-xs text-muted-foreground">W4</span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs sm:text-sm text-muted-foreground">
                  <span>Connections introducing you to their network</span>
                  <Network className="h-4 w-4 text-blue-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Enhanced Communities - Moved to main panel */}
          <Card className="border-border/50 shadow-lg">
            <CardHeader className="pb-3 sm:pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 sm:gap-3 text-lg sm:text-xl lg:text-2xl">
                  <Users className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                  Communities
                </CardTitle>
                {isOwnProfile && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => window.location.href = '/eco8'}
                    className="gap-2"
                  >
                    <Users className="w-4 h-4" />
                    Eco8
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-6 sm:py-8">
                  <div className="animate-spin rounded-full h-8 w-8 sm:h-10 sm:w-10 border-b-2 border-primary mx-auto"></div>
                  <p className="mt-3 sm:mt-4 text-sm sm:text-base text-muted-foreground">Loading communities...</p>
                </div>
              ) : communities.length > 0 ? (
                <div className="space-y-3 sm:space-y-4">
                  {communities.map((community) => (
                    <div key={community.id} className="p-3 sm:p-4 rounded-xl bg-gradient-to-r from-muted/20 to-muted/30 border border-border/30 hover:border-primary/20 transition-all duration-300">
                      <h4 className="font-semibold text-sm sm:text-base lg:text-lg mb-1 sm:mb-2">{community.name}</h4>
                      {community.description && (
                        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                          {community.description.substring(0, 120)}
                          {community.description.length > 120 && '...'}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-6 sm:py-8 text-sm sm:text-base">
                  No communities found
                </p>
              )}
            </CardContent>
          </Card>

          {/* Enhanced Activity & Stats Card - Moved to bottom */}
          <Card className="border-border/50 shadow-lg">
            <CardHeader className="pb-4 sm:pb-6">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 sm:gap-3 text-lg sm:text-xl lg:text-2xl">
                  <BarChart2 className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                  Activity & Stats
                </CardTitle>
                {isOwnProfile && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => window.location.href = '/knowledge/my-resources'}
                    className="gap-2"
                  >
                    <Settings className="w-4 h-4" />
                    Cultiv8
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
                <div className="text-center p-3 sm:p-4 lg:p-6 bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20 rounded-xl">
                  <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-primary">{stats?.totalArticles ?? 0}</div>
                  <div className="text-xs sm:text-sm text-muted-foreground font-medium mt-1">Articles</div>
                </div>
                <div className="text-center p-3 sm:p-4 lg:p-6 bg-gradient-to-br from-blue-500/5 to-blue-500/10 border border-blue-500/20 rounded-xl">
                  <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-blue-500">{stats?.totalViews ?? 0}</div>
                  <div className="text-xs sm:text-sm text-muted-foreground font-medium mt-1">Views</div>
                </div>
                <div className="text-center p-3 sm:p-4 lg:p-6 bg-gradient-to-br from-green-500/5 to-green-500/10 border border-green-500/20 rounded-xl">
                  <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-green-500">{stats?.totalComments ?? 0}</div>
                  <div className="text-xs sm:text-sm text-muted-foreground font-medium mt-1">Comments</div>
                </div>
                <div className="text-center p-3 sm:p-4 lg:p-6 bg-gradient-to-br from-orange-500/5 to-orange-500/10 border border-orange-500/20 rounded-xl">
                  <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-orange-500">{stats?.totalVotes ?? 0}</div>
                  <div className="text-xs sm:text-sm text-muted-foreground font-medium mt-1">Votes</div>
                </div>
                <div className="text-center p-3 sm:p-4 lg:p-6 bg-gradient-to-br from-purple-500/5 to-purple-500/10 border border-purple-500/20 rounded-xl">
                  <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-purple-500">{stats?.savedArticlesCount ?? 0}</div>
                  <div className="text-xs sm:text-sm text-muted-foreground font-medium mt-1">Saved</div>
                </div>
                <div className="text-center p-3 sm:p-4 lg:p-6 bg-gradient-to-br from-teal-500/5 to-teal-500/10 border border-teal-500/20 rounded-xl">
                  <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-teal-500">{stats?.recentArticlesCount ?? 0}</div>
                  <div className="text-xs sm:text-sm text-muted-foreground font-medium mt-1">Recent</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Interests & Social Links Only */}
        <div className="lg:col-span-4 space-y-4 sm:space-y-6 lg:space-y-8">
          {/* Enhanced Interests */}
          {profile?.interests && Array.isArray(profile.interests) && profile.interests.length > 0 && (
            <Card className="border-border/50 shadow-lg">
              <CardHeader className="pb-3 sm:pb-4">
                <CardTitle className="flex items-center gap-2 sm:gap-3 text-lg sm:text-xl">
                  <Globe className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                  Interests
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2 sm:gap-3">
                  {profile.interests.map((interest: string, idx: number) => (
                    <Badge 
                      key={idx} 
                      variant="secondary"
                      className="px-2 sm:px-3 lg:px-4 py-1 sm:py-2 text-xs sm:text-sm font-semibold bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 border border-primary/30 hover:from-primary/20 hover:via-secondary/20 hover:to-accent/20 transition-all duration-300 cursor-pointer shadow-sm"
                    >
                      #{interest}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Enhanced Social Links - Show All Profile Links */}
          {profile?.social_links && typeof profile.social_links === 'object' && (
            <Card className="border-border/50 shadow-lg">
              <CardHeader className="pb-3 sm:pb-4">
                <CardTitle className="flex items-center gap-2 sm:gap-3 text-lg sm:text-xl">
                  <ExternalLink className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                  Social Links
                </CardTitle>
              </CardHeader>
              <CardContent>
                {(() => {
                  const socialEntries = Object.entries(profile.social_links || {})
                    .filter(([platform, url]) => {
                      const hasValue = url && typeof url === 'string' && url.trim() !== '';
                      console.log(`Social link ${platform}:`, url, 'hasValue:', hasValue);
                      return hasValue;
                    });
                  
                  console.log('Filtered social entries:', socialEntries);
                  
                  if (socialEntries.length === 0) {
                    return (
                      <p className="text-muted-foreground text-center py-4 text-sm sm:text-base">
                        No social links added
                      </p>
                    );
                  }
                  
                  return (
                    <div className="space-y-2 sm:space-y-3">
                      {socialEntries.map(([platform, url]) => {
                        // Updated platform labeling for social networks and event platforms
                        const platformLabels = {
                          linkedin: 'LinkedIn',
                          twitter: 'Twitter',
                          facebook: 'Facebook',
                          instagram: 'Instagram',
                          github: 'GitHub',
                          youtube: 'YouTube',
                          tiktok: 'TikTok',
                          discord: 'Discord',
                          telegram: 'Telegram',
                          website: 'Website',
                          portfolio: 'Portfolio',
                          blog: 'Blog',
                          luma: 'Luma',
                          eventbrite: 'Eventbrite',
                          meetup: 'Meetup',
                          snapchat: 'Snapchat',
                          pinterest: 'Pinterest',
                          whatsapp: 'WhatsApp',
                          threads: 'Threads',
                          medium: 'Medium',
                          behance: 'Behance',
                          dribbble: 'Dribbble'
                        };
                        
                        const displayName = platformLabels[platform.toLowerCase()] || 
                          platform.charAt(0).toUpperCase() + platform.slice(1);
                        
                        return (
                          <a
                            key={platform}
                            href={url.startsWith('http') ? url : `https://${url}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl hover:bg-gradient-to-r hover:from-primary/5 hover:to-secondary/5 border border-transparent hover:border-primary/20 transition-all duration-300 min-h-[44px]"
                          >
                            <ExternalLink className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <span className="font-medium text-sm sm:text-base lg:text-lg block">{displayName}</span>
                              <span className="text-xs sm:text-sm text-muted-foreground truncate block">{url}</span>
                            </div>
                          </a>
                        );
                      })}
                    </div>
                  );
                })()}
              </CardContent>
            </Card>
          )}
        </div>
      </div>


      {/* Role Change Dialog */}
      <RoleChangeDialog
        open={showRoleDialog}
        onOpenChange={setShowRoleDialog}
        currentRole={profile.role}
      />
    </div>
  );
};

export default EnhancedProfileView;
