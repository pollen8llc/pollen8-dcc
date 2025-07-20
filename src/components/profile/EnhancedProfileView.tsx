
import React, { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Edit, MapPin, Globe, User, Users, Mail, Phone, ExternalLink, Settings } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { UnifiedProfile } from "@/types/unifiedProfile";
import { UserRole } from "@/models/types";
import { usePermissions } from "@/hooks/usePermissions";
import { supabase } from "@/integrations/supabase/client";
import RoleChangeDialog from "./RoleChangeDialog";
import PublicContactForm from "./PublicContactForm";

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
      {/* Hero Section with Creative Agency Feel */}
      <div className="relative overflow-hidden rounded-3xl glass-card p-8 md:p-12 mb-8">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-accent/20"></div>
          <div className="absolute top-0 left-0 w-full h-full opacity-20">
            <div className="w-full h-full" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2300eada' fill-opacity='0.1'%3E%3Ccircle cx='7' cy='7' r='1'/%3E%3Ccircle cx='27' cy='7' r='1'/%3E%3Ccircle cx='47' cy='7' r='1'/%3E%3Ccircle cx='7' cy='27' r='1'/%3E%3Ccircle cx='27' cy='27' r='1'/%3E%3Ccircle cx='47' cy='27' r='1'/%3E%3Ccircle cx='7' cy='47' r='1'/%3E%3Ccircle cx='27' cy='47' r='1'/%3E%3Ccircle cx='47' cy='47' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
            }}></div>
          </div>
        </div>
        
        <div className="relative z-10 flex flex-col lg:flex-row items-center gap-8">
          {/* Avatar Section */}
          <div className="relative">
            <div className="relative">
              {isAdmin && (
                <div className="absolute -inset-2 rounded-full admin-avatar-border"></div>
              )}
              <Avatar className="h-32 w-32 lg:h-40 lg:w-40 ring-4 ring-primary/20 shadow-2xl">
                <AvatarImage src={FIXED_AVATAR_URL} alt={getFullName()} className="object-cover" />
                <AvatarFallback className="text-2xl lg:text-3xl font-bold bg-gradient-to-br from-primary/20 to-accent/20">
                  {getInitials()}
                </AvatarFallback>
              </Avatar>
              {/* Status Indicator */}
              <div className="absolute bottom-2 right-2 w-6 h-6 bg-primary rounded-full border-4 border-background animate-pulse"></div>
            </div>
          </div>
          
          {/* Profile Info */}
          <div className="flex-1 text-center lg:text-left">
            <div className="space-y-4">
              <div>
                <h1 className="text-3xl lg:text-5xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent mb-2">
                  {getFullName()}
                </h1>
                <div className="flex flex-wrap justify-center lg:justify-start gap-2 mb-3">
                  {isOwnProfile ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="bg-primary/20 text-primary hover:bg-primary/30 border border-primary/40 rounded-full px-4"
                      onClick={() => setShowRoleDialog(true)}
                    >
                      {roleBadge.text}
                      <Settings className="ml-2 h-3 w-3" />
                    </Button>
                  ) : (
                    <Badge variant="teal" className="rounded-full px-4 py-1 text-sm font-medium">
                      {roleBadge.text}
                    </Badge>
                  )}
                </div>
              </div>
              
              {profile?.location && (
                <div className="flex items-center justify-center lg:justify-start text-muted-foreground">
                  <MapPin className="h-5 w-5 mr-2 text-primary" />
                  <span className="text-lg">{profile.location}</span>
                </div>
              )}
              
              <p className="text-muted-foreground text-lg">
                Active since {profile?.created_at ? formatDistanceToNow(new Date(profile.created_at), { addSuffix: true }) : 'recently'}
              </p>
              
              {/* Quick Bio Preview */}
              {profile?.bio && (
                <p className="text-foreground/80 text-lg max-w-2xl leading-relaxed">
                  {profile.bio.length > 150 ? `${profile.bio.substring(0, 150)}...` : profile.bio}
                </p>
              )}
            </div>
            
            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 mt-6 justify-center lg:justify-start">
              {isOwnProfile ? (
                <Button 
                  onClick={onEdit} 
                  className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-primary/25 transition-all duration-300"
                >
                  <Edit className="h-5 w-5 mr-2" />
                  Edit Profile
                </Button>
              ) : (
                <Button 
                  className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-primary/25 transition-all duration-300"
                >
                  <Mail className="h-5 w-5 mr-2" />
                  Connect
                </Button>
              )}
              <Button 
                variant="outline" 
                className="border-primary/40 text-primary hover:bg-primary/10 px-6 py-3 rounded-xl font-semibold"
              >
                <ExternalLink className="h-5 w-5 mr-2" />
                Share Profile
              </Button>
            </div>
          </div>
        </div>
      </div>

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

      {/* Esports-Style Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* About/Bio Card */}
        <Card className="glass-card border-primary/20 col-span-1 md:col-span-2 lg:col-span-2">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="p-2 rounded-lg bg-primary/20">
                <User className="h-5 w-5 text-primary" />
              </div>
              About
            </CardTitle>
          </CardHeader>
          <CardContent>
            {profile?.bio ? (
              <p className="text-foreground/90 leading-relaxed text-lg">{profile.bio}</p>
            ) : (
              <p className="text-muted-foreground italic text-lg">No bio provided yet - add your story!</p>
            )}
          </CardContent>
        </Card>

        {/* Quick Stats Card */}
        <Card className="glass-card border-primary/20">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="p-2 rounded-lg bg-accent/20">
                <Users className="h-5 w-5 text-accent" />
              </div>
              Stats
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Communities</span>
              <span className="text-xl font-bold text-primary">{communities.length}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Connections</span>
              <span className="text-xl font-bold text-accent">-</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Projects</span>
              <span className="text-xl font-bold text-primary">-</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Skills/Interests Section with Gaming Feel */}
      {profile?.interests && Array.isArray(profile.interests) && profile.interests.length > 0 && (
        <Card className="glass-card border-accent/20 mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="p-2 rounded-lg bg-accent/20">
                <Globe className="h-5 w-5 text-accent" />
              </div>
              Skills & Interests
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              {profile.interests.map((interest: string, idx: number) => (
                <Badge 
                  key={idx} 
                  variant="tag" 
                  className="px-4 py-2 text-sm font-medium hover:scale-105 transition-transform cursor-pointer"
                >
                  #{interest.toLowerCase().replace(/\s+/g, '')}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Contact & Social Links Combined */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Contact Information */}
        {(profile.email || profile.phone) && (
          <Card className="glass-card border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-xl">
                <div className="p-2 rounded-lg bg-primary/20">
                  <Mail className="h-5 w-5 text-primary" />
                </div>
                Contact
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {profile.email && (
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/20 hover:bg-muted/30 transition-colors">
                  <Mail className="h-5 w-5 text-primary" />
                  <span className="text-foreground">{profile.email}</span>
                </div>
              )}
              {profile.phone && (
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/20 hover:bg-muted/30 transition-colors">
                  <Phone className="h-5 w-5 text-accent" />
                  <span className="text-foreground">{profile.phone}</span>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Social Links */}
        <Card className="glass-card border-accent/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="p-2 rounded-lg bg-accent/20">
                <Globe className="h-5 w-5 text-accent" />
              </div>
              Social Links
            </CardTitle>
          </CardHeader>
          <CardContent>
            {profile?.social_links && typeof profile.social_links === 'object' && 
             Object.keys(profile.social_links).length > 0 ? (
              <div className="space-y-3">
                {Object.entries(profile.social_links).map(([platform, url]) => (
                  <a 
                    key={platform}
                    href={typeof url === 'string' && url.startsWith('http') ? url : `https://${url}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 rounded-lg bg-muted/20 hover:bg-primary/20 hover:border-primary/40 transition-all duration-300 border border-transparent group"
                  >
                    <ExternalLink className="h-5 w-5 text-primary group-hover:text-accent transition-colors" />
                    <span className="capitalize font-medium text-foreground group-hover:text-primary transition-colors">{platform}</span>
                  </a>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Globe className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground italic">No social links added yet</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Communities/Teams Section with Gaming Aesthetic */}
      <Card className="glass-card border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-2xl">
            <div className="p-2 rounded-lg bg-primary/20">
              <Users className="h-6 w-6 text-primary" />
            </div>
            Teams & Communities
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : communities.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {communities.map((community) => (
                <Card key={community.id} className="glass-card border-accent/20 overflow-hidden hover:border-primary/40 hover:shadow-lg hover:shadow-primary/10 transition-all duration-300 group">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      {community.logo_url ? (
                        <div className="relative">
                          <img 
                            src={community.logo_url} 
                            alt={community.name}
                            className="w-14 h-14 rounded-xl object-cover ring-2 ring-primary/20 group-hover:ring-primary/40 transition-all"
                          />
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-primary rounded-full border-2 border-background"></div>
                        </div>
                      ) : (
                        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center ring-2 ring-primary/20 group-hover:ring-primary/40 transition-all">
                          <Users className="h-7 w-7 text-primary" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors truncate">
                          {community.name}
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="secondary" className="text-xs px-2 py-1">
                            {community.member_count || '1'} {parseInt(community.member_count || '1') === 1 ? 'member' : 'members'}
                          </Badge>
                        </div>
                        {community.description && (
                          <p className="text-sm text-muted-foreground mt-2 line-clamp-2 leading-relaxed">
                            {community.description}
                          </p>
                        )}
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="mt-3 px-0 h-auto text-primary hover:text-accent transition-colors font-semibold"
                          onClick={() => window.location.href = `/community/${community.id}`}
                        >
                          Enter Team →
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="relative inline-block mb-6">
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mx-auto">
                  <Users className="h-12 w-12 text-primary" />
                </div>
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-accent rounded-full border-4 border-background flex items-center justify-center">
                  <span className="text-accent-foreground text-xs font-bold">+</span>
                </div>
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">Ready to Join the Action?</h3>
              <p className="text-muted-foreground mb-6 text-lg max-w-md mx-auto">
                Connect with communities that match your interests and start building your network.
              </p>
              <Button 
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8 py-3 rounded-xl shadow-lg hover:shadow-primary/25 transition-all duration-300"
                onClick={() => window.location.href = "/communities/join"}
              >
                Explore Communities
              </Button>
            </div>
          )}
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
