import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Navbar from '@/components/Navbar';
import { DotConnectorHeader } from '@/components/layout/DotConnectorHeader';
import { Search, Users, MapPin, Filter, ArrowLeft, MessageSquare, UserPlus } from 'lucide-react';
const SearchProfiles: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  // Mock profile data - this would come from your API
  const mockProfiles = [{
    id: '1',
    name: 'Sarah Johnson',
    role: 'Community Organizer',
    location: 'San Francisco, CA',
    bio: 'Passionate about tech communities and sustainable development.',
    avatar: null,
    interests: ['Technology', 'Sustainability', 'Community Building'],
    connectionStatus: 'not_connected'
  }, {
    id: '2',
    name: 'Marcus Chen',
    role: 'Event Coordinator',
    location: 'Austin, TX',
    bio: 'Organizing creative events and workshops for local artists.',
    avatar: null,
    interests: ['Arts', 'Events', 'Creative Communities'],
    connectionStatus: 'connected'
  }, {
    id: '3',
    name: 'Elena Rodriguez',
    role: 'Volunteer Manager',
    location: 'Denver, CO',
    bio: 'Managing volunteer programs for environmental conservation.',
    avatar: null,
    interests: ['Environment', 'Volunteering', 'Conservation'],
    connectionStatus: 'pending'
  }];
  const filteredProfiles = mockProfiles.filter(profile => {
    const matchesSearch = profile.name.toLowerCase().includes(searchQuery.toLowerCase()) || profile.bio.toLowerCase().includes(searchQuery.toLowerCase()) || profile.interests.some(interest => interest.toLowerCase().includes(searchQuery.toLowerCase()));
    if (selectedFilter === 'all') return matchesSearch;
    if (selectedFilter === 'organizers') return matchesSearch && profile.role.includes('Organizer');
    if (selectedFilter === 'volunteers') return matchesSearch && profile.role.includes('Volunteer');
    return matchesSearch;
  });
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };
  const getConnectionButton = (status: string, profileId: string) => {
    switch (status) {
      case 'connected':
        return <Button variant="outline" size="sm">
            <MessageSquare className="h-4 w-4 mr-2" />
            Message
          </Button>;
      case 'pending':
        return <Button variant="secondary" size="sm" disabled>
            Request Sent
          </Button>;
      default:
        return <Button size="sm">
            <UserPlus className="h-4 w-4 mr-2" />
            Connect
          </Button>;
    }
  };
  return <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
      <Navbar />
      <DotConnectorHeader />

      <div className="w-full px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          
          
          

          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search by name, interests, or bio..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-10" />
            </div>
            
            <div className="flex gap-2">
              <Button variant={selectedFilter === 'all' ? 'default' : 'outline'} size="sm" onClick={() => setSelectedFilter('all')}>
                All Profiles
              </Button>
              <Button variant={selectedFilter === 'organizers' ? 'default' : 'outline'} size="sm" onClick={() => setSelectedFilter('organizers')}>
                Organizers
              </Button>
              <Button variant={selectedFilter === 'volunteers' ? 'default' : 'outline'} size="sm" onClick={() => setSelectedFilter('volunteers')}>
                Volunteers
              </Button>
            </div>
          </div>

          {/* Results Count */}
          <p className="text-sm text-muted-foreground mb-6">
            {filteredProfiles.length} profile{filteredProfiles.length !== 1 ? 's' : ''} found
          </p>
        </div>

        {/* Profile Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProfiles.map(profile => <Card key={profile.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={profile.avatar || undefined} />
                    <AvatarFallback className="text-lg font-semibold">
                      {getInitials(profile.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <CardTitle className="text-lg">{profile.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{profile.role}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <MapPin className="h-3 w-3 text-muted-foreground" />
                      <p className="text-xs text-muted-foreground">{profile.location}</p>
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {profile.bio}
                </p>

                {/* Interests */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {profile.interests.slice(0, 3).map((interest, index) => <Badge key={index} variant="secondary" className="text-xs">
                      {interest}
                    </Badge>)}
                  {profile.interests.length > 3 && <Badge variant="outline" className="text-xs">
                      +{profile.interests.length - 3}
                    </Badge>}
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Link to={`/profile/${profile.id}`} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full">
                      View Profile
                    </Button>
                  </Link>
                  {getConnectionButton(profile.connectionStatus, profile.id)}
                </div>
              </CardContent>
            </Card>)}
        </div>

        {/* Empty State */}
        {filteredProfiles.length === 0 && <Card className="text-center py-12">
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
          </Card>}
      </div>
    </div>;
};
export default SearchProfiles;