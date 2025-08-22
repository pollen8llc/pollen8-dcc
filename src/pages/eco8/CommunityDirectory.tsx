import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Search, Users, MapPin, TrendingUp, Plus } from 'lucide-react';
import { Community, COMMUNITY_TYPES, GROWTH_STATUS_COLORS } from '@/types/community';
import CommunityCard from '@/components/CommunityCard';

const CommunityDirectory: React.FC = () => {
  const [communities, setCommunities] = useState<Community[]>([]);
  const [filteredCommunities, setFilteredCommunities] = useState<Community[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Replace with Supabase query
    const loadCommunities = () => {
      try {
        const savedCommunities = JSON.parse(localStorage.getItem('communities') || '[]');
        
        // Add mock communities if none exist
        if (savedCommunities.length === 0) {
          const mockCommunities: Community[] = [
            {
              id: '1',
              name: 'SF Tech Innovators',
              description: 'Building the future of technology in San Francisco',
              bio: 'A vibrant community of tech entrepreneurs, developers, and innovators working to solve real-world problems through technology. We host monthly meetups, workshops, and networking events.',
              type: 'Technology',
              location: 'San Francisco, CA',
              memberCount: 156,
              growthStatus: 'growing',
              banner: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&h=320&fit=crop',
              logo: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=200&h=200&fit=crop',
              organizer: 'Sarah Chen',
              organizerPhoto: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
              organizerId: 'org1',
              tags: ['startup', 'AI', 'blockchain', 'mobile'],
              badges: ['Verified', 'Active'],
              isPublic: true,
              is_public: true,
              communitySize: '156',
              organizerIds: ['org1'],
              memberIds: Array.from({length: 156}, (_, i) => `member${i}`),
              website: 'https://sftech.community',
              email: 'hello@sftech.community',
              created_at: '2024-01-15T10:00:00Z',
              updated_at: '2024-01-20T15:30:00Z'
            },
            {
              id: '2',
              name: 'Green Living Collective',
              description: 'Sustainable living advocates making a positive impact',
              bio: 'Join us in creating a more sustainable world through practical actions, education, and community support. We organize clean-up events, workshops on sustainable living, and advocacy campaigns.',
              type: 'Environment & Sustainability',
              location: 'Portland, OR',
              memberCount: 89,
              growthStatus: 'recruiting',
              banner: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&h=320&fit=crop',
              logo: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=200&h=200&fit=crop',
              organizer: 'Marcus Johnson',
              organizerPhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
              organizerId: 'org2',
              tags: ['sustainability', 'environment', 'activism', 'community'],
              badges: ['Impact Driven'],
              isPublic: true,
              website: 'https://greenliving.org',
              created_at: '2024-01-10T08:00:00Z',
              updated_at: '2024-01-18T12:00:00Z'
            },
            {
              id: '3',
              name: 'NYC Creative Collective',
              description: 'Artists and creators shaping the cultural landscape',
              bio: 'A diverse community of artists, designers, musicians, and creative professionals collaborating to push the boundaries of art and culture in New York City.',
              type: 'Arts & Culture',
              location: 'New York, NY',
              memberCount: 234,
              growthStatus: 'active',
              banner: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800&h=320&fit=crop',
              logo: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=200&h=200&fit=crop',
              organizer: 'Elena Rodriguez',
              organizerPhoto: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
              organizerId: 'org3',
              tags: ['art', 'design', 'music', 'culture', 'collaboration'],
              badges: ['Creative Hub'],
              isPublic: true,
              email: 'info@nyccreative.com',
              created_at: '2024-01-05T16:00:00Z',
              updated_at: '2024-01-19T09:15:00Z'
            }
          ];
          
          localStorage.setItem('communities', JSON.stringify(mockCommunities));
          setCommunities(mockCommunities);
        } else {
          setCommunities(savedCommunities);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error loading communities:', error);
        setLoading(false);
      }
    };

    loadCommunities();
  }, []);

  useEffect(() => {
    let filtered = communities;

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(community =>
        community.name.toLowerCase().includes(query) ||
        community.description.toLowerCase().includes(query) ||
        community.type.toLowerCase().includes(query) ||
        community.organizer.toLowerCase().includes(query) ||
        community.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Apply type filter
    if (typeFilter !== 'all') {
      filtered = filtered.filter(community => community.type === typeFilter);
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(community => community.growthStatus === statusFilter);
    }

    setFilteredCommunities(filtered);
  }, [communities, searchQuery, typeFilter, statusFilter]);

  const totalMembers = communities.reduce((sum, community) => sum + community.memberCount, 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 text-white">Community Directory</h1>
          <p className="text-xl text-muted-foreground mb-8">
            Discover and connect with communities that share your interests
          </p>
          
          {/* Search and Filters */}
          <Card className="backdrop-blur-md bg-white/5 border border-white/10 mb-8">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search communities, organizers, or tags..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-full md:w-48">
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    {COMMUNITY_TYPES.map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full md:w-48">
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="growing">Growing</SelectItem>
                    <SelectItem value="recruiting">Recruiting</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="paused">Paused</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Stats */}
          <div className="flex justify-center items-center gap-8 mb-8 text-muted-foreground">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              <span>{filteredCommunities.length} communities found</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              <span>{totalMembers} total members</span>
            </div>
          </div>
        </div>

        {/* Communities Grid */}
        {filteredCommunities.length === 0 ? (
          <Card className="backdrop-blur-md bg-white/5 border border-white/10 text-center py-12">
            <CardContent>
              <Users className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">No communities found</h3>
              <p className="text-muted-foreground mb-6">
                Try adjusting your search criteria or explore different categories.
              </p>
              {searchQuery || typeFilter !== 'all' || statusFilter !== 'all' ? (
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSearchQuery('');
                    setTypeFilter('all');
                    setStatusFilter('all');
                  }}
                >
                  Clear Filters
                </Button>
              ) : (
                <Button asChild>
                  <Link to="/eco8/setup">
                    <Plus className="h-4 w-4 mr-2" />
                    Create First Community
                  </Link>
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCommunities.map(community => (
              <CommunityCard key={community.id} community={community} />
            ))}
          </div>
        )}

        {/* Create Community CTA */}
        <div className="text-center mt-12">
          <Button asChild size="lg">
            <Link to="/eco8/setup">
              <Plus className="h-5 w-5 mr-2" />
              Create Your Community
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CommunityDirectory;