import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/contexts/UserContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, UserSearch, MapPin } from "lucide-react";
import { ExtendedProfile } from "@/services/profileService";
import { useDebounce } from "@/hooks/useDebounce";
import ProfileSearchList from "@/components/profile/ProfileSearchList";

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

  // Search profiles
  useEffect(() => {
    const searchProfiles = async () => {
      if (!currentUser) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
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
        const { data, error } = await query;
        
        if (error) {
          console.error("Error searching profiles:", error);
          setError("Search failed: " + error.message);
          return;
        }
        
        // Process the results
        const searchResults = data.map(profile => ({
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
        
        setProfiles(searchResults);
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
    <div className="min-h-screen">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold flex items-center justify-center gap-2 mb-2">
              <UserSearch className="h-6 w-6" />
              Find People
            </h1>
            <p className="text-muted-foreground">
              Search for people by name, location, or interests
            </p>
          </div>
          
          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Search input */}
                <div className="md:col-span-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      placeholder="Search by name or bio..."
                      className="pl-10"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
                
                {/* Location filter */}
                <div>
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
                <div className="md:col-span-2 flex gap-2">
                  <Select
                    value={selectedInterest}
                    onValueChange={setSelectedInterest}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by interest..." />
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
                  >
                    Add
                  </Button>
                </div>
                
                {/* Active filters */}
                {interestFilter.length > 0 && (
                  <div className="md:col-span-3 mt-2">
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
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">
                {isLoading ? (
                  "Searching..."
                ) : (
                  `Found ${profiles.length} ${profiles.length === 1 ? "person" : "people"}`
                )}
              </h2>
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
    </div>
  );
};

export default ProfileSearchPage;
