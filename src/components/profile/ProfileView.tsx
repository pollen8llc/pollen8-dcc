
import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Edit, MapPin, Globe, User, Users, AlertCircle, Mail, Phone } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Community, UserRole } from "@/models/types";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import PublicContactForm from "./PublicContactForm";

interface ProfileViewProps {
  profile: any;
  isOwnProfile: boolean;
  onEdit: () => void;
}

const ProfileView: React.FC<ProfileViewProps> = ({ profile, isOwnProfile, onEdit }) => {
  const [communities, setCommunities] = useState<Community[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Check if the user is an admin
  const isAdmin = profile?.role === UserRole.ADMIN;

  // Fixed avatar URL for all users
  const FIXED_AVATAR_URL = "https://www.pollen8.app/wp-content/uploads/2025/03/larissa-avatar.gif";

  useEffect(() => {
    const fetchUserCommunities = async () => {
      if (!profile?.id) {
        setError("Cannot fetch communities: Profile ID is missing");
        return;
      }
      
      setIsLoading(true);
      setError(null);
      
      try {
        const { data, error } = await supabase
          .from('communities')
          .select('*')
          .eq('owner_id', profile.id);
          
        if (error) {
          console.error("Error fetching communities:", error);
          setError("Failed to load communities");
          return;
        }
        
        if (data) {
          const mappedCommunities: Community[] = data.map(comm => {
            let typeSafeSocialMedia: Record<string, string | { url?: string }> = {};
            
            if (comm.social_media && typeof comm.social_media === 'object') {
              Object.keys(comm.social_media).forEach(key => {
                const value = comm.social_media[key];
                if (typeof value === 'string') {
                  typeSafeSocialMedia[key] = value;
                } else if (typeof value === 'object' && value !== null) {
                  typeSafeSocialMedia[key] = value;
                }
              });
            }
            
            return {
              id: comm.id,
              name: comm.name,
              description: comm.description || '',
              location: comm.location || '',
              imageUrl: comm.logo_url || '',
              communitySize: comm.community_size || '',
              organizerIds: [comm.owner_id || ''],
              memberIds: [],
              tags: comm.tags || [],
              isPublic: comm.is_public,
              created_at: comm.created_at,
              updated_at: comm.updated_at,
              is_public: comm.is_public,
              type: comm.type,
              format: comm.format,
              target_audience: comm.target_audience || [],
              social_media: typeSafeSocialMedia,
              website: comm.website || '',
              newsletter_url: comm.newsletter_url,
              logo_url: comm.logo_url,
              founder_name: comm.founder_name,
              createdAt: comm.created_at,
              updatedAt: comm.updated_at,
              targetAudience: comm.target_audience || [],
              socialMedia: typeSafeSocialMedia,
              newsletterUrl: comm.newsletter_url,
              communityType: comm.type || comm.community_type
            };
          });
          
          setCommunities(mappedCommunities);
        }
      } catch (error) {
        console.error("Error in fetchUserCommunities:", error);
        setError("An unexpected error occurred while loading communities");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUserCommunities();
  }, [profile?.id]);

  const getFullName = () => {
    if (!profile) return "Anonymous User";
    
    return [profile.first_name, profile.last_name]
      .filter(Boolean)
      .join(" ") || "Anonymous User";
  };

  const getInitials = () => {
    if (!profile) return "?";
    
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

  if (!profile) {
    return (
      <div className="w-full">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>Profile data could not be loaded</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Android-style symmetrical profile header */}
      <div className="text-center mb-8">
        <div className="relative inline-block mb-4">
          <div className={isAdmin ? 'admin-avatar-border rounded-full p-1' : ''}>
            <Avatar className="h-32 w-32">
              <AvatarImage src={FIXED_AVATAR_URL} alt={getFullName()} />
              <AvatarFallback className="text-2xl">{getInitials()}</AvatarFallback>
            </Avatar>
          </div>
        </div>
        
        <h1 className="text-3xl font-bold mb-2">{getFullName()}</h1>
        
        {profile?.location && (
          <div className="flex items-center justify-center text-muted-foreground mb-2">
            <MapPin className="h-4 w-4 mr-1" />
            <span>{profile.location}</span>
          </div>
        )}
        
        <p className="text-sm text-muted-foreground mb-4">
          Member since {profile?.created_at ? formatDistanceToNow(new Date(profile.created_at), { addSuffix: true }) : 'recently'}
        </p>

        {/* Action buttons - centered */}
        <div className="flex justify-center gap-3 mb-6">
          {isOwnProfile && (
            <Button onClick={onEdit} className="flex items-center gap-2">
              <Edit className="h-4 w-4" />
              Edit Profile
            </Button>
          )}
        </div>
      </div>

      {/* Contact form for non-own profiles - Full-width accordion */}
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

      {/* Symmetrical content grid */}
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
                  <Globe className="h-4 w-4" />
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
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
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
    </div>
  );
};

export default ProfileView;
