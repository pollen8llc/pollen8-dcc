
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSession } from '@/hooks/useSession';
import { createServiceProvider } from '@/services/modul8Service';
import { updateUserRole } from '@/services/roleService';
import { DOMAIN_PAGES } from '@/types/modul8';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { X, Plus, ArrowLeft } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { toast } from '@/hooks/use-toast';

const Labr8Setup = () => {
  const { session } = useSession();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    business_name: '',
    tagline: '',
    description: '',
    domain_specializations: [] as number[],
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
    
    if (formData.domain_specializations.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one domain specialization",
        variant: "destructive"
      });
      return;
    }
    
    setLoading(true);
    try {
      const pricingRange = {
        min: formData.pricing_range.min ? parseFloat(formData.pricing_range.min) : undefined,
        max: formData.pricing_range.max ? parseFloat(formData.pricing_range.max) : undefined,
        currency: formData.pricing_range.currency
      };

      await createServiceProvider({
        user_id: session.user.id,
        business_name: formData.business_name,
        tagline: formData.tagline || undefined,
        description: formData.description || undefined,
        services: formData.services,
        tags: formData.tags,
        pricing_range: pricingRange,
        portfolio_links: formData.portfolio_links,
        domain_specializations: formData.domain_specializations
      });

      // Update user role to SERVICE_PROVIDER
      await updateUserRole(session.user.id, 'SERVICE_PROVIDER');
      
      toast({
        title: "Success!",
        description: "Your LABR8 profile has been created successfully."
      });
      
      navigate('/labr8/dashboard');
    } catch (error) {
      console.error('Error creating service provider profile:', error);
      toast({
        title: "Error",
        description: "Failed to create your profile. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleDomain = (domainId: number) => {
    setFormData(prev => ({
      ...prev,
      domain_specializations: prev.domain_specializations.includes(domainId)
        ? prev.domain_specializations.filter(id => id !== domainId)
        : [...prev.domain_specializations, domainId]
    }));
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
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/labr8')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
          </div>

          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">
              Create Your LABR8 Profile
            </h1>
            <p className="text-muted-foreground">
              Set up your service provider profile to start receiving partnership opportunities
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Service Provider Information</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="business_name">Business/Organization Name *</Label>
                  <Input
                    id="business_name"
                    value={formData.business_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, business_name: e.target.value }))}
                    placeholder="Your business or organization name"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tagline">Tagline</Label>
                  <Input
                    id="tagline"
                    value={formData.tagline}
                    onChange={(e) => setFormData(prev => ({ ...prev, tagline: e.target.value }))}
                    placeholder="A brief tagline describing your expertise"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe your services and expertise..."
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Domain Specializations *</Label>
                  <p className="text-sm text-muted-foreground">Select the domains where you offer services</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {DOMAIN_PAGES.map((domain) => (
                      <div key={domain.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`domain-${domain.id}`}
                          checked={formData.domain_specializations.includes(domain.id)}
                          onCheckedChange={() => toggleDomain(domain.id)}
                        />
                        <Label 
                          htmlFor={`domain-${domain.id}`} 
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {domain.title}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Services Offered</Label>
                  <div className="flex gap-2">
                    <Input
                      value={newService}
                      onChange={(e) => setNewService(e.target.value)}
                      placeholder="e.g., Web Development, Grant Writing"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addService())}
                    />
                    <Button type="button" variant="outline" onClick={addService}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  {formData.services.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {formData.services.map((service, index) => (
                        <Badge key={index} variant="secondary" className="flex items-center gap-1">
                          {service}
                          <X 
                            className="h-3 w-3 cursor-pointer" 
                            onClick={() => setFormData(prev => ({
                              ...prev,
                              services: prev.services.filter((_, i) => i !== index)
                            }))}
                          />
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Skills & Tags</Label>
                  <div className="flex gap-2">
                    <Input
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      placeholder="e.g., React, Nonprofit, Design"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                    />
                    <Button type="button" variant="outline" onClick={addTag}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  {formData.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {formData.tags.map((tag, index) => (
                        <Badge key={index} variant="outline" className="flex items-center gap-1">
                          {tag}
                          <X 
                            className="h-3 w-3 cursor-pointer" 
                            onClick={() => setFormData(prev => ({
                              ...prev,
                              tags: prev.tags.filter((_, i) => i !== index)
                            }))}
                          />
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Pricing Range (Optional)</Label>
                  <div className="grid grid-cols-3 gap-2">
                    <Input
                      type="number"
                      placeholder="Min rate"
                      value={formData.pricing_range.min}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        pricing_range: { ...prev.pricing_range, min: e.target.value }
                      }))}
                    />
                    <Input
                      type="number"
                      placeholder="Max rate"
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
                      value={newPortfolioLink}
                      onChange={(e) => setNewPortfolioLink(e.target.value)}
                      placeholder="https://your-portfolio.com"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addPortfolioLink())}
                    />
                    <Button type="button" variant="outline" onClick={addPortfolioLink}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  {formData.portfolio_links.length > 0 && (
                    <div className="space-y-2 mt-3">
                      {formData.portfolio_links.map((link, index) => (
                        <div key={index} className="flex items-center gap-2 p-2 bg-muted rounded">
                          <span className="text-sm flex-1">{link}</span>
                          <X 
                            className="h-4 w-4 cursor-pointer text-muted-foreground hover:text-foreground" 
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
                    onClick={() => navigate('/labr8')}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={loading || !formData.business_name.trim() || formData.domain_specializations.length === 0}
                    className="flex-1 bg-[#00eada] hover:bg-[#00eada]/90 text-black"
                  >
                    {loading ? 'Creating Profile...' : 'Create Profile'}
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

export default Labr8Setup;
