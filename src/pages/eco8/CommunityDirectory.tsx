import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Search, Users, MapPin, TrendingUp, Plus } from 'lucide-react';
import { Community } from '@/data/types';
import CommunityCard from '@/components/CommunityCard';

const COMMUNITY_TYPES = [
  'Technology',
  'Arts & Culture', 
  'Health & Wellness',
  'Business',
  'Education',
  'Environment',
  'Social Impact',
  'Other'
];

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
          const mockCommunities = [
            {
              id: '1',
              name: 'SF Tech Innovators',
              description: 'Building the future of technology in San Francisco',
              location: 'San Francisco, CA',
              imageUrl: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=200&h=200&fit=crop',
              communitySize: '156',
              organizerIds: ['org1'],
              memberIds: Array.from({length: 156}, (_, i) => `member${i}`),
              tags: ['startup', 'AI', 'blockchain', 'mobile'],
              isPublic: true,
              updated_at: '2024-01-20T15:30:00Z'
            },
            {
              id: '2',
              name: 'Green Living Collective',
              description: 'Sustainable living advocates making a positive impact',
              location: 'Portland, OR',
              imageUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=200&h=200&fit=crop',
              communitySize: '89',
              organizerIds: ['org2'],
              memberIds: Array.from({length: 89}, (_, i) => `member${i}`),
              tags: ['sustainability', 'environment', 'activism', 'community'],
              isPublic: true,
              updated_at: '2024-01-18T12:00:00Z'
            },
            {
              id: '3',
              name: 'NYC Creative Collective',
              description: 'Artists and creators shaping the cultural landscape',
              location: 'New York, NY',
              imageUrl: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=200&h=200&fit=crop',
              communitySize: '234',
              organizerIds: ['org3'],
              memberIds: Array.from({length: 234}, (_, i) => `member${i}`),
              tags: ['art', 'design', 'music', 'culture', 'collaboration'],
              isPublic: true,
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
        community.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Note: Type and status filters removed since they don't exist in the old Community interface
    
    setFilteredCommunities(filtered);
  }, [communities, searchQuery, typeFilter, statusFilter]);

  const totalMembers = communities.reduce((sum, community) => sum + parseInt(community.communitySize), 0);

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
                    placeholder="Search communities or tags..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
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
              {searchQuery ? (
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSearchQuery('');
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