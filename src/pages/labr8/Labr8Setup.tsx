
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Building2, ArrowRight, Check } from 'lucide-react';
import { createServiceProvider } from '@/services/modul8Service';

const domains = [
  { id: 1, name: "Fundraising & Sponsorship" },
  { id: 2, name: "Event Production & Logistics" },
  { id: 3, name: "Legal & Compliance" },
  { id: 4, name: "Marketing & Communications" },
  { id: 5, name: "Technology & Digital Infrastructure" },
  { id: 6, name: "Vendor & Marketplace Management" },
  { id: 7, name: "Partnership Development & Collaboration" },
  { id: 8, name: "Community Engagement & Relationship Management" }
];

const Labr8Setup = () => {
  const { currentUser } = useUser();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    businessName: '',
    tagline: '',
    description: '',
    services: [],
    tags: '',
    domainSpecializations: [],
    pricingMin: '',
    pricingMax: '',
    portfolioLinks: ''
  });

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const toggleDomain = (domainId: number) => {
    setFormData(prev => ({
      ...prev,
      domainSpecializations: prev.domainSpecializations.includes(domainId)
        ? prev.domainSpecializations.filter(id => id !== domainId)
        : [...prev.domainSpecializations, domainId]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentUser) {
      toast({
        title: "Error",
        description: "You must be logged in to complete setup",
        variant: "destructive"
      });
      return;
    }

    if (formData.domainSpecializations.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one domain specialization",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const serviceData = formData.services.length > 0 
        ? formData.services 
        : [{ name: formData.businessName, description: formData.description }];

      const portfolioLinks = formData.portfolioLinks
        ? formData.portfolioLinks.split('\n').filter(link => link.trim())
        : [];

      const tags = formData.tags
        ? formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
        : [];

      const pricingRange = {
        min: formData.pricingMin ? parseInt(formData.pricingMin) : undefined,
        max: formData.pricingMax ? parseInt(formData.pricingMax) : undefined,
        currency: 'USD'
      };

      await createServiceProvider({
        user_id: currentUser.id,
        business_name: formData.businessName,
        tagline: formData.tagline,
        description: formData.description,
        services: serviceData,
        tags,
        domain_specializations: formData.domainSpecializations,
        pricing_range: pricingRange,
        portfolio_links: portfolioLinks
      });

      toast({
        title: "Setup Complete!",
        description: "Your LAB-R8 service provider profile has been created",
      });

      navigate('/labr8/inbox');

    } catch (error) {
      console.error('Error creating service provider:', error);
      toast({
        title: "Error",
        description: "Failed to create provider profile. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="container mx-auto max-w-4xl">
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="h-12 w-12 rounded-lg bg-[#00eada] flex items-center justify-center">
              <Building2 className="h-6 w-6 text-black" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-[#00eada] mb-2">LAB-R8 Setup</h1>
          <p className="text-muted-foreground">
            Complete your service provider profile to start receiving requests
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Service Provider Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="businessName">Business Name *</Label>
                  <Input
                    id="businessName"
                    value={formData.businessName}
                    onChange={(e) => handleInputChange('businessName', e.target.value)}
                    placeholder="Your business or company name"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="tagline">Tagline</Label>
                  <Input
                    id="tagline"
                    value={formData.tagline}
                    onChange={(e) => handleInputChange('tagline', e.target.value)}
                    placeholder="Brief description of what you do"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Detailed description of your services and expertise"
                  rows={4}
                  required
                />
              </div>

              <div>
                <Label>Domain Specializations * (Select all that apply)</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                  {domains.map((domain) => (
                    <div
                      key={domain.id}
                      onClick={() => toggleDomain(domain.id)}
                      className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                        formData.domainSpecializations.includes(domain.id)
                          ? 'border-[#00eada] bg-[#00eada]/10'
                          : 'border-muted hover:border-muted-foreground'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{domain.name}</span>
                        {formData.domainSpecializations.includes(domain.id) && (
                          <Check className="h-4 w-4 text-[#00eada]" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="tags">Service Tags (comma-separated)</Label>
                <Input
                  id="tags"
                  value={formData.tags}
                  onChange={(e) => handleInputChange('tags', e.target.value)}
                  placeholder="e.g., graphic design, web development, consulting"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="pricingMin">Minimum Project Rate ($)</Label>
                  <Input
                    id="pricingMin"
                    type="number"
                    value={formData.pricingMin}
                    onChange={(e) => handleInputChange('pricingMin', e.target.value)}
                    placeholder="5000"
                  />
                </div>
                <div>
                  <Label htmlFor="pricingMax">Maximum Project Rate ($)</Label>
                  <Input
                    id="pricingMax"
                    type="number"
                    value={formData.pricingMax}
                    onChange={(e) => handleInputChange('pricingMax', e.target.value)}
                    placeholder="50000"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="portfolioLinks">Portfolio Links (one per line)</Label>
                <Textarea
                  id="portfolioLinks"
                  value={formData.portfolioLinks}
                  onChange={(e) => handleInputChange('portfolioLinks', e.target.value)}
                  placeholder="https://example.com/portfolio&#10;https://github.com/username"
                  rows={3}
                />
              </div>

              <div className="flex gap-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/labr8/auth')}
                >
                  Back
                </Button>
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="flex-1 bg-[#00eada] hover:bg-[#00eada]/90 text-black"
                >
                  {isSubmitting ? (
                    "Creating Profile..."
                  ) : (
                    <>
                      Complete Setup
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Labr8Setup;
