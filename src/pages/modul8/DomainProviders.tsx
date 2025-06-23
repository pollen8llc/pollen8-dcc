
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSession } from '@/hooks/useSession';
import { getUserOrganizer, getServiceProvidersByDomain, createEngagement } from '@/services/modul8Service';
import { DOMAIN_PAGES } from '@/types/modul8';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Building2, Star, Search, Filter, ArrowLeft } from 'lucide-react';
import { Organizer, ServiceProvider } from '@/types/modul8';
import { toast } from '@/hooks/use-toast';

const DomainProviders = () => {
  const { domainId } = useParams<{ domainId: string }>();
  const { session } = useSession();
  const navigate = useNavigate();
  const [organizer, setOrganizer] = useState<Organizer | null>(null);
  const [serviceProviders, setServiceProviders] = useState<ServiceProvider[]>([]);
  const [filteredProviders, setFilteredProviders] = useState<ServiceProvider[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [priceFilter, setPriceFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  const domainPage = DOMAIN_PAGES.find(p => p.id === parseInt(domainId || '0'));

  useEffect(() => {
    loadData();
  }, [domainId, session?.user?.id]);

  useEffect(() => {
    filterAndSortProviders();
  }, [serviceProviders, searchQuery, priceFilter, sortBy]);

  const loadData = async () => {
    if (!session?.user?.id || !domainId) return;
    
    try {
      const organizerData = await getUserOrganizer(session.user.id);
      if (!organizerData) {
        navigate('/modul8/setup/organizer');
        return;
      }
      
      setOrganizer(organizerData);
      const providers = await getServiceProvidersByDomain(parseInt(domainId));
      setServiceProviders(providers);
    } catch (error) {
      console.error('Error loading data:', error);
      toast({
        title: "Error",
        description: "Failed to load providers",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortProviders = () => {
    let filtered = [...serviceProviders];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(provider =>
        provider.business_name?.toLowerCase().includes(query) ||
        provider.tagline?.toLowerCase().includes(query) ||
        provider.description?.toLowerCase().includes(query) ||
        provider.tags?.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Price filter
    if (priceFilter !== 'all') {
      filtered = filtered.filter(provider => {
        const pricing = provider.pricing_range;
        if (!pricing || typeof pricing !== 'object') return priceFilter === 'contact';
        
        const { min, max } = pricing;
        switch (priceFilter) {
          case 'low':
            return max && max <= 5000;
          case 'medium':
            return min && min <= 15000 && (!max || max > 5000);
          case 'high':
            return min && min > 15000;
          case 'contact':
            return !min && !max;
          default:
            return true;
        }
      });
    }

    // Sort
    switch (sortBy) {
      case 'name':
        filtered.sort((a, b) => (a.business_name || '').localeCompare(b.business_name || ''));
        break;
      case 'price-low':
        filtered.sort((a, b) => {
          const aMin = a.pricing_range?.min || 0;
          const bMin = b.pricing_range?.min || 0;
          return aMin - bMin;
        });
        break;
      case 'price-high':
        filtered.sort((a, b) => {
          const aMin = a.pricing_range?.min || 0;
          const bMin = b.pricing_range?.min || 0;
          return bMin - aMin;
        });
        break;
      default: // newest
        filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }

    setFilteredProviders(filtered);
  };

  const handleEngageProvider = async (providerId: string) => {
    if (!organizer) return;
    
    try {
      await createEngagement({
        organizer_id: organizer.id,
        service_provider_id: providerId,
        engagement_type: 'engage'
      });
      
      navigate(`/modul8/request/new?domain=${domainId}&provider=${providerId}`);
    } catch (error) {
      console.error('Error tracking engagement:', error);
      navigate(`/modul8/request/new?domain=${domainId}&provider=${providerId}`);
    }
  };

  const formatPricing = (pricing: any) => {
    if (!pricing || typeof pricing !== 'object') return 'Contact for pricing';
    const { min, max, currency = 'USD' } = pricing;
    if (min && max) {
      return `${currency} ${min.toLocaleString()} - ${max.toLocaleString()}`;
    } else if (min) {
      return `From ${currency} ${min.toLocaleString()}`;
    } else if (max) {
      return `Up to ${currency} ${max.toLocaleString()}`;
    }
    return 'Contact for pricing';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#00eada]"></div>
      </div>
    );
  }

  if (!domainPage) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Domain Not Found</h1>
            <Button onClick={() => navigate('/modul8')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Modul8
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/modul8')}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Modul8
          </Button>
          
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold mb-2">{domainPage.title}</h1>
              <p className="text-muted-foreground mb-4">{domainPage.description}</p>
              <div className="text-sm text-muted-foreground">
                {filteredProviders.length} of {serviceProviders.length} providers
              </div>
            </div>
            <Button 
              onClick={() => navigate(`/modul8/request/new?domain=${domainId}`)}
              className="flex items-center gap-2 bg-[#00eada] hover:bg-[#00eada]/90 text-black"
            >
              <Plus className="h-4 w-4" />
              Request Service
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search providers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={priceFilter} onValueChange={setPriceFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Price Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Prices</SelectItem>
                  <SelectItem value="low">Under $5K</SelectItem>
                  <SelectItem value="medium">$5K - $15K</SelectItem>
                  <SelectItem value="high">Over $15K</SelectItem>
                  <SelectItem value="contact">Contact for Price</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue placeholder="Sort By" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="name">Name A-Z</SelectItem>
                  <SelectItem value="price-low">Price Low to High</SelectItem>
                  <SelectItem value="price-high">Price High to Low</SelectItem>
                </SelectContent>
              </Select>
              
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery('');
                  setPriceFilter('all');
                  setSortBy('newest');
                }}
                className="flex items-center gap-2"
              >
                <Filter className="h-4 w-4" />
                Clear Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Providers Grid */}
        {filteredProviders.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Building2 className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold text-muted-foreground mb-2">
                {searchQuery || priceFilter !== 'all' ? 'No providers match your filters' : 'No providers available'}
              </h3>
              <p className="text-muted-foreground text-center mb-4">
                {searchQuery || priceFilter !== 'all' 
                  ? 'Try adjusting your search or filters'
                  : `Service providers specializing in ${domainPage.title.toLowerCase()} will appear here`
                }
              </p>
              {(searchQuery || priceFilter !== 'all') && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchQuery('');
                    setPriceFilter('all');
                    setSortBy('newest');
                  }}
                >
                  Clear Filters
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProviders.map((provider) => (
              <Card key={provider.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h4 className="font-semibold text-lg mb-1">{provider.business_name}</h4>
                      {provider.tagline && (
                        <p className="text-sm text-muted-foreground mb-2">{provider.tagline}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Star className="h-3 w-3 fill-current" />
                      --
                    </div>
                  </div>
                  
                  {provider.description && (
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {provider.description}
                    </p>
                  )}
                  
                  {provider.tags && provider.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {provider.tags.slice(0, 3).map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {provider.tags.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{provider.tags.length - 3}
                        </Badge>
                      )}
                    </div>
                  )}
                  
                  <div className="text-sm text-muted-foreground mb-4">
                    {formatPricing(provider.pricing_range)}
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => {/* View profile functionality */}}
                    >
                      View Profile
                    </Button>
                    <Button 
                      size="sm" 
                      className="flex-1 bg-[#00eada] hover:bg-[#00eada]/90 text-black"
                      onClick={() => handleEngageProvider(provider.id)}
                    >
                      Engage
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DomainProviders;
