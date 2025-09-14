import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import { getUserServiceProvider, updateServiceProvider } from '@/services/modul8Service';
import { ServiceProvider } from '@/types/modul8';
import { DOMAIN_PAGES } from '@/types/modul8';
import { useToast } from '@/hooks/use-toast';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Building2, 
  Edit3, 
  Save, 
  X, 
  Plus,
  MapPin,
  Globe,
  Star,
  DollarSign,
  Calendar,
  ExternalLink
} from 'lucide-react';
import LoadingSpinner from '@/components/ui/loading-spinner';

const Labr8Profile = () => {
  const { currentUser } = useUser();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [serviceProvider, setServiceProvider] = useState<ServiceProvider | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    business_name: '',
    tagline: '',
    description: '',
    logo_url: '',
    services: [] as string[],
    tags: [] as string[],
    portfolio_links: [] as string[],
    domain_specializations: [] as number[],
    pricing_range: {
      min: undefined as number | undefined,
      max: undefined as number | undefined,
      currency: 'USD'
    }
  });

  // Input states for adding new items
  const [newService, setNewService] = useState('');
  const [newTag, setNewTag] = useState('');
  const [newPortfolioLink, setNewPortfolioLink] = useState('');

  useEffect(() => {
    loadServiceProvider();
  }, [currentUser?.id]);

  const loadServiceProvider = async () => {
    if (!currentUser?.id) return;

    try {
      setLoading(true);
      const provider = await getUserServiceProvider(currentUser.id);
      
      if (provider) {
        setServiceProvider(provider);
        setFormData({
          business_name: provider.business_name || '',
          tagline: provider.tagline || '',
          description: provider.description || '',
          logo_url: provider.logo_url || '',
          services: provider.services || [],
          tags: provider.tags || [],
          portfolio_links: provider.portfolio_links || [],
          domain_specializations: provider.domain_specializations || [],
          pricing_range: {
            min: provider.pricing_range?.min,
            max: provider.pricing_range?.max,
            currency: provider.pricing_range?.currency || 'USD'
          }
        });
      }
    } catch (error) {
      console.error('Error loading service provider:', error);
      toast({
        title: "Error",
        description: "Failed to load profile data.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!serviceProvider?.id) return;

    try {
      setSaving(true);
      
      await updateServiceProvider(serviceProvider.id, {
        business_name: formData.business_name,
        tagline: formData.tagline,
        description: formData.description,
        logo_url: formData.logo_url,
        services: formData.services,
        tags: formData.tags,
        portfolio_links: formData.portfolio_links,
        domain_specializations: formData.domain_specializations,
        pricing_range: formData.pricing_range
      });

      // Reload the data
      await loadServiceProvider();
      setEditing(false);

      toast({
        title: "Profile Updated",
        description: "Your LAB-R8 profile has been successfully updated.",
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (serviceProvider) {
      setFormData({
        business_name: serviceProvider.business_name || '',
        tagline: serviceProvider.tagline || '',
        description: serviceProvider.description || '',
        logo_url: serviceProvider.logo_url || '',
        services: serviceProvider.services || [],
        tags: serviceProvider.tags || [],
        portfolio_links: serviceProvider.portfolio_links || [],
        domain_specializations: serviceProvider.domain_specializations || [],
        pricing_range: {
          min: serviceProvider.pricing_range?.min,
          max: serviceProvider.pricing_range?.max,
          currency: serviceProvider.pricing_range?.currency || 'USD'
        }
      });
    }
    setEditing(false);
  };

  const addService = () => {
    if (newService.trim() && !formData.services.includes(newService.trim())) {
      setFormData(prev => ({
        ...prev,
        services: [...prev.services, newService.trim()]
      }));
      setNewService('');
    }
  };

  const removeService = (service: string) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.filter(s => s !== service)
    }));
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }));
  };

  const addPortfolioLink = () => {
    if (newPortfolioLink.trim() && !formData.portfolio_links.includes(newPortfolioLink.trim())) {
      setFormData(prev => ({
        ...prev,
        portfolio_links: [...prev.portfolio_links, newPortfolioLink.trim()]
      }));
      setNewPortfolioLink('');
    }
  };

  const removePortfolioLink = (link: string) => {
    setFormData(prev => ({
      ...prev,
      portfolio_links: prev.portfolio_links.filter(l => l !== link)
    }));
  };

  const toggleDomain = (domainId: number) => {
    setFormData(prev => ({
      ...prev,
      domain_specializations: prev.domain_specializations.includes(domainId)
        ? prev.domain_specializations.filter(id => id !== domainId)
        : [...prev.domain_specializations, domainId]
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center py-20">
          <LoadingSpinner size="lg" text="Loading profile..." />
        </div>
      </div>
    );
  }

  if (!serviceProvider) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <Card className="max-w-md mx-auto">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-[#00eada]">Profile Not Found</CardTitle>
              <CardDescription>
                No service provider profile found. Please complete your LAB-R8 setup first.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Button 
                onClick={() => navigate('/labr8/setup')}
                className="bg-[#00eada] hover:bg-[#00eada]/90 text-black"
              >
                Complete Setup
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={serviceProvider.logo_url} alt={serviceProvider.business_name} />
                <AvatarFallback className="bg-[#00eada] text-black text-lg font-bold">
                  {serviceProvider.business_name?.charAt(0) || 'SP'}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-3xl font-bold text-[#00eada]">
                  {serviceProvider.business_name || 'Service Provider Profile'}
                </h1>
                <p className="text-lg text-muted-foreground">
                  {serviceProvider.tagline || 'Professional Service Provider'}
                </p>
              </div>
            </div>
            
            <div className="flex gap-2">
              {editing ? (
                <>
                  <Button 
                    onClick={handleSave}
                    disabled={saving}
                    className="bg-[#00eada] hover:bg-[#00eada]/90 text-black"
                  >
                    {saving ? <LoadingSpinner size="sm" /> : <Save className="w-4 h-4" />}
                    {saving ? 'Saving...' : 'Save Changes'}
                  </Button>
                  <Button variant="outline" onClick={handleCancel}>
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                </>
              ) : (
                <Button onClick={() => setEditing(true)}>
                  <Edit3 className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
              )}
            </div>
          </div>

          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="services">Services</TabsTrigger>
              <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Basic Information */}
                <Card>
                  <CardHeader>
                    <CardTitle>Basic Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {editing ? (
                      <>
                        <div className="space-y-2">
                          <Label htmlFor="business_name">Business Name</Label>
                          <Input
                            id="business_name"
                            value={formData.business_name}
                            onChange={(e) => setFormData(prev => ({ ...prev, business_name: e.target.value }))}
                            placeholder="Enter business name"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="tagline">Tagline</Label>
                          <Input
                            id="tagline"
                            value={formData.tagline}
                            onChange={(e) => setFormData(prev => ({ ...prev, tagline: e.target.value }))}
                            placeholder="Brief description of what you do"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="description">Description</Label>
                          <Textarea
                            id="description"
                            value={formData.description}
                            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                            placeholder="Detailed description of your services"
                            rows={4}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="logo_url">Logo URL</Label>
                          <Input
                            id="logo_url"
                            value={formData.logo_url}
                            onChange={(e) => setFormData(prev => ({ ...prev, logo_url: e.target.value }))}
                            placeholder="https://example.com/logo.png"
                          />
                        </div>
                      </>
                    ) : (
                      <>
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">Business Name</Label>
                          <p className="text-lg">{serviceProvider.business_name || 'Not specified'}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">Tagline</Label>
                          <p>{serviceProvider.tagline || 'Not specified'}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">Description</Label>
                          <p className="whitespace-pre-wrap">{serviceProvider.description || 'No description available'}</p>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>

                {/* Stats & Metrics */}
                <Card>
                  <CardHeader>
                    <CardTitle>Performance Metrics</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-muted rounded-lg">
                        <div className="text-2xl font-bold text-[#00eada]">
                          {(serviceProvider as any).rating?.toFixed(1) || '0.0'}
                        </div>
                        <div className="text-sm text-muted-foreground flex items-center justify-center gap-1">
                          <Star className="w-4 h-4 fill-[#00eada] text-[#00eada]" />
                          Rating
                        </div>
                      </div>
                      <div className="text-center p-4 bg-muted rounded-lg">
                        <div className="text-2xl font-bold text-[#00eada]">
                          {(serviceProvider as any).total_projects || 0}
                        </div>
                        <div className="text-sm text-muted-foreground flex items-center justify-center gap-1">
                          <Building2 className="w-4 h-4" />
                          Projects
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-muted-foreground">Availability</Label>
                      <Badge variant={(serviceProvider as any).availability_status === 'available' ? 'default' : 'secondary'}>
                        {(serviceProvider as any).availability_status === 'available' ? 'Available' : 'Busy'}
                      </Badge>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-muted-foreground">Verification Status</Label>
                      <Badge variant={(serviceProvider as any).verification_status === 'verified' ? 'default' : 'secondary'}>
                        {(serviceProvider as any).verification_status === 'verified' ? 'Verified' : 'Pending'}
                      </Badge>
                    </div>

                    {serviceProvider.pricing_range && (
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-muted-foreground">Pricing Range</Label>
                        <div className="flex items-center gap-1">
                          <DollarSign className="w-4 h-4" />
                          <span>
                            {serviceProvider.pricing_range.min && serviceProvider.pricing_range.max
                              ? `$${serviceProvider.pricing_range.min.toLocaleString()} - $${serviceProvider.pricing_range.max.toLocaleString()}`
                              : serviceProvider.pricing_range.min
                              ? `From $${serviceProvider.pricing_range.min.toLocaleString()}`
                              : serviceProvider.pricing_range.max
                              ? `Up to $${serviceProvider.pricing_range.max.toLocaleString()}`
                              : 'Contact for pricing'
                            } {serviceProvider.pricing_range.currency || 'USD'}
                          </span>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Services Tab */}
            <TabsContent value="services" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Services */}
                <Card>
                  <CardHeader>
                    <CardTitle>Services Offered</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {editing && (
                      <div className="flex gap-2">
                        <Input
                          value={newService}
                          onChange={(e) => setNewService(e.target.value)}
                          placeholder="Add a service"
                          onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addService())}
                        />
                        <Button onClick={addService} size="sm">
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                    <div className="flex flex-wrap gap-2">
                      {formData.services.map((service) => (
                        <Badge key={service} variant="secondary" className="flex items-center gap-1">
                          {service}
                          {editing && (
                            <X className="w-3 h-3 cursor-pointer" onClick={() => removeService(service)} />
                          )}
                        </Badge>
                      ))}
                      {formData.services.length === 0 && (
                        <p className="text-muted-foreground">No services specified</p>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Tags */}
                <Card>
                  <CardHeader>
                    <CardTitle>Skills & Tags</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {editing && (
                      <div className="flex gap-2">
                        <Input
                          value={newTag}
                          onChange={(e) => setNewTag(e.target.value)}
                          placeholder="Add a tag"
                          onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                        />
                        <Button onClick={addTag} size="sm">
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                    <div className="flex flex-wrap gap-2">
                      {formData.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="flex items-center gap-1">
                          {tag}
                          {editing && (
                            <X className="w-3 h-3 cursor-pointer" onClick={() => removeTag(tag)} />
                          )}
                        </Badge>
                      ))}
                      {formData.tags.length === 0 && (
                        <p className="text-muted-foreground">No tags specified</p>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Domain Specializations */}
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle>Domain Specializations</CardTitle>
                    <CardDescription>
                      Select the domains where you have expertise
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {DOMAIN_PAGES.map((domain) => (
                        <div
                          key={domain.id}
                          className={`p-4 border rounded-lg transition-colors ${
                            editing ? 'cursor-pointer' : ''
                          } ${
                            formData.domain_specializations.includes(domain.id)
                              ? 'bg-[#00eada]/10 border-[#00eada]'
                              : 'border-border'
                          } ${
                            editing ? 'hover:border-[#00eada]/50' : ''
                          }`}
                          onClick={editing ? () => toggleDomain(domain.id) : undefined}
                        >
                          <h3 className="font-medium mb-1">{domain.title}</h3>
                          <p className="text-sm text-muted-foreground">{domain.description}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Portfolio Tab */}
            <TabsContent value="portfolio" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Portfolio Links</CardTitle>
                  <CardDescription>
                    Showcase your work with links to projects and examples
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {editing && (
                    <div className="flex gap-2">
                      <Input
                        value={newPortfolioLink}
                        onChange={(e) => setNewPortfolioLink(e.target.value)}
                        placeholder="https://example.com/portfolio"
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addPortfolioLink())}
                      />
                      <Button onClick={addPortfolioLink} size="sm">
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                  <div className="space-y-3">
                    {formData.portfolio_links.map((link, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                        <div className="flex items-center gap-2">
                          <Globe className="w-4 h-4" />
                          <a 
                            href={link} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-[#00eada] hover:underline flex items-center gap-1"
                          >
                            {link}
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                        {editing && (
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => removePortfolioLink(link)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                    {formData.portfolio_links.length === 0 && (
                      <p className="text-muted-foreground text-center py-8">
                        No portfolio links added yet
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Pricing Settings</CardTitle>
                  <CardDescription>
                    Configure your general pricing range
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {editing ? (
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="pricing_min">Minimum Price (USD)</Label>
                        <Input
                          id="pricing_min"
                          type="number"
                          value={formData.pricing_range.min || ''}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            pricing_range: {
                              ...prev.pricing_range,
                              min: e.target.value ? parseInt(e.target.value) : undefined
                            }
                          }))}
                          placeholder="1000"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="pricing_max">Maximum Price (USD)</Label>
                        <Input
                          id="pricing_max"
                          type="number"
                          value={formData.pricing_range.max || ''}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            pricing_range: {
                              ...prev.pricing_range,
                              max: e.target.value ? parseInt(e.target.value) : undefined
                            }
                          }))}
                          placeholder="10000"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-lg">
                      <DollarSign className="w-5 h-5" />
                      <span>
                        {serviceProvider.pricing_range?.min && serviceProvider.pricing_range?.max
                          ? `$${serviceProvider.pricing_range.min.toLocaleString()} - $${serviceProvider.pricing_range.max.toLocaleString()}`
                          : serviceProvider.pricing_range?.min
                          ? `From $${serviceProvider.pricing_range.min.toLocaleString()}`
                          : serviceProvider.pricing_range?.max
                          ? `Up to $${serviceProvider.pricing_range.max.toLocaleString()}`
                          : 'Contact for pricing'
                        } {serviceProvider.pricing_range?.currency || 'USD'}
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Account Actions</CardTitle>
                  <CardDescription>
                    Manage your LAB-R8 account settings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button 
                    variant="outline"
                    onClick={() => navigate('/labr8/setup')}
                    className="w-full"
                  >
                    <Edit3 className="w-4 h-4 mr-2" />
                    Re-run Setup Wizard
                  </Button>
                  
                  <Button 
                    variant="outline"
                    onClick={() => navigate('/labr8/dashboard')}
                    className="w-full"
                  >
                    <Building2 className="w-4 h-4 mr-2" />
                    Back to Dashboard
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Labr8Profile;