import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Search, Users, Plus } from 'lucide-react';
import CommunityCard from '@/components/CommunityCard';
import Navbar from '@/components/Navbar';
import { useCommunities, Community } from '@/hooks/useCommunities';

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
  const { getAllCommunities } = useCommunities();
  const [communities, setCommunities] = useState<Community[]>([]);
  const [loading, setLoading] = useState(true);
  const [filteredCommunities, setFilteredCommunities] = useState<Community[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('All Types');
  const [statusFilter, setStatusFilter] = useState('All Statuses');

  useEffect(() => {
    const loadCommunities = async () => {
      try {
        setLoading(true);
        const result = await getAllCommunities(1, 100); // Load first 100 communities
        setCommunities(result.data);
      } catch (error) {
        console.error('Error loading communities:', error);
        setCommunities([]);
      } finally {
        setLoading(false);
      }
    };

    loadCommunities();
  }, [getAllCommunities]);

  useEffect(() => {
    try {
      let filtered = communities;

      // Apply search filter - search across name, description, and tags with null guards
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        filtered = filtered.filter(community => {
          const name = community.name || '';
          const description = community.description || '';
          const tags = Array.isArray(community.tags) ? community.tags : [];
          
          return name.toLowerCase().includes(query) ||
                 description.toLowerCase().includes(query) ||
                 tags.some(tag => (tag || '').toLowerCase().includes(query));
        });
      }

      // Apply type filter - handle both type and community_type fields
      if (typeFilter !== 'All Types') {
        const filterType = typeFilter.toLowerCase();
        filtered = filtered.filter(community => {
          const communityType = community.type || community.community_type || '';
          return communityType.toLowerCase() === filterType;
        });
      }

      setFilteredCommunities(filtered);
    } catch (error) {
      console.error('Error filtering communities:', error);
      setFilteredCommunities(communities); // Fallback to unfiltered
    }
  }, [communities, searchQuery, typeFilter, statusFilter]);

  const clearFilters = () => {
    setSearchQuery('');
    setTypeFilter('All Types');
    setStatusFilter('All Statuses');
  };

  const totalMembers = communities.reduce((sum, community) => {
    try {
      const sizeStr = community.community_size || community.member_count || '1';
      const memberCount = parseInt(sizeStr) || 1;
      return sum + memberCount;
    } catch {
      return sum + 1; // Fallback to 1 member if parsing fails
    }
  }, 0);

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
      
      <main className="w-full px-4 py-8">
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