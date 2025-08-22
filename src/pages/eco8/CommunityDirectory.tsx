import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Search, Users, Plus } from 'lucide-react';
import { Community } from '@/models/types';
import CommunityCard from '@/components/CommunityCard';
import Navbar from '@/components/Navbar';

const COMMUNITY_TYPES = [
  'All Types',
  'Technology',
  'Arts & Literature', 
  'Health & Fitness',
  'Business',
  'Sustainability',
  'Professional'
];

const GROWTH_STATUS = [
  'All Statuses',
  'Growing',
  'Recruiting', 
  'Active',
  'Paused'
];

const CommunityDirectory: React.FC = () => {
  const [communities, setCommunities] = useState<Community[]>([]);
  const [filteredCommunities, setFilteredCommunities] = useState<Community[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('All Types');
  const [statusFilter, setStatusFilter] = useState('All Statuses');
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
              is_public: true,
              created_at: '2024-01-10T10:00:00Z',
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
              is_public: true,
              created_at: '2024-01-05T08:00:00Z',
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
              is_public: true,
              created_at: '2024-01-01T16:00:00Z',
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

    // Apply search filter - search across name, description, and tags
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(community =>
        community.name.toLowerCase().includes(query) ||
        community.description.toLowerCase().includes(query) ||
        community.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    setFilteredCommunities(filtered);
  }, [communities, searchQuery, typeFilter, statusFilter]);

  const clearFilters = () => {
    setSearchQuery('');
    setTypeFilter('All Types');
    setStatusFilter('All Statuses');
  };

  const totalMembers = communities.reduce((sum, community) => sum + parseInt(community.communitySize), 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header Navigation & Page Hero Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Community Directory</h1>
          <p className="text-muted-foreground text-lg">
            Discover and connect with communities that share your interests
          </p>
        </div>

        {/* Search & Filter Bar */}
        <Card className="bg-card border rounded-2xl p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search communities, organizers, or topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-background"
              />
            </div>
            <div className="flex gap-3">
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Community Type" />
                </SelectTrigger>
                <SelectContent>
                  {COMMUNITY_TYPES.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Growth Status" />
                </SelectTrigger>
                <SelectContent>
                  {GROWTH_STATUS.map(status => (
                    <SelectItem key={status} value={status}>{status}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>

        {/* Results Summary */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Users className="h-5 w-5" />
            <span>{filteredCommunities.length} communities found</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Users className="h-5 w-5" />
            <span>{totalMembers} total members</span>
          </div>
        </div>

        {/* Community Grid - Responsive card layout */}
        {filteredCommunities.length === 0 ? (
          /* Empty State - Helpful fallback when no results */
          <Card className="bg-card text-center py-12">
            <CardContent>
              <Search className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2 text-foreground">No communities found</h3>
              <p className="text-muted-foreground mb-6">
                Try adjusting your search criteria or explore different categories.
              </p>
              <Button variant="outline" onClick={clearFilters}>
                Clear Filters
              </Button>
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
      </main>
    </div>
  );
};

export default CommunityDirectory;