
import React, { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Edit, MapPin, Globe, User, Users, Mail, Phone, ExternalLink, Settings, BarChart2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { UnifiedProfile } from "@/types/unifiedProfile";
import { UserRole } from "@/models/types";
import { usePermissions } from "@/hooks/usePermissions";
import { supabase } from "@/integrations/supabase/client";
import RoleChangeDialog from "./RoleChangeDialog";
import PublicContactForm from "./PublicContactForm";
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
    imageUrl: profile.avatar_url || '',
    email: profile.email,
    bio: profile.bio || '',
    communities: []
  });
  const { data: stats } = useUserKnowledgeStats();

  const FIXED_AVATAR_URL = "https://www.pollen8.app/wp-content/uploads/2025/03/larissa-avatar.gif";

  useEffect(() => {
    const fetchUserCommunities = async () => {
      if (!profile?.id) return;
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('communities')
          .select('*')
          .eq('owner_id', profile.id);
        if (error) {
          console.error("Error fetching communities:", error);
          return;
        }
        setCommunities(data || []);
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

  // Debug: log interests
  console.log("Profile interests:", profile.interests);

  return (
    <div className="w-full max-w-7xl mx-auto p-6 space-y-8">
      {/* Enhanced Business Card Header - Full Width */}
      <Card className="overflow-hidden bg-gradient-to-br from-background via-muted/5 to-background border-border/50 shadow-2xl">
        <CardContent className="p-0">
          <div className="relative bg-gradient-to-r from-background via-background/50 to-background p-8">
            <div className="flex items-center gap-8">
              {/* Avatar with Instagram-style animated gradient border */}
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary via-secondary to-accent rounded-full animate-spin-slow opacity-75 blur-sm" />
                <div className="absolute -inset-0.5 bg-gradient-to-r from-primary via-secondary to-accent rounded-full animate-pulse" />
                <Avatar className="relative w-24 h-24 border-4 border-background shadow-2xl">
                  <AvatarImage src={profile.avatar_url || FIXED_AVATAR_URL} alt={getFullName()} />
                  <AvatarFallback className="text-2xl font-bold bg-gradient-to-br from-primary/20 to-secondary/20">
                    {getInitials()}
                  </AvatarFallback>
                </Avatar>
              </div>
              
              {/* Profile Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-4 mb-3">
                  <h1 className="text-5xl font-bold text-foreground tracking-tight">
                    {getFullName()}
                  </h1>
                  {profile.role && (
                    <Badge variant="secondary" className="text-sm font-medium">
                      {profile.role}
                    </Badge>
                  )}
                </div>
                
                {profile.location && (
                  <div className="flex items-center gap-3 mb-4">
                    <MapPin className="w-5 h-5 text-muted-foreground" />
                    <span className="text-xl text-muted-foreground font-medium">{profile.location}</span>
                  </div>
                )}
                
                {profile.bio && (
                  <p className="text-lg text-foreground/80 leading-relaxed max-w-3xl mb-4">
                    {profile.bio}
                  </p>
                )}
                
                {/* Contact Information */}
                <div className="flex flex-wrap gap-4 items-center">
                  {profile.phone && (
                    <a 
                      href={`tel:${profile.phone}`}
                      className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
                    >
                      <Phone className="w-4 h-4" />
                      <span className="text-base font-medium">{profile.phone}</span>
                    </a>
                  )}
                  {profile.website && (
                    <a 
                      href={profile.website.startsWith('http') ? profile.website : `https://${profile.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span className="text-base font-medium">Website</span>
                    </a>
                  )}
                  {profile.privacy_settings?.profile_visibility && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      {profile.privacy_settings.profile_visibility === 'public' && <Globe className="w-4 h-4" />}
                      {profile.privacy_settings.profile_visibility === 'connections' && <Users className="w-4 h-4" />}
                      {profile.privacy_settings.profile_visibility === 'private' && <Settings className="w-4 h-4" />}
                      <span className="text-sm capitalize">{profile.privacy_settings.profile_visibility} Profile</span>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Action Button */}
              <div className="flex-shrink-0">
                {isOwnProfile ? (
                  <Button onClick={onEdit} size="lg" className="px-8 py-4 text-lg font-semibold">
                    <Edit className="w-5 h-5 mr-3" />
                    Edit Profile
                  </Button>
                ) : (
                  <Button variant="default" size="lg" className="px-8 py-4 text-lg font-semibold">
                    <Mail className="w-5 h-5 mr-3" />
                    Connect
                  </Button>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact Form for non-own profiles */}
      {!isOwnProfile && (
        <Accordion type="single" collapsible className="mb-8">
          <AccordionItem value="contact" className="border border-border/50 rounded-lg px-4">
            <AccordionTrigger className="text-xl font-semibold hover:no-underline py-6">
              <div className="flex items-center gap-3">
                <Mail className="w-6 h-6 text-primary" />
                Contact {getFullName()}
              </div>
            </AccordionTrigger>
            <AccordionContent className="pb-6">
              <PublicContactForm 
                profileUserId={profile.id}
                profileUserName={getFullName()}
              />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      )}

      {/* Enhanced Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        {/* Left Column - Bio & Activity */}
        <div className="xl:col-span-8 space-y-8">
          {/* Bio Section with enhanced styling */}
          {profile.bio && (
            <Card className="border-border/50 shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <User className="w-6 h-6 text-primary" />
                  About
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg text-foreground/90 leading-relaxed whitespace-pre-wrap">
                  {profile.bio}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Enhanced Activity & Stats Card */}
          <Card className="border-border/50 shadow-lg">
            <CardHeader className="pb-6">
              <CardTitle className="flex items-center gap-3 text-2xl">
                <BarChart2 className="w-6 h-6 text-primary" />
                Activity & Stats
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="text-center p-6 bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20 rounded-xl">
                  <div className="text-3xl font-bold text-primary">{stats?.totalArticles ?? 0}</div>
                  <div className="text-sm text-muted-foreground font-medium mt-1">Articles</div>
                </div>
                <div className="text-center p-6 bg-gradient-to-br from-blue-500/5 to-blue-500/10 border border-blue-500/20 rounded-xl">
                  <div className="text-3xl font-bold text-blue-500">{stats?.totalViews ?? 0}</div>
                  <div className="text-sm text-muted-foreground font-medium mt-1">Views</div>
                </div>
                <div className="text-center p-6 bg-gradient-to-br from-green-500/5 to-green-500/10 border border-green-500/20 rounded-xl">
                  <div className="text-3xl font-bold text-green-500">{stats?.totalComments ?? 0}</div>
                  <div className="text-sm text-muted-foreground font-medium mt-1">Comments</div>
                </div>
                <div className="text-center p-6 bg-gradient-to-br from-orange-500/5 to-orange-500/10 border border-orange-500/20 rounded-xl">
                  <div className="text-3xl font-bold text-orange-500">{stats?.totalVotes ?? 0}</div>
                  <div className="text-sm text-muted-foreground font-medium mt-1">Votes</div>
                </div>
                <div className="text-center p-6 bg-gradient-to-br from-purple-500/5 to-purple-500/10 border border-purple-500/20 rounded-xl">
                  <div className="text-3xl font-bold text-purple-500">{stats?.savedArticlesCount ?? 0}</div>
                  <div className="text-sm text-muted-foreground font-medium mt-1">Saved</div>
                </div>
                <div className="text-center p-6 bg-gradient-to-br from-teal-500/5 to-teal-500/10 border border-teal-500/20 rounded-xl">
                  <div className="text-3xl font-bold text-teal-500">{stats?.recentArticlesCount ?? 0}</div>
                  <div className="text-sm text-muted-foreground font-medium mt-1">Recent</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Interests, Social & Communities */}
        <div className="xl:col-span-4 space-y-8">
          {/* Enhanced Interests */}
          {profile?.interests && Array.isArray(profile.interests) && profile.interests.length > 0 && (
            <Card className="border-border/50 shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <Globe className="w-5 h-5 text-primary" />
                  Interests
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-3">
                  {profile.interests.map((interest: string, idx: number) => (
                    <Badge 
                      key={idx} 
                      variant="secondary"
                      className="px-4 py-2 text-sm font-semibold bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 border border-primary/30 hover:from-primary/20 hover:via-secondary/20 hover:to-accent/20 transition-all duration-300 cursor-pointer shadow-sm"
                    >
                      #{interest}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Enhanced Social Links */}
          {profile?.social_links && typeof profile.social_links === 'object' && Object.keys(profile.social_links).length > 0 && (
            <Card className="border-border/50 shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <ExternalLink className="w-5 h-5 text-primary" />
                  Social Links
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(profile.social_links).map(([platform, url]) => (
                    <a
                      key={platform}
                      href={typeof url === 'string' && url.startsWith('http') ? url : `https://${url}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-4 p-4 rounded-xl hover:bg-gradient-to-r hover:from-primary/5 hover:to-secondary/5 border border-transparent hover:border-primary/20 transition-all duration-300"
                    >
                      <ExternalLink className="w-5 h-5 text-primary" />
                      <span className="capitalize font-medium text-lg">{platform}</span>
                    </a>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Enhanced Communities */}
          <Card className="border-border/50 shadow-lg">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-xl">
                <Users className="w-5 h-5 text-primary" />
                Communities
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto"></div>
                  <p className="mt-4 text-muted-foreground">Loading communities...</p>
                </div>
              ) : communities.length > 0 ? (
                <div className="space-y-4">
                  {communities.map((community) => (
                    <div key={community.id} className="p-4 rounded-xl bg-gradient-to-r from-muted/20 to-muted/30 border border-border/30 hover:border-primary/20 transition-all duration-300">
                      <h4 className="font-semibold text-lg mb-2">{community.name}</h4>
                      {community.description && (
                        <p className="text-muted-foreground leading-relaxed">
                          {community.description.substring(0, 120)}
                          {community.description.length > 120 && '...'}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">
                  No communities found
                </p>
              )}
            </CardContent>
          </Card>
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
