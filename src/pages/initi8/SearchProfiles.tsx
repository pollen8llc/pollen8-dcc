import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Navbar from '@/components/Navbar';
import { DotConnectorHeader } from '@/components/layout/DotConnectorHeader';
import { Search, Users, MapPin, Loader2 } from 'lucide-react';
import { getAllProfiles, ExtendedProfile } from '@/services/profileService';
import { UserRole } from '@/models/types';

const SearchProfiles: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [profiles, setProfiles] = useState<ExtendedProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load profiles on component mount
  useEffect(() => {
    const loadProfiles = async () => {
      setIsLoading(true);
      try {
        const allProfiles = await getAllProfiles();
        setProfiles(allProfiles);
      } catch (error) {
        console.error('Failed to load profiles:', error);
        setProfiles([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadProfiles();
  }, []);

  // Filter profiles based on search query and selected filter
  const filteredProfiles = profiles.filter(profile => {
    const fullName = `${profile.first_name || ''} ${profile.last_name || ''}`.trim();
    const matchesSearch = fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (profile.bio?.toLowerCase().includes(searchQuery.toLowerCase())) ||
                         (profile.interests?.some(interest => 
                           interest.toLowerCase().includes(searchQuery.toLowerCase())
                         ));
    
    if (selectedFilter === 'all') return matchesSearch;
    if (selectedFilter === 'organizers') return matchesSearch && profile.role === UserRole.ORGANIZER;
    if (selectedFilter === 'volunteers') return matchesSearch && (profile.role === UserRole.MEMBER || !profile.role);
    
    return matchesSearch;
  });


  const getRoleName = (role?: UserRole) => {
    switch (role) {
      case UserRole.ORGANIZER:
        return 'Community Organizer';
      case UserRole.SERVICE_PROVIDER:
        return 'Service Provider';
      case UserRole.ADMIN:
        return 'Administrator';
      default:
        return 'Community Member';
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
      <Navbar />
      <DotConnectorHeader />

      <div className="w-full px-4 py-8">
        {/* Header */}
        <div className="mb-8">          
          <div className="flex items-center gap-3 mb-6">
            <Search className="h-8 w-8 text-primary" />
            <div>
              <p className="text-muted-foreground">Discover and connect with organizers, volunteers, and community leaders</p>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, interests, or bio..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex gap-2">
              <Button
                variant={selectedFilter === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedFilter('all')}
              >
                All Profiles
              </Button>
              <Button
                variant={selectedFilter === 'organizers' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedFilter('organizers')}
              >
                Organizers
              </Button>
              <Button
                variant={selectedFilter === 'volunteers' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedFilter('volunteers')}
              >
                Members
              </Button>
            </div>
          </div>

          {/* Results Count */}
          <p className="text-sm text-muted-foreground mb-6">
            {isLoading ? 'Loading...' : `${filteredProfiles.length} profile${filteredProfiles.length !== 1 ? 's' : ''} found`}
          </p>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}

        {/* Profile Grid */}
        {!isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredProfiles.map((profile) => {
              const fullName = `${profile.first_name || ''} ${profile.last_name || ''}`.trim();
              return (
                <Card 
                  key={profile.id} 
                  onClick={() => navigate(`/profile/${profile.user_id || profile.id}`)}
                  className="cursor-pointer hover:shadow-md transition-all bg-card/80 backdrop-blur-sm border-2 bg-gradient-to-br from-card/80 to-card/40 hover:border-primary/30 hover:shadow-primary/10 hover:shadow-2xl group relative overflow-hidden"
                >
                  {/* Gradient border effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-accent/20 to-secondary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg" />
                  
                  <CardContent className="p-5 relative z-10">
                    <div className="flex items-center">
                      <div className="bg-primary/10 rounded-full p-2 mr-3 group-hover:bg-primary/20 transition-colors">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback userId={profile.user_id || profile.id} />
                        </Avatar>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-lg truncate group-hover:text-primary transition-colors">{fullName}</h3>
                        <p className="text-muted-foreground text-sm">{getRoleName(profile.role)}</p>
                        {profile.location && (
                          <div className="flex items-center gap-1 mt-1">
                            <MapPin className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                            <p className="text-xs text-muted-foreground truncate">{profile.location}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && filteredProfiles.length === 0 && (
          <Card className="text-center py-12 bg-gradient-to-br from-card/60 to-card/30 backdrop-blur-sm border-dashed">
            <CardContent>
              <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
              <h3 className="text-lg font-semibold mb-2">No profiles found</h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your search terms or filters to find more profiles.
              </p>
              <Button onClick={() => {
                setSearchQuery('');
                setSelectedFilter('all');
              }}>
                Clear Filters
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default SearchProfiles;