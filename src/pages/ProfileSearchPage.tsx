
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from "@/components/Navbar";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/contexts/UserContext';
import { Search, User, MapPin } from 'lucide-react';

interface ProfileResult {
  id: string;
  first_name: string;
  last_name: string;
  avatar_url: string | null;
  location: string | null;
  interests: string[] | null;
  bio: string | null;
}

const ProfileSearchPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [interestFilter, setInterestFilter] = useState('');
  const [searchResults, setSearchResults] = useState<ProfileResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const { toast } = useToast();
  const { currentUser } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    // Load initial profiles on first load
    fetchProfiles();
    setIsInitialLoad(false);
  }, []);

  const fetchProfiles = async () => {
    if (!currentUser) return;
    
    setIsLoading(true);
    
    try {
      // Start with a base query
      let query = supabase
        .from('profiles')
        .select('id, first_name, last_name, avatar_url, location, interests, bio')
        .neq('id', currentUser.id); // Exclude current user
        
      // Add filters if provided
      if (searchQuery) {
        query = query.or(`first_name.ilike.%${searchQuery}%,last_name.ilike.%${searchQuery}%,bio.ilike.%${searchQuery}%`);
      }
      
      if (locationFilter) {
        query = query.ilike('location', `%${locationFilter}%`);
      }
      
      if (interestFilter) {
        // This is tricky with array fields, we'll use a filter on the result instead
      }
      
      // Fetch results
      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching profiles:', error);
        toast({
          title: 'Error',
          description: 'Failed to load profiles',
          variant: 'destructive'
        });
        return;
      }
      
      // Filter by interests if needed (client-side filter)
      let filteredResults = data || [];
      if (interestFilter && filteredResults.length > 0) {
        filteredResults = filteredResults.filter(profile => 
          profile.interests?.some((interest: string) => 
            interest.toLowerCase().includes(interestFilter.toLowerCase())
          )
        );
      }
      
      setSearchResults(filteredResults);
      
    } catch (error) {
      console.error('Error in profile search:', error);
      toast({
        title: 'Error',
        description: 'An unexpected error occurred',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchProfiles();
  };
  
  const getInitials = (profile: ProfileResult) => {
    if (!profile.first_name && !profile.last_name) return "??";
    
    return `${(profile.first_name || "")[0] || ""}${(profile.last_name || "")[0] || ""}`.toUpperCase();
  };
  
  const getFullName = (profile: ProfileResult) => {
    return [profile.first_name, profile.last_name].filter(Boolean).join(" ") || "Anonymous User";
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Find People</h1>
          
          <div className="bg-card rounded-lg shadow-sm p-6 mb-8">
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="searchQuery" className="text-sm font-medium block mb-1">
                    Name or Bio
                  </label>
                  <Input
                    id="searchQuery"
                    placeholder="Search by name or bio"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="locationFilter" className="text-sm font-medium block mb-1">
                    Location
                  </label>
                  <Input
                    id="locationFilter"
                    placeholder="Filter by location"
                    value={locationFilter}
                    onChange={(e) => setLocationFilter(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="interestFilter" className="text-sm font-medium block mb-1">
                    Interest
                  </label>
                  <Input
                    id="interestFilter"
                    placeholder="Filter by interest"
                    value={interestFilter}
                    onChange={(e) => setInterestFilter(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Searching...
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <Search className="mr-2 h-4 w-4" />
                      Search
                    </span>
                  )}
                </Button>
              </div>
            </form>
          </div>
          
          <div className="space-y-4">
            {searchResults.length === 0 && !isLoading && !isInitialLoad && (
              <div className="text-center py-8">
                <User className="mx-auto h-12 w-12 text-muted-foreground/60" />
                <h3 className="mt-4 text-lg font-medium">No profiles found</h3>
                <p className="text-muted-foreground">Try adjusting your search filters</p>
              </div>
            )}
            
            {searchResults.map(profile => (
              <Card 
                key={profile.id} 
                className="cursor-pointer hover:bg-accent/50 transition-colors"
                onClick={() => navigate(`/profile/${profile.id}`)}
              >
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={profile.avatar_url || ""} alt={getFullName(profile)} />
                      <AvatarFallback>{getInitials(profile)}</AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1">
                      <h3 className="font-medium">{getFullName(profile)}</h3>
                      {profile.location && (
                        <div className="flex items-center text-sm text-muted-foreground mt-1">
                          <MapPin className="h-3.5 w-3.5 mr-1" />
                          <span>{profile.location}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {profile.bio && (
                    <p className="text-muted-foreground text-sm mt-3 line-clamp-2">{profile.bio}</p>
                  )}
                  
                  {profile.interests && profile.interests.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1">
                      {profile.interests.slice(0, 4).map((interest, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">{interest}</Badge>
                      ))}
                      {profile.interests.length > 4 && (
                        <Badge variant="outline" className="text-xs">+{profile.interests.length - 4} more</Badge>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSearchPage;
