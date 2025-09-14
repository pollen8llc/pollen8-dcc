
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSession } from '@/hooks/useSession';
import { supabase } from '@/integrations/supabase/client';
import { createServiceProvider } from '@/services/modul8Service';
import { CreateServiceProviderData } from '@/types/modul8';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { X, Plus, MapPin } from 'lucide-react';
import { LocationSelector } from '@/components/ui/location-selector';
import Navbar from '@/components/Navbar';
import { toast } from '@/hooks/use-toast';

const ServiceProviderSetup = () => {
  const { session } = useSession();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    business_name: '',
    tagline: '',
    description: '',
    logo_url: '',
    location: '',
    services: [] as string[],
    tags: [] as string[],
    pricing_range: {
      min: '',
      max: '',
      currency: 'USD'
    },
    portfolio_links: [] as string[]
  });
  
  const [newService, setNewService] = useState('');
  const [newTag, setNewTag] = useState('');
  const [newPortfolioLink, setNewPortfolioLink] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user?.id) return;
    
    setLoading(true);
    try {
      const pricingRange = {
        min: formData.pricing_range.min ? parseFloat(formData.pricing_range.min) : undefined,
        max: formData.pricing_range.max ? parseFloat(formData.pricing_range.max) : undefined,
        currency: formData.pricing_range.currency
      };

      const createData: CreateServiceProviderData = {
        user_id: session.user.id,
        business_name: formData.business_name,
        tagline: formData.tagline || undefined,
        description: formData.description || undefined,
        logo_url: formData.logo_url || undefined,
        services: formData.services,
        tags: formData.tags,
        pricing_range: pricingRange,
        portfolio_links: formData.portfolio_links
      };

      await createServiceProvider(createData);
      
      // Mark MODUL8 setup as complete
      const { data: user } = await supabase.auth.getUser();
      if (user?.user?.id) {
        await supabase
          .from('profiles')
          .update({ modul8_setup_complete: true })
          .eq('user_id', user.user.id);
      }
      
      toast({
        title: "Success!",
        description: "Your service provider profile has been created."
      });
      
      navigate('/modul8/provider');
    } catch (error) {
      console.error('Error creating service provider profile:', error);
      toast({
        title: "Error",
        description: "Failed to create service provider profile",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
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

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
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

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">
              Set Up Your Service Provider Profile
            </h1>
            <p className="text-muted-foreground">
              Create your profile to start offering services to community organizers
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Business Details</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="business_name">Business Name *</Label>
                    <Input
                      id="business_name"
                      value={formData.business_name}
                      onChange={(e) => setFormData(prev => ({ ...prev, business_name: e.target.value }))}
                      placeholder="Your Business Name"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tagline">Tagline</Label>
                    <Input
                      id="tagline"
                      value={formData.tagline}
                      onChange={(e) => setFormData(prev => ({ ...prev, tagline: e.target.value }))}
                      placeholder="Brief tagline or slogan"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe your business and what you offer..."
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="logo_url">Logo URL</Label>
                  <Input
                    id="logo_url"
                    type="url"
                    value={formData.logo_url}
                    onChange={(e) => setFormData(prev => ({ ...prev, logo_url: e.target.value }))}
                    placeholder="https://example.com/logo.png"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Location</Label>
                  <LocationSelector
                    value={formData.location || ''}
                    onValueChange={(location) => setFormData(prev => ({ ...prev, location }))}
                    placeholder="Select business location"
                    allowCustomInput={true}
                    showHierarchy={true}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Services Offered</Label>
                  <div className="flex gap-2">
                    <Input
                      value={newService}
                      onChange={(e) => setNewService(e.target.value)}
                      placeholder="e.g., Website Development"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addService())}
                    />
                    <Button type="button" variant="outline" onClick={addService}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  {formData.services.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {formData.services.map((service) => (
                        <Badge key={service} variant="secondary" className="flex items-center gap-1">
                          {service}
                          <X 
                            className="h-3 w-3 cursor-pointer" 
                            onClick={() => setFormData(prev => ({
                              ...prev,
                              services: prev.services.filter(s => s !== service)
                            }))}
                          />
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Tags</Label>
                  <div className="flex gap-2">
                    <Input
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      placeholder="e.g., React, Design, Marketing"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                    />
                    <Button type="button" variant="outline" onClick={addTag}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  {formData.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {formData.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="flex items-center gap-1">
                          {tag}
                          <X 
                            className="h-3 w-3 cursor-pointer" 
                            onClick={() => setFormData(prev => ({
                              ...prev,
                              tags: prev.tags.filter(t => t !== tag)
                            }))}
                          />
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Pricing Range</Label>
                  <div className="grid grid-cols-3 gap-2">
                    <Input
                      type="number"
                      placeholder="Min"
                      value={formData.pricing_range.min}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        pricing_range: { ...prev.pricing_range, min: e.target.value }
                      }))}
                    />
                    <Input
                      type="number"
                      placeholder="Max"
                      value={formData.pricing_range.max}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        pricing_range: { ...prev.pricing_range, max: e.target.value }
                      }))}
                    />
                    <Input
                      value={formData.pricing_range.currency}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        pricing_range: { ...prev.pricing_range, currency: e.target.value }
                      }))}
                      placeholder="USD"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Portfolio Links</Label>
                  <div className="flex gap-2">
                    <Input
                      type="url"
                      value={newPortfolioLink}
                      onChange={(e) => setNewPortfolioLink(e.target.value)}
                      placeholder="https://example.com/portfolio"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addPortfolioLink())}
                    />
                    <Button type="button" variant="outline" onClick={addPortfolioLink}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  {formData.portfolio_links.length > 0 && (
                    <div className="space-y-2 mt-3">
                      {formData.portfolio_links.map((link, index) => (
                        <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                          <span className="flex-1 text-sm truncate">{link}</span>
                          <X 
                            className="h-4 w-4 cursor-pointer" 
                            onClick={() => setFormData(prev => ({
                              ...prev,
                              portfolio_links: prev.portfolio_links.filter((_, i) => i !== index)
                            }))}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex gap-4 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate('/')}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={loading || !formData.business_name.trim()}
                    className="flex-1"
                  >
                    {loading ? 'Creating...' : 'Create Profile'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ServiceProviderSetup;
