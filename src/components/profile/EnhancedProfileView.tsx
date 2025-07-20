
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
    <div className="w-full max-w-4xl mx-auto">
      {/* Profile Header - Responsive */}
      <div className="text-center mb-8">
        <div className="relative inline-block mb-4">
          <div className={isAdmin ? 'admin-avatar-border rounded-full p-1' : ''}>
            <Avatar className="h-24 w-24 md:h-32 md:w-32">
              <AvatarImage src={FIXED_AVATAR_URL} alt={getFullName()} />
              <AvatarFallback className="text-lg md:text-2xl">{getInitials()}</AvatarFallback>
            </Avatar>
          </div>
        </div>
        
        <h1 className="text-2xl md:text-3xl font-bold mb-2">{getFullName()}</h1>
        
        {/* Role Badge */}
        <div className="flex justify-center mb-2">
          {isOwnProfile ? (
            <Button
              variant="ghost"
              size="sm"
              className={`${roleBadge.color} text-primary-foreground hover:opacity-80`}
              onClick={() => setShowRoleDialog(true)}
            >
              {roleBadge.text}
              <Settings className="ml-2 h-3 w-3" />
            </Button>
          ) : (
            <Badge className={roleBadge.color}>
              {roleBadge.text}
            </Badge>
          )}
        </div>
        
        {profile?.location && (
          <div className="flex items-center justify-center text-muted-foreground mb-2">
            <MapPin className="h-4 w-4 mr-1" />
            <span>{profile.location}</span>
          </div>
        )}
        
        <p className="text-sm text-muted-foreground mb-4">
          Member since {profile?.created_at ? formatDistanceToNow(new Date(profile.created_at), { addSuffix: true }) : 'recently'}
        </p>

        {/* Action buttons */}
        <div className="flex justify-center gap-3 mb-6">
          {isOwnProfile && (
            <Button onClick={onEdit} className="flex items-center gap-2">
              <Edit className="h-4 w-4" />
              Edit Profile
            </Button>
          )}
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

      {/* Mobile: Stack vertically, Desktop: Side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* About Section */}
        <Card className="h-fit">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              About
            </CardTitle>
          </CardHeader>
          <CardContent>
            {profile?.bio ? (
              <p className="text-muted-foreground leading-relaxed">{profile.bio}</p>
            ) : (
              <p className="text-muted-foreground italic">No bio provided</p>
            )}
          </CardContent>
        </Card>

        {/* Interests Section */}
        <Card className="h-fit">
          <CardHeader>
            <CardTitle>Interests</CardTitle>
          </CardHeader>
          <CardContent>
            {profile?.interests && Array.isArray(profile.interests) && profile.interests.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {profile.interests.map((interest: string, idx: number) => (
                  <Badge key={idx} variant="secondary" className="text-sm">{interest}</Badge>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground italic">No interests listed</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Contact Info - Mobile friendly */}
      {(profile.email || profile.phone) && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {profile.email && (
                <div className="flex items-center text-sm">
                  <Mail className="h-4 w-4 mr-3 text-muted-foreground" />
                  <span>{profile.email}</span>
                </div>
              )}
              {profile.phone && (
                <div className="flex items-center text-sm">
                  <Phone className="h-4 w-4 mr-3 text-muted-foreground" />
                  <span>{profile.phone}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Social Links - Full width */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Social Links
          </CardTitle>
        </CardHeader>
        <CardContent>
          {profile?.social_links && typeof profile.social_links === 'object' && 
           Object.keys(profile.social_links).length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(profile.social_links).map(([platform, url]) => (
                <a 
                  key={platform}
                  href={typeof url === 'string' && url.startsWith('http') ? url : `https://${url}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-primary hover:underline p-3 border rounded-md hover:bg-muted/50 transition-colors"
                >
                  <ExternalLink className="h-4 w-4" />
                  <span className="capitalize font-medium">{platform}</span>
                </a>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground italic text-center py-4">No social links added</p>
          )}
        </CardContent>
      </Card>

      {/* Communities Section - Full width */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Users className="h-6 w-6" />
            Communities
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : communities.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {communities.map((community) => (
                <Card key={community.id} className="overflow-hidden hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      {community.logo_url ? (
                        <img 
                          src={community.logo_url} 
                          alt={community.name}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
                          <Users className="h-6 w-6 text-muted-foreground" />
                        </div>
                      )}
                      <div className="flex-1">
                        <h4 className="font-semibold text-lg line-clamp-1">{community.name}</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          {community.member_count || '1'} {parseInt(community.member_count || '1') === 1 ? 'member' : 'members'}
                        </p>
                        {community.description && (
                          <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                            {community.description}
                          </p>
                        )}
                        <Button 
                          variant="link" 
                          size="sm" 
                          className="mt-3 px-0 h-auto"
                          onClick={() => window.location.href = `/community/${community.id}`}
                        >
                          View Community →
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="bg-muted/50 rounded-lg p-8 text-center">
              <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-4 text-lg">Not a member of any communities yet</p>
              <Button 
                variant="outline"
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
