
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ArrowLeft, Building, Star, MapPin, ExternalLink } from 'lucide-react';

interface Provider {
  id: string;
  businessName: string;
  tagline: string;
  description: string;
  logoUrl?: string;
  location: string;
  rating: number;
  reviewCount: number;
  tags: string[];
  portfolioLinks: string[];
  isAffiliated: boolean;
  isActive: boolean;
}

// Mock data - in real implementation, this would come from Supabase
const mockProviders: Provider[] = [
  {
    id: '1',
    businessName: 'Creative Impact Studios',
    tagline: 'Transforming communities through strategic design',
    description: 'Full-service creative agency specializing in nonprofit branding, event marketing, and community engagement campaigns.',
    logoUrl: null,
    location: 'San Francisco, CA',
    rating: 4.8,
    reviewCount: 23,
    tags: ['Branding', 'Event Marketing', 'Social Impact'],
    portfolioLinks: ['https://example.com'],
    isAffiliated: true,
    isActive: false
  },
  {
    id: '2',
    businessName: 'Tech for Good Solutions',
    tagline: 'Building digital tools that matter',
    description: 'Specialized in developing web platforms, mobile apps, and CRM systems for nonprofits and community organizations.',
    logoUrl: null,
    location: 'Portland, OR',
    rating: 4.9,
    reviewCount: 31,
    tags: ['Web Development', 'Mobile Apps', 'CRM'],
    portfolioLinks: ['https://example.com'],
    isAffiliated: false,
    isActive: true
  }
];

const ProviderDirectory = () => {
  const { currentUser } = useUser();
  const navigate = useNavigate();
  const [selectedDomain, setSelectedDomain] = useState<any>(null);
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);

  useEffect(() => {
    // Retrieve selected domain from sessionStorage
    const storedDomain = sessionStorage.getItem('selectedDomain');
    if (storedDomain) {
      setSelectedDomain(JSON.parse(storedDomain));
    }
  }, []);

  const handleBack = () => {
    navigate('/modul8');
  };

  const handleEngageProvider = (provider: Provider) => {
    setSelectedProvider(provider);
    // Store selected provider for request form
    sessionStorage.setItem('selectedProvider', JSON.stringify(provider));
    navigate('/modul8/request');
  };

  const allProviders = mockProviders;
  const activeProviders = mockProviders.filter(p => p.isActive);
  const affiliatedProviders = mockProviders.filter(p => p.isAffiliated);

  const ProviderCard = ({ provider }: { provider: Provider }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={provider.logoUrl} />
              <AvatarFallback>
                <Building className="h-6 w-6" />
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold">{provider.businessName}</h3>
              <p className="text-sm text-muted-foreground">{provider.tagline}</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium">{provider.rating}</span>
            <span className="text-sm text-muted-foreground">({provider.reviewCount})</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
          {provider.description}
        </p>
        
        <div className="flex items-center gap-2 mb-3">
          <MapPin className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">{provider.location}</span>
        </div>

        <div className="flex flex-wrap gap-1 mb-4">
          {provider.tags.slice(0, 3).map((tag, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>

        <div className="flex gap-2">
          <Button 
            onClick={() => handleEngageProvider(provider)}
            className="flex-1"
          >
            Engage
          </Button>
          <Button variant="outline" size="icon">
            <ExternalLink className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={handleBack}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Domains
          </Button>
          
          <div>
            <h1 className="text-3xl font-bold">
              {selectedDomain?.title || 'Service Providers'}
            </h1>
            <p className="text-muted-foreground mt-2">
              {selectedDomain?.description || 'Browse available service providers'}
            </p>
          </div>
        </div>

        {/* Provider Tabs */}
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">All ({allProviders.length})</TabsTrigger>
            <TabsTrigger value="active">Active ({activeProviders.length})</TabsTrigger>
            <TabsTrigger value="affiliated">Affiliated ({affiliatedProviders.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {allProviders.map((provider) => (
                <ProviderCard key={provider.id} provider={provider} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="active" className="mt-6">
            {activeProviders.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {activeProviders.map((provider) => (
                  <ProviderCard key={provider.id} provider={provider} />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Building className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold text-muted-foreground mb-2">
                    No Active Providers
                  </h3>
                  <p className="text-muted-foreground text-center">
                    Providers you're currently working with will appear here
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="affiliated" className="mt-6">
            {affiliatedProviders.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {affiliatedProviders.map((provider) => (
                  <ProviderCard key={provider.id} provider={provider} />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Building className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold text-muted-foreground mb-2">
                    No Affiliated Providers
                  </h3>
                  <p className="text-muted-foreground text-center">
                    Providers you've worked with before will appear here
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ProviderDirectory;
