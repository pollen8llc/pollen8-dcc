import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Edit, MapPin, Globe, User, Users, AlertCircle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Community, UserRole } from "@/models/types";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

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

  useEffect(() => {
    const fetchUserCommunities = async () => {
      if (!profile?.id) {
        setError("Cannot fetch communities: Profile ID is missing");
        return;
      }
      
      setIsLoading(true);
      setError(null);
      
      try {
        // Get communities where the user is the owner
        const { data, error } = await supabase
          .from('communities')
          .select('*')
          .eq('owner_id', profile.id);
          
        if (error) {
          console.error("Error fetching communities:", error);
          setError("Failed to load communities");
          return;
        }
        
        // Map the fetched data to match the Community type expected by the state
        if (data) {
          const mappedCommunities: Community[] = data.map(comm => {
            // Properly handle social_media to ensure it's a Record type
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
              // Adding additional fields from DB to match Community type
              type: comm.type,
              format: comm.format,
              target_audience: comm.target_audience || [],
              social_media: typeSafeSocialMedia, // Use our properly typed social_media
              website: comm.website || '',
              newsletter_url: comm.newsletter_url,
              logo_url: comm.logo_url,
              founder_name: comm.founder_name,
              // Aliases for backward compatibility
              createdAt: comm.created_at,
              updatedAt: comm.updated_at,
              targetAudience: comm.target_audience || [],
              socialMedia: typeSafeSocialMedia, // Also update the alias
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
    <div className="w-full space-y-8">
      {/* Hero Profile Section */}
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Avatar and Basic Info */}
        <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
          <div className={isAdmin ? 'admin-avatar-border rounded-full p-1' : ''}>
            <Avatar className="h-32 w-32 lg:h-40 lg:w-40">
              <AvatarImage src={profile?.avatar_url || ""} alt={getFullName()} />
              <AvatarFallback className="text-2xl lg:text-3xl">{getInitials()}</AvatarFallback>
            </Avatar>
          </div>
          <div className="mt-4">
            <h1 className="text-3xl lg:text-4xl font-bold">{getFullName()}</h1>
            {profile?.location && (
              <div className="flex items-center justify-center lg:justify-start text-muted-foreground mt-2">
                <MapPin className="h-4 w-4 mr-1" />
                <span>{profile.location}</span>
              </div>
            )}
            <p className="text-sm text-muted-foreground mt-2">
              Member since {profile?.created_at ? formatDistanceToNow(new Date(profile.created_at), { addSuffix: true }) : 'recently'}
            </p>
          </div>
        </div>

        {/* Main Profile Content */}
        <div className="flex-1 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* About Section */}
            <Card>
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
            <Card>
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

          {/* Social Links */}
          <Card className="mt-6">
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
                <p className="text-muted-foreground italic">No social links added</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <Separator className="my-8" />
      
      {/* Communities Section */}
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
