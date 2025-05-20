
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/contexts/UserContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, UserSearch, MapPin } from "lucide-react";
import { ExtendedProfile } from "@/services/profileService";
import { useDebounce } from "@/hooks/useDebounce";
import ProfileSearchList from "@/components/profile/ProfileSearchList";
import { Shell } from "@/components/layout/Shell";
import { UserRole } from "@/models/types";

const ProfileSearchPage: React.FC = () => {
  const { currentUser } = useUser();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [interestFilter, setInterestFilter] = useState<string[]>([]);
  const [profiles, setProfiles] = useState<ExtendedProfile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [allInterests, setAllInterests] = useState<string[]>([]);
  const [selectedInterest, setSelectedInterest] = useState<string>("");
  
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  // Redirect if user is not authenticated
  useEffect(() => {
    if (!currentUser) {
      navigate("/auth?redirectTo=/profiles/search");
    }
  }, [currentUser, navigate]);

  // Fetch all unique interests for the filter
  useEffect(() => {
    const fetchInterests = async () => {
      try {
        setError(null);
        
        // Fetch all profiles to extract unique interests directly
        const { data, error } = await supabase
          .from('profiles')
          .select('interests');
          
        if (error) {
          console.error("Error fetching interests:", error);
          return;
        }
        
        if (data) {
          // Process the result to get unique interests
          let allInterestsSet = new Set<string>();
          
          // Each item in data has an interests array
          data.forEach((profile) => {
            if (profile.interests && Array.isArray(profile.interests)) {
              profile.interests.forEach((interest: string) => {
                if (interest) allInterestsSet.add(interest);
              });
            }
          });
          
          // Convert Set to array of unique interests
          const uniqueInterests = Array.from(allInterestsSet);
          setAllInterests(uniqueInterests);
        }
      } catch (error) {
        console.error("Error in fetchInterests:", error);
        setError("Failed to load interests");
      }
    };
    
    fetchInterests();
  }, []);

  // Search profiles with role information - using an approach similar to the admin panel
  useEffect(() => {
    const searchProfiles = async () => {
      if (!currentUser) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        // First, get profiles based on search criteria
        let query = supabase
          .from('profiles')
          .select('*');
        
        // Add search filter if provided
        if (debouncedSearchQuery) {
          query = query.or(
            `first_name.ilike.%${debouncedSearchQuery}%,last_name.ilike.%${debouncedSearchQuery}%,bio.ilike.%${debouncedSearchQuery}%`
          );
        }
        
        // Add location filter if provided
        if (locationFilter) {
          query = query.ilike('location', `%${locationFilter}%`);
        }
        
        // Add interest filter if provided
        if (interestFilter.length > 0) {
          // We'll need overlap operator for array contains
          query = query.overlaps('interests', interestFilter);
        }
        
        // Execute the query
        const { data: profilesData, error: profilesError } = await query;
        
        if (profilesError) {
          console.error("Error searching profiles:", profilesError);
          setError("Search failed: " + profilesError.message);
          return;
        }

        // Process the profile results
        const profilesWithProcessedData = profilesData.map(profile => ({
          ...profile,
          social_links: profile.social_links ? 
            (typeof profile.social_links === 'string' ? 
              JSON.parse(profile.social_links) : profile.social_links) : {},
          privacy_settings: profile.privacy_settings ? 
            (typeof profile.privacy_settings === 'string' ? 
              JSON.parse(profile.privacy_settings) : profile.privacy_settings) : { 
                profile_visibility: "connections" 
              }
        }));
        
        // Efficiently fetch roles in a single query (similar to admin panel approach)
        // Get all user IDs from profiles
        const userIds = profilesWithProcessedData.map(profile => profile.id);
        
        // Get all roles for these users in a single query
        const { data: rolesData, error: rolesError } = await supabase
          .from('user_roles')
          .select(`
            user_id,
            roles:role_id (
              name
            )
          `)
          .in('user_id', userIds);
          
        if (rolesError) {
          console.error("Error fetching user roles:", rolesError);
          // Continue with profiles but without roles
        }
        
        // Create a map of user_id to role name (taking the highest role for each user)
        const userRoleMap = new Map<string, UserRole>();
        
        if (rolesData) {
          // Process all roles
          rolesData.forEach(roleItem => {
            const userId = roleItem.user_id;
            const roleName = roleItem.roles?.name;
            
            if (userId && roleName) {
              // Determine the highest role (ADMIN > ORGANIZER > MEMBER > GUEST)
              let role: UserRole | undefined;
              
              // Map the role string to UserRole enum
              if (roleName === 'ADMIN') {
                role = UserRole.ADMIN;
              } else if (roleName === 'ORGANIZER') {
                role = UserRole.ORGANIZER;
              } else if (roleName === 'MEMBER') {
                role = UserRole.MEMBER;
              } else if (roleName === 'GUEST') {
                role = UserRole.GUEST;
              }
              
              // If this role is defined and higher than any existing role for this user
              if (role !== undefined) {
                const existingRole = userRoleMap.get(userId);
                if (existingRole === undefined || role < existingRole) {
                  // In the enum, lower values = higher roles (ADMIN = 0, GUEST = 3)
                  userRoleMap.set(userId, role);
                }
              }
            }
          });
        }
        
        // Merge role data with profile data
        const profilesWithRoles = profilesWithProcessedData.map(profile => {
          // Get the role from the map or default to MEMBER
          const role = userRoleMap.get(profile.id) ?? UserRole.MEMBER;
          
          return {
            ...profile,
            role,
            // Get the string representation for logging
            roleString: UserRole[role]
          };
        });
        
        console.log('Profiles with roles:', profilesWithRoles.map(p => ({ 
          id: p.id, 
          name: `${p.first_name} ${p.last_name}`, 
          role: p.role,
          roleString: p.roleString
        })));
        
        setProfiles(profilesWithRoles);
      } catch (error) {
        console.error("Error in searchProfiles:", error);
        setError("An unexpected error occurred while searching profiles");
      } finally {
        setIsLoading(false);
      }
    };
    
    searchProfiles();
  }, [currentUser, debouncedSearchQuery, locationFilter, interestFilter, toast]);

  // Handle adding an interest filter
  const handleAddInterestFilter = () => {
    if (!selectedInterest) return;
    
    if (!interestFilter.includes(selectedInterest)) {
      setInterestFilter([...interestFilter, selectedInterest]);
    }
    
    setSelectedInterest("");
  };

  // Handle removing an interest filter
  const handleRemoveInterestFilter = (interest: string) => {
    setInterestFilter(interestFilter.filter(i => i !== interest));
  };

  return (
    <Shell fullWidth className="bg-background/60 backdrop-blur-sm">
      <div className="max-w-screen-2xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold flex items-center justify-center gap-2 mb-2">
            <UserSearch className="h-6 w-6" />
            Find People
          </h1>
          <p className="text-muted-foreground">
            Search for people by name, location, or interests
          </p>
        </div>
        
        <div className="flex flex-col xl:flex-row gap-8">
          {/* Search filters sidebar */}
          <Card className="xl:w-80 w-full h-fit sticky top-20 border-border/40 bg-card/60 backdrop-blur-sm transition-all duration-300 hover:border-[#00eada]/20">
            <CardContent className="p-6">
              <h3 className="font-medium text-lg mb-4">Filters</h3>
              
              <div className="space-y-6">
                {/* Search input */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Name or Bio</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      placeholder="Search..."
                      className="pl-10"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
                
                {/* Location filter */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Location</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      placeholder="Filter by location..."
                      className="pl-10"
                      value={locationFilter}
                      onChange={(e) => setLocationFilter(e.target.value)}
                    />
                  </div>
                </div>
                
                {/* Interest filter */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Interests</label>
                  <div className="flex gap-2">
                    <Select
                      value={selectedInterest}
                      onValueChange={setSelectedInterest}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select interest..." />
                      </SelectTrigger>
                      <SelectContent>
                        {allInterests.map((interest) => (
                          <SelectItem key={interest} value={interest}>
                            {interest}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    
                    <Button 
                      variant="outline" 
                      onClick={handleAddInterestFilter}
                      disabled={!selectedInterest}
                      size="icon"
                    >
                      +
                    </Button>
                  </div>
                </div>
                
                {/* Active filters */}
                {interestFilter.length > 0 && (
                  <div>
                    <label className="text-sm font-medium mb-2 block">Active Filters</label>
                    <div className="flex flex-wrap gap-2">
                      {interestFilter.map((interest) => (
                        <Badge key={interest} variant="secondary" className="px-3 py-1">
                          {interest}
                          <button
                            type="button"
                            onClick={() => handleRemoveInterestFilter(interest)}
                            className="ml-2 text-muted-foreground hover:text-foreground transition-colors"
                          >
                            <span>×</span>
                          </button>
                        </Badge>
                      ))}
                      
                      {interestFilter.length > 0 && (
                        <Button 
                          variant="link" 
                          onClick={() => setInterestFilter([])}
                          className="h-auto p-0 text-muted-foreground"
                        >
                          Clear all
                        </Button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          
          {/* Search results */}
          <div className="flex-1">
            <div className="mb-6">
              <Card className="border-border/40 bg-card/60 backdrop-blur-sm">
                <CardContent className="p-4 flex items-center justify-between">
                  <h2 className="text-lg font-medium">
                    {isLoading ? (
                      "Searching..."
                    ) : (
                      `Found ${profiles.length} ${profiles.length === 1 ? "person" : "people"}`
                    )}
                  </h2>
                  
                  <div className="flex items-center">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="text-sm"
                    >
                      Sort by: Recent
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <ProfileSearchList 
              profiles={profiles}
              isLoading={isLoading}
              error={error}
              emptyMessage="No profiles found. Try changing your search criteria or filters to find more people."
            />
          </div>
        </div>
      </div>
    </Shell>
  );
};

export default ProfileSearchPage;
