
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSession } from '@/hooks/useSession';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Building2, Search, Plus, FolderOpen } from 'lucide-react';
import { Input } from '@/components/ui/input';
import Navbar from '@/components/Navbar';
import { ModernHeader } from '@/components/modul8/ModernHeader';
import { getServiceProviders } from '@/services/modul8Service';
import { toast } from '@/hooks/use-toast';

const Modul8Partners = () => {
  const { session } = useSession();
  const navigate = useNavigate();
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadProviders();
  }, []);

  const loadProviders = async () => {
    try {
      const data = await getServiceProviders();
      setProviders(data || []);
    } catch (error) {
      console.error('Error loading providers:', error);
      toast({
        title: "Error",
        description: "Failed to load partners",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredProviders = providers.filter(provider =>
    provider.business_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    provider.expertise_areas?.some((area: string) => 
      area.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#00eada]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Modern Header */}
      <ModernHeader
        title="Partner Management"
        subtitle="Partnership Hub"
        description="Manage your network of trusted service providers and discover new collaboration opportunities"
        primaryAction={{
          label: "Browse Domains",
          onClick: () => navigate('/modul8'),
          icon: Building2
        }}
        secondaryAction={{
          label: "View Projects",
          onClick: () => navigate('/modul8/projects'),
          icon: FolderOpen
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 sm:pb-16 lg:pb-20">
        {/* Search Section */}
        <div className="mb-8 sm:mb-12">
          <div className="relative max-w-lg mx-auto sm:mx-0">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search partners by name or expertise..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 pr-4 py-3 text-base rounded-xl border-border/50 focus:border-primary/50 transition-colors duration-300"
            />
          </div>
        </div>

        {/* Partners Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredProviders.length === 0 ? (
            <div className="col-span-full text-center py-16 sm:py-20 lg:py-24">
              <Users className="h-16 w-16 sm:h-20 sm:w-20 text-muted-foreground mx-auto mb-6" />
              <h3 className="text-xl sm:text-2xl font-semibold text-foreground mb-4">
                {searchTerm ? 'No Partners Found' : 'No Partners Yet'}
              </h3>
              <p className="text-base sm:text-lg text-muted-foreground mb-8 max-w-md mx-auto">
                {searchTerm 
                  ? 'Try adjusting your search terms or browse service domains to find partners'
                  : 'Start building your network by engaging with service providers in our domains'
                }
              </p>
              <Button
                onClick={() => navigate('/modul8')}
                size="lg"
                className="bg-gradient-to-r from-[#00eada] to-[#00b8a8] hover:from-[#00b8a8] hover:to-[#008f82] text-white font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
              >
                Browse Service Domains
              </Button>
            </div>
          ) : (
            filteredProviders.map((provider) => (
              <Card 
                key={provider.id}
                className="group hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 cursor-pointer border-border/50 hover:border-primary/30 bg-gradient-to-br from-card/90 to-card/60 backdrop-blur-sm"
                onClick={() => navigate(`/modul8/provider/${provider.id}`)}
              >
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 group-hover:from-primary/30 group-hover:to-primary/20 flex items-center justify-center transition-all duration-300">
                      <Building2 className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-lg font-bold group-hover:text-primary transition-colors duration-300">
                      {provider.business_name}
                    </CardTitle>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {provider.expertise_areas && provider.expertise_areas.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {provider.expertise_areas.slice(0, 3).map((area: string, index: number) => (
                        <span
                          key={index}
                          className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-md font-medium"
                        >
                          {area}
                        </span>
                      ))}
                      {provider.expertise_areas.length > 3 && (
                        <span className="text-xs text-muted-foreground">
                          +{provider.expertise_areas.length - 3} more
                        </span>
                      )}
                    </div>
                  )}
                  
                  {provider.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2 group-hover:text-foreground/80 transition-colors duration-300">
                      {provider.description}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Modul8Partners;
