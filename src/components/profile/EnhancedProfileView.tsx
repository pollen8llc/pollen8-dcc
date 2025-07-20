
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

  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* Business Card Header - Horizontal Layout */}
      <Card className="group relative overflow-hidden border-0 bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-all duration-300 hover:shadow-xl hover:shadow-black/5 mb-8">
        <div 
          className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity duration-300"
          style={{ background: `linear-gradient(135deg, hsl(var(--primary)) 0%, transparent 100%)` }}
        />
        <CardContent className="p-6 relative">
          <div className="flex items-center gap-6">
            {/* Animated 3px conic-gradient border avatar */}
            <div className="relative flex-shrink-0">
              <div className="relative h-20 w-20 md:h-28 md:w-28">
                <span className="absolute inset-0 rounded-full animate-gradient-spin border-4 border-transparent" style={{
                  background: 'conic-gradient(from 180deg at 50% 50%, #3b82f6, #fff, #00eada, #3b82f6)',
                  padding: 0,
                  borderWidth: '3px',
                  zIndex: 1
                }} />
                <Avatar className="relative h-20 w-20 md:h-28 md:w-28 border-4 border-background shadow-lg z-10">
                  <AvatarImage src={FIXED_AVATAR_URL} alt={getFullName()} className="object-cover" />
                  <AvatarFallback className="text-lg font-semibold bg-gradient-to-br from-primary/20 to-accent/20">
                    {getInitials()}
                  </AvatarFallback>
                </Avatar>
              </div>
            </div>
            {/* Basic Info */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-semibold text-foreground mb-1">
                    {getFullName()}
                  </h1>
                  <div className="flex flex-wrap items-center gap-3">
                    {profile?.location && (
                      <div className="flex items-center text-muted-foreground text-sm">
                        <MapPin className="h-4 w-4 mr-1 text-primary" />
                        <span>{profile.location}</span>
                      </div>
                    )}
                    <div className="text-sm text-muted-foreground">
                      Active since {profile?.created_at ? formatDistanceToNow(new Date(profile.created_at), { addSuffix: true }) : 'recently'}
                    </div>
                  </div>
                  {profile?.bio && (
                    <p className="text-sm text-muted-foreground mt-2 max-w-md">
                      {profile.bio.length > 100 ? `${profile.bio.substring(0, 100)}...` : profile.bio}
                    </p>
                  )}
                </div>
                {/* Action Button */}
                <div className="flex-shrink-0">
                  {isOwnProfile ? (
                    <Button 
                      onClick={onEdit} 
                      variant="outline"
                      size="sm"
                      className="border-muted-foreground/20 hover:border-muted-foreground/40 transition-all duration-300"
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Profile
                    </Button>
                  ) : (
                    <Button 
                      variant="outline"
                      size="sm"
                      className="border-muted-foreground/20 hover:border-muted-foreground/40 transition-all duration-300"
                    >
                      <Mail className="h-4 w-4 mr-2" />
                      Connect
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact form for non-own profiles */}
      {!isOwnProfile && (
        <Card className="mb-8">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="contact" className="border-none">
              <AccordionTrigger className="px-6 py-4 hover:no-underline">
                <div className="flex items-center gap-2 text-lg font-semibold">
                  <Mail className="h-5 w-5" />
                  Contact {getFullName()}
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-6">
                <div className="flex justify-center">
                  <PublicContactForm 
                    profileUserId={profile.id}
                    profileUserName={getFullName()}
                  />
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </Card>
      )}

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
        {/* Bio Section */}
        <Card className="group relative overflow-hidden border-0 bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-all duration-300 hover:shadow-xl hover:shadow-black/5 col-span-1 md:col-span-2 xl:col-span-2">
          <div 
            className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity duration-300"
            style={{ background: `linear-gradient(135deg, hsl(var(--primary)) 0%, transparent 100%)` }}
          />
          <CardHeader className="pb-4 relative">
            <div className="flex items-center gap-3">
              <div 
                className="p-2 rounded-lg"
                style={{ backgroundColor: `hsl(var(--primary) / 0.1)` }}
              >
                <User 
                  className="h-5 w-5" 
                  style={{ color: `hsl(var(--primary))` }}
                />
              </div>
              <CardTitle className="text-lg font-semibold">Bio</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="relative">
            {profile?.bio ? (
              <p className="text-foreground/90 leading-relaxed">{profile.bio}</p>
            ) : (
              <p className="text-muted-foreground italic">No bio provided yet - add your story!</p>
            )}
          </CardContent>
        </Card>

        {/* Activity/Stats Dashboard Card */}
        <Card className="group relative overflow-hidden border-0 bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-all duration-300 hover:shadow-xl hover:shadow-black/5">
          <div 
            className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity duration-300"
            style={{ background: `linear-gradient(135deg, hsl(var(--primary)) 0%, transparent 100%)` }}
          />
          <CardHeader className="pb-4 relative">
            <div className="flex items-center gap-3">
              <div 
                className="p-2 rounded-lg"
                style={{ backgroundColor: `hsl(var(--primary) / 0.1)` }}
              >
                <BarChart2 
                  className="h-5 w-5" 
                  style={{ color: `hsl(var(--primary))` }}
                />
              </div>
              <CardTitle className="text-lg font-semibold">Activity & Stats</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="relative">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold mb-1">{stats?.totalArticles ?? 0}</div>
                <div className="text-xs text-muted-foreground">Articles</div>
              </div>
              <div>
                <div className="text-2xl font-bold mb-1">{stats?.totalViews ?? 0}</div>
                <div className="text-xs text-muted-foreground">Views</div>
              </div>
              <div>
                <div className="text-2xl font-bold mb-1">{stats?.totalComments ?? 0}</div>
                <div className="text-xs text-muted-foreground">Comments</div>
              </div>
              <div>
                <div className="text-2xl font-bold mb-1">{stats?.totalVotes ?? 0}</div>
                <div className="text-xs text-muted-foreground">Votes</div>
              </div>
              <div>
                <div className="text-2xl font-bold mb-1">{stats?.savedArticlesCount ?? 0}</div>
                <div className="text-xs text-muted-foreground">Saved</div>
              </div>
              <div>
                <div className="text-2xl font-bold mb-1">{stats?.recentArticlesCount ?? 0}</div>
                <div className="text-xs text-muted-foreground">Recent</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Interests Section */}
      {profile?.interests && Array.isArray(profile.interests) && profile.interests.length > 0 && (
        <Card className="group relative overflow-hidden border-0 bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-all duration-300 hover:shadow-xl hover:shadow-black/5 mb-8">
          <div 
            className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity duration-300"
            style={{ background: `linear-gradient(135deg, hsl(var(--primary)) 0%, transparent 100%)` }}
          />
          <CardHeader className="relative">
            <div className="flex items-center gap-3">
              <div 
                className="p-2 rounded-lg"
                style={{ backgroundColor: `hsl(var(--primary) / 0.1)` }}
              >
                <Globe 
                  className="h-5 w-5" 
                  style={{ color: `hsl(var(--primary))` }}
                />
              </div>
              <CardTitle className="text-lg font-semibold">Interests</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="relative">
            <div className="flex flex-wrap gap-3">
              {profile.interests.map((interest: string, idx: number) => (
                <Badge 
                  key={idx} 
                  variant="secondary" 
                  className="px-4 py-2 text-sm font-medium hover:scale-105 transition-transform cursor-pointer bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 hover:border-primary/40"
                >
                  #{interest}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Communities Section */}
      <Card className="group relative overflow-hidden border-0 bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-all duration-300 hover:shadow-xl hover:shadow-black/5 mb-8">
        <div 
          className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity duration-300"
          style={{ background: `linear-gradient(135deg, hsl(var(--primary)) 0%, transparent 100%)` }}
        />
        <CardHeader className="relative">
          <div className="flex items-center gap-3">
            <div 
              className="p-2 rounded-lg"
              style={{ backgroundColor: `hsl(var(--primary) / 0.1)` }}
            >
              <Users 
                className="h-5 w-5" 
                style={{ color: `hsl(var(--primary))` }}
              />
            </div>
            <CardTitle className="text-lg font-semibold">Communities</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="relative">
          <div className="flex flex-wrap gap-3">
            {communities.length > 0 ? (
              communities.map((community, idx) => (
                <Badge key={idx} variant="secondary" className="px-4 py-2 text-sm font-medium">
                  {community.name}
                </Badge>
              ))
            ) : (
              <span className="text-muted-foreground text-sm italic">No communities found.</span>
            )}
          </div>
        </CardContent>
      </Card>

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
