
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useUser } from "@/contexts/UserContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, Upload, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { createServiceProvider } from "@/services/modul8Service";
import { DOMAIN_PAGES } from "@/types/modul8";
import LoadingSpinner from "@/components/ui/loading-spinner";

const Labr8Setup = () => {
  const [businessName, setBusinessName] = useState("");
  const [tagline, setTagline] = useState("");
  const [description, setDescription] = useState("");
  const [services, setServices] = useState<string[]>([]);
  const [serviceInput, setServiceInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [portfolioLinks, setPortfolioLinks] = useState<string[]>([]);
  const [portfolioInput, setPortfolioInput] = useState("");
  const [domainSpecializations, setDomainSpecializations] = useState<number[]>([]);
  const [pricingMin, setPricingMin] = useState("");
  const [pricingMax, setPricingMax] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const { currentUser, refreshUser } = useUser();
  const { toast } = useToast();

  const handleAddService = () => {
    if (serviceInput.trim() && !services.includes(serviceInput.trim())) {
      setServices([...services, serviceInput.trim()]);
      setServiceInput("");
    }
  };

  const handleRemoveService = (service: string) => {
    setServices(services.filter(s => s !== service));
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag));
  };

  const handleAddPortfolioLink = () => {
    if (portfolioInput.trim() && !portfolioLinks.includes(portfolioInput.trim())) {
      setPortfolioLinks([...portfolioLinks, portfolioInput.trim()]);
      setPortfolioInput("");
    }
  };

  const handleRemovePortfolioLink = (link: string) => {
    setPortfolioLinks(portfolioLinks.filter(l => l !== link));
  };

  const handleDomainToggle = (domainId: number) => {
    if (domainSpecializations.includes(domainId)) {
      setDomainSpecializations(domainSpecializations.filter(id => id !== domainId));
    } else {
      setDomainSpecializations([...domainSpecializations, domainId]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    setLoading(true);
    try {
      // Ensure user has SERVICE_PROVIDER role before creating profile
      const { data: userRoles } = await supabase
        .from('user_roles')
        .select(`
          role_id,
          roles:role_id (name)
        `)
        .eq('user_id', currentUser.id);

      const hasServiceProviderRole = userRoles?.some(ur => 
        ur.roles && ur.roles.name === 'SERVICE_PROVIDER'
      );

      if (!hasServiceProviderRole) {
        console.log('Assigning SERVICE_PROVIDER role to user');
        const { error: roleError } = await supabase.rpc('update_user_role', {
          p_user_id: currentUser.id,
          p_role_name: 'SERVICE_PROVIDER',
          p_assigner_id: currentUser.id
        });

        if (roleError) {
          console.error('Error assigning SERVICE_PROVIDER role:', roleError);
          throw new Error('Failed to assign service provider role');
        }

        // Refresh user data to reflect new role
        await refreshUser();
      }

      const pricingRange = {
        min: pricingMin ? parseInt(pricingMin) : undefined,
        max: pricingMax ? parseInt(pricingMax) : undefined,
        currency: 'USD'
      };

      await createServiceProvider({
        user_id: currentUser.id,
        business_name: businessName,
        tagline: tagline || undefined,
        description: description || undefined,
        services: services,
        tags: tags,
        pricing_range: pricingRange,
        portfolio_links: portfolioLinks,
        domain_specializations: domainSpecializations,
        logo_url: logoUrl || undefined
      });

      // Update profile completion status
      await supabase
        .from('profiles')
        .update({ 
          profile_complete: true,
          labr8_setup_complete: true 
        })
        .eq('user_id', currentUser.id);

      toast({
        title: "Profile Created!",
        description: "Your LAB-R8 service provider profile has been created successfully.",
      });

      navigate("/labr8");
    } catch (error: any) {
      console.error('Error creating service provider profile:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create profile. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <div className="h-16 w-16 rounded-lg bg-[#00eada] flex items-center justify-center">
                <Building2 className="h-8 w-8 text-black" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-[#00eada] mb-2">LAB-R8 Setup</h1>
            <p className="text-lg text-muted-foreground">
              Complete your service provider profile to start receiving requests
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>
                  Tell us about your business and what you offer
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="businessName">Business Name *</Label>
                  <Input
                    id="businessName"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder="Your Business Name"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tagline">Tagline</Label>
                  <Input
                    id="tagline"
                    value={tagline}
                    onChange={(e) => setTagline(e.target.value)}
                    placeholder="A brief description of what you do"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Detailed description of your services and expertise"
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="logoUrl">Logo URL</Label>
                  <Input
                    id="logoUrl"
                    value={logoUrl}
                    onChange={(e) => setLogoUrl(e.target.value)}
                    placeholder="https://example.com/logo.png"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Services */}
            <Card>
              <CardHeader>
                <CardTitle>Services</CardTitle>
                <CardDescription>
                  What services do you provide?
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    value={serviceInput}
                    onChange={(e) => setServiceInput(e.target.value)}
                    placeholder="Add a service"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddService())}
                  />
                  <Button type="button" onClick={handleAddService}>Add</Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {services.map((service) => (
                    <Badge key={service} variant="secondary" className="flex items-center gap-1">
                      {service}
                      <X className="h-3 w-3 cursor-pointer" onClick={() => handleRemoveService(service)} />
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Tags */}
            <Card>
              <CardHeader>
                <CardTitle>Tags</CardTitle>
                <CardDescription>
                  Add tags to help clients find you
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    placeholder="Add a tag"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                  />
                  <Button type="button" onClick={handleAddTag}>Add</Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="flex items-center gap-1">
                      {tag}
                      <X className="h-3 w-3 cursor-pointer" onClick={() => handleRemoveTag(tag)} />
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Portfolio Links */}
            <Card>
              <CardHeader>
                <CardTitle>Portfolio Links</CardTitle>
                <CardDescription>
                  Share examples of your work
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    value={portfolioInput}
                    onChange={(e) => setPortfolioInput(e.target.value)}
                    placeholder="https://example.com/portfolio"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddPortfolioLink())}
                  />
                  <Button type="button" onClick={handleAddPortfolioLink}>Add</Button>
                </div>
                <div className="space-y-2">
                  {portfolioLinks.map((link) => (
                    <div key={link} className="flex items-center justify-between p-2 bg-muted rounded">
                      <span className="text-sm">{link}</span>
                      <X className="h-4 w-4 cursor-pointer" onClick={() => handleRemovePortfolioLink(link)} />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Domain Specializations */}
            <Card>
              <CardHeader>
                <CardTitle>Domain Specializations</CardTitle>
                <CardDescription>
                  Select the domains where you have expertise
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {DOMAIN_PAGES.map((domain) => (
                    <div
                      key={domain.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                        domainSpecializations.includes(domain.id)
                          ? 'bg-[#00eada]/10 border-[#00eada]'
                          : 'border-border hover:border-[#00eada]/50'
                      }`}
                      onClick={() => handleDomainToggle(domain.id)}
                    >
                      <h3 className="font-medium mb-1">{domain.title}</h3>
                      <p className="text-sm text-muted-foreground">{domain.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Pricing */}
            <Card>
              <CardHeader>
                <CardTitle>Pricing Range</CardTitle>
                <CardDescription>
                  Optional: Set your general pricing range
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="pricingMin">Minimum (USD)</Label>
                    <Input
                      id="pricingMin"
                      type="number"
                      value={pricingMin}
                      onChange={(e) => setPricingMin(e.target.value)}
                      placeholder="1000"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pricingMax">Maximum (USD)</Label>
                    <Input
                      id="pricingMax"
                      type="number"
                      value={pricingMax}
                      onChange={(e) => setPricingMax(e.target.value)}
                      placeholder="10000"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Submit */}
            <div className="flex justify-center">
              <Button 
                type="submit" 
                className="bg-[#00eada] hover:bg-[#00eada]/90 text-black px-8 py-3 text-lg"
                disabled={loading || !businessName}
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <LoadingSpinner size="sm" />
                    Creating Profile...
                  </div>
                ) : (
                  "Complete Setup"
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Labr8Setup;
