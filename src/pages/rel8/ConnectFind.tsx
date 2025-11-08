import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Search, MapPin, Briefcase, Users, Loader2 } from "lucide-react";
import { Rel8OnlyNavigation } from "@/components/rel8t/Rel8OnlyNavigation";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/contexts/UserContext";

interface UserProfile {
  id: string;
  user_id: string;
  full_name: string;
  first_name: string;
  last_name: string;
  bio: string;
  location: string;
  avatar_url: string;
  skills: string[];
  interests: string[];
  role: string;
}

const ConnectFind = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { currentUser } = useUser();
  const [searchQuery, setSearchQuery] = useState("");
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [filteredProfiles, setFilteredProfiles] = useState<UserProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadProfiles();
  }, []);

  useEffect(() => {
    filterProfiles();
  }, [searchQuery, profiles]);

  const loadProfiles = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .neq("user_id", currentUser?.id || "") // Exclude current user
        .order("created_at", { ascending: false });

      if (error) throw error;

      setProfiles(data as UserProfile[]);
      setFilteredProfiles(data as UserProfile[]);
    } catch (error) {
      console.error("Error loading profiles:", error);
      toast({
        title: "Error",
        description: "Failed to load user profiles",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filterProfiles = () => {
    if (!searchQuery.trim()) {
      setFilteredProfiles(profiles);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = profiles.filter(profile => {
      const fullName = `${profile.first_name} ${profile.last_name}`.toLowerCase();
      const skills = profile.skills?.join(" ").toLowerCase() || "";
      const interests = profile.interests?.join(" ").toLowerCase() || "";
      const location = profile.location?.toLowerCase() || "";
      const bio = profile.bio?.toLowerCase() || "";

      return (
        fullName.includes(query) ||
        skills.includes(query) ||
        interests.includes(query) ||
        location.includes(query) ||
        bio.includes(query)
      );
    });

    setFilteredProfiles(filtered);
  };

  const handleViewProfile = (userId: string) => {
    navigate(`/profile/${userId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
      <Navbar />
      
      <div className="container mx-auto max-w-6xl px-4 py-8">
        <Rel8OnlyNavigation />
        
        <div className="flex items-center justify-between mb-6 mt-6">
          <div className="flex items-center gap-3">
            <Users className="h-7 w-7 text-primary" />
            <div>
              <h1 className="text-2xl font-bold">Find People</h1>
              <p className="text-sm text-muted-foreground">
                Discover and connect with other users on the platform
              </p>
            </div>
          </div>
          <Button variant="outline" onClick={() => navigate('/rel8/connect')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Connect
          </Button>
        </div>

        {/* Search Bar */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search by name, skills, interests, or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : filteredProfiles.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No profiles found</h3>
              <p className="text-muted-foreground">
                {searchQuery
                  ? "Try adjusting your search terms"
                  : "No user profiles available yet"}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredProfiles.map((profile) => (
              <Card
                key={profile.id}
                className="cursor-pointer hover:border-primary transition-all duration-200 hover:shadow-lg"
                onClick={() => handleViewProfile(profile.user_id)}
              >
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={profile.avatar_url} alt={profile.full_name} />
                      <AvatarFallback className="text-lg">
                        {profile.first_name?.[0]}{profile.last_name?.[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-lg mb-1 truncate">
                        {profile.full_name || `${profile.first_name} ${profile.last_name}`}
                      </CardTitle>
                      {profile.role && (
                        <Badge variant="secondary" className="mb-2">
                          {profile.role}
                        </Badge>
                      )}
                      {profile.location && (
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <MapPin className="h-3 w-3" />
                          {profile.location}
                        </div>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {profile.bio && (
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {profile.bio}
                    </p>
                  )}
                  
                  {profile.skills && profile.skills.length > 0 && (
                    <div className="mb-3">
                      <div className="flex items-center gap-1 text-xs font-semibold mb-2">
                        <Briefcase className="h-3 w-3" />
                        Skills
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {profile.skills.slice(0, 3).map((skill, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                        {profile.skills.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{profile.skills.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}

                  {profile.interests && profile.interests.length > 0 && (
                    <div>
                      <div className="text-xs font-semibold mb-2">Interests</div>
                      <div className="flex flex-wrap gap-1">
                        {profile.interests.slice(0, 3).map((interest, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {interest}
                          </Badge>
                        ))}
                        {profile.interests.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{profile.interests.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ConnectFind;
