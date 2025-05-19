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
      <Card className="max-w-3xl mx-auto">
        <CardContent className="pt-6">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>Profile data could not be loaded</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-3xl mx-auto">
      <CardHeader className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4">
        <div className="flex items-center gap-4">
          <div className={isAdmin ? 'admin-avatar-border rounded-full' : ''}>
            <Avatar className="h-20 w-20">
              <AvatarImage src={profile?.avatar_url || ""} alt={getFullName()} />
              <AvatarFallback>{getInitials()}</AvatarFallback>
            </Avatar>
          </div>
          <div>
            <CardTitle className="text-2xl">{getFullName()}</CardTitle>
            {profile?.location && (
              <div className="flex items-center text-muted-foreground mt-1">
                <MapPin className="h-4 w-4 mr-1" />
                <span>{profile.location}</span>
              </div>
            )}
            <p className="text-sm text-muted-foreground mt-1">
              Member since {profile?.created_at ? formatDistanceToNow(new Date(profile.created_at), { addSuffix: true }) : 'recently'}
            </p>
          </div>
        </div>

        {isOwnProfile && (
          <Button variant="outline" onClick={onEdit} className="flex items-center gap-2">
            <Edit className="h-4 w-4" />
            Edit Profile
          </Button>
        )}
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Bio Section */}
        <section>
          <h3 className="font-medium text-lg mb-2">About</h3>
          {profile?.bio ? (
            <p className="text-muted-foreground">{profile.bio}</p>
          ) : (
            <p className="text-muted-foreground italic">No bio provided</p>
          )}
        </section>
        
        <Separator />
        
        {/* Interests Section */}
        <section>
          <h3 className="font-medium text-lg mb-2">Interests</h3>
          {profile?.interests && Array.isArray(profile.interests) && profile.interests.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {profile.interests.map((interest: string, idx: number) => (
                <Badge key={idx} variant="secondary">{interest}</Badge>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground italic">No interests listed</p>
          )}
        </section>
        
        <Separator />
        
        {/* Social Links Section */}
        <section>
          <h3 className="font-medium text-lg mb-2">Social Links</h3>
          {profile?.social_links && typeof profile.social_links === 'object' && 
           Object.keys(profile.social_links).length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {Object.entries(profile.social_links).map(([platform, url]) => (
                <a 
                  key={platform}
                  href={typeof url === 'string' && url.startsWith('http') ? url : `https://${url}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-primary hover:underline"
                >
                  <Globe className="h-4 w-4" />
                  <span className="capitalize">{platform}</span>
                </a>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground italic">No social links added</p>
          )}
        </section>
        
        <Separator />
        
        {/* Communities Section */}
        <section>
          <h3 className="font-medium text-lg mb-2 flex items-center gap-2">
            <Users className="h-5 w-5" />
            Communities
          </h3>
          
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {isLoading ? (
            <div className="flex justify-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : communities.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
              {communities.map((community) => (
                <Card key={community.id} className="overflow-hidden">
                  <div className="p-4">
                    <div className="flex items-start gap-3">
                      {community.logo_url ? (
                        <img 
                          src={community.logo_url} 
                          alt={community.name}
                          className="w-10 h-10 rounded-md object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-md bg-muted flex items-center justify-center">
                          <Users className="h-5 w-5 text-muted-foreground" />
                        </div>
                      )}
                      <div>
                        <h4 className="font-medium text-base line-clamp-1">{community.name}</h4>
                        <p className="text-xs text-muted-foreground mt-1">
                          {community.member_count || '1'} {parseInt(community.member_count || '1') === 1 ? 'member' : 'members'}
                        </p>
                      </div>
                    </div>
                    {community.description && (
                      <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                        {community.description}
                      </p>
                    )}
                    <Button 
                      variant="link" 
                      size="sm" 
                      className="mt-2 px-0"
                      onClick={() => window.location.href = `/community/${community.id}`}
                    >
                      View Community
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="bg-muted rounded-md p-4 text-center">
              <p className="text-muted-foreground mb-2">Not a member of any communities yet</p>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => window.location.href = "/communities/join"}
              >
                Explore Communities
              </Button>
            </div>
          )}
        </section>
      </CardContent>
    </Card>
  );
};

export default ProfileView;
