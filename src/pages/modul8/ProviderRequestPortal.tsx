
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSession } from '@/hooks/useSession';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ArrowLeft, Building, User } from 'lucide-react';
import Navbar from '@/components/Navbar';
import StructuredProposalForm from '@/components/modul8/StructuredProposalForm';
import { getServiceProviderById, getUserOrganizer } from '@/services/modul8Service';
import { createStructuredRequest } from '@/services/negotiationService';
import { ServiceProvider, Organizer } from '@/types/modul8';
import { toast } from '@/hooks/use-toast';

const ProviderRequestPortal = () => {
  const { providerId } = useParams<{ providerId: string }>();
  const navigate = useNavigate();
  const { session } = useSession();

  const [provider, setProvider] = useState<ServiceProvider | null>(null);
  const [organizer, setOrganizer] = useState<Organizer | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadData();
  }, [providerId, session?.user?.id]);

  const loadData = async () => {
    if (!providerId || !session?.user?.id) return;
    
    setLoading(true);
    try {
      const [providerData, organizerData] = await Promise.all([
        getServiceProviderById(providerId),
        getUserOrganizer(session.user.id)
      ]);
      
      setProvider(providerData);
      setOrganizer(organizerData);

      if (!organizerData) {
        toast({
          title: "Setup Required",
          description: "Please complete your organizer profile first",
          variant: "destructive"
        });
        navigate('/modul8/setup/organizer');
        return;
      }
    } catch (error) {
      console.error('Error loading data:', error);
      toast({
        title: "Error",
        description: "Failed to load provider information",
        variant: "destructive"
      });
      navigate('/modul8');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitRequest = async (formData: any) => {
    if (!provider || !organizer) return;
    
    setSubmitting(true);
    try {
      const serviceRequest = await createStructuredRequest({
        title: formData.title,
        description: formData.description,
        budgetMin: formData.budgetMin,
        budgetMax: formData.budgetMax,
        timeline: formData.timeline,
        milestones: formData.milestones,
        organizerId: organizer.id,
        serviceProviderId: provider.id,
        domainPage: provider.domain_specializations?.[0] || 1
      });

      toast({
        title: "Request Sent!",
        description: `Your service request has been sent to ${provider.business_name}`
      });

      // Navigate to the request status page
      navigate(`/modul8/provider/${providerId}/${serviceRequest.id}/status`);
    } catch (error) {
      console.error('Error submitting request:', error);
      toast({
        title: "Error",
        description: "Failed to send request. Please try again.",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate(-1);
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

  if (!provider) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center">
            <h2 className="text-2xl font-semibold mb-2">Provider Not Found</h2>
            <Button onClick={() => navigate('/modul8')}>
              Back to Dashboard
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <h1 className="text-3xl font-bold">Request Service</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Provider Info Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle>Service Provider</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={provider.logo_url} />
                    <AvatarFallback>
                      <Building className="h-8 w-8" />
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-lg">
                      {provider.business_name}
                    </h3>
                    {provider.tagline && (
                      <p className="text-sm text-muted-foreground">
                        {provider.tagline}
                      </p>
                    )}
                  </div>
                </div>

                {provider.description && (
                  <div>
                    <h4 className="font-medium mb-2">About</h4>
                    <p className="text-sm text-muted-foreground">
                      {provider.description}
                    </p>
                  </div>
                )}

                {provider.services && Array.isArray(provider.services) && provider.services.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">Services</h4>
                    <div className="flex flex-wrap gap-1">
                      {provider.services.map((service: any, index: number) => (
                        <span 
                          key={index}
                          className="text-xs bg-secondary px-2 py-1 rounded"
                        >
                          {typeof service === 'string' ? service : service.name || 'Service'}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {provider.pricing_range && (
                  <div>
                    <h4 className="font-medium mb-2">Pricing Range</h4>
                    <p className="text-sm text-muted-foreground">
                      {provider.pricing_range.min 
                        ? `${provider.pricing_range.currency || 'USD'} ${provider.pricing_range.min.toLocaleString()}${
                            provider.pricing_range.max ? ` - ${provider.pricing_range.max.toLocaleString()}` : '+'
                          }`
                        : 'Contact for pricing'
                      }
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Request Form */}
          <div className="lg:col-span-2">
            <StructuredProposalForm
              onSubmit={handleSubmitRequest}
              onCancel={handleCancel}
              isSubmitting={submitting}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProviderRequestPortal;
