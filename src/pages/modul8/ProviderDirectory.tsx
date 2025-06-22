
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ServiceProvider } from '@/types/modul8';
import { getAllServiceProviders } from '@/services/modul8Service';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Building2, Search, User, ArrowLeft } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import Navbar from '@/components/Navbar';

const ProviderDirectory = () => {
  const navigate = useNavigate();
  const [providers, setProviders] = useState<ServiceProvider[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadProviders();
  }, []);

  const loadProviders = async () => {
    try {
      setLoading(true);
      const data = await getAllServiceProviders();
      setProviders(data || []);
    } catch (error) {
      console.error('Error loading providers:', error);
      toast({
        title: "Error",
        description: "Failed to load service providers",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredProviders = providers.filter(provider =>
    provider.business_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (provider.description && provider.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (provider.tags && provider.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())))
  );

  const handleProviderSelect = (provider: ServiceProvider) => {
    navigate(`/modul8/request?provider=${provider.id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#00eada]" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/modul8')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Service Provider Directory</h1>
            <p className="text-muted-foreground">Find and connect with registered service providers</p>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search providers by name, description, or tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Providers Grid */}
        {filteredProviders.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Service Providers Found</h3>
              <p className="text-muted-foreground">
                {searchQuery 
                  ? "No providers match your search criteria. Try adjusting your search terms."
                  : "No service providers are currently registered in the system."
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProviders.map((provider) => (
              <Card key={provider.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={provider.logo_url} />
                      <AvatarFallback>
                        <Building2 className="h-6 w-6" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <CardTitle className="text-lg">{provider.business_name}</CardTitle>
                      {provider.tagline && (
                        <p className="text-sm text-muted-foreground">{provider.tagline}</p>
                      )}
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {provider.description && (
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {provider.description}
                    </p>
                  )}
                  
                  {provider.tags && provider.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {provider.tags.slice(0, 3).map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {provider.tags.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{provider.tags.length - 3} more
                        </Badge>
                      )}
                    </div>
                  )}

                  {provider.pricing_range && (
                    <div className="text-sm">
                      <span className="font-medium">Starting from: </span>
                      <span className="text-muted-foreground">
                        ${provider.pricing_range.min?.toLocaleString()}/project
                      </span>
                    </div>
                  )}
                  
                  <Button 
                    onClick={() => handleProviderSelect(provider)}
                    className="w-full bg-[#00eada] hover:bg-[#00eada]/90 text-black"
                  >
                    Create Request
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Summary */}
        <div className="mt-8 text-center text-sm text-muted-foreground">
          Showing {filteredProviders.length} of {providers.length} registered service providers
        </div>
      </div>
    </div>
  );
};

export default ProviderDirectory;
