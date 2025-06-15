
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSession } from '@/hooks/useSession';
import { 
  getUserOrganizer, 
  createServiceRequest, 
  getServiceProviderById,
  createNotification 
} from '@/services/modul8Service';
import { DOMAIN_PAGES } from '@/types/modul8';
import { ServiceProvider, Organizer } from '@/types/modul8';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { X, Plus, ArrowLeft, Building2, DollarSign, Clock } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { toast } from '@/hooks/use-toast';

const ProviderRequestPortal = () => {
  const { providerId } = useParams<{ providerId: string }>();
  const { session } = useSession();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(false);
  const [organizerData, setOrganizerData] = useState<Organizer | null>(null);
  const [provider, setProvider] = useState<ServiceProvider | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    budget_range: {
      min: '',
      max: '',
      currency: 'USD'
    },
    timeline: '',
    milestones: [] as string[]
  });
  
  const [newMilestone, setNewMilestone] = useState('');

  useEffect(() => {
    loadData();
  }, [session?.user?.id, providerId]);

  const loadData = async () => {
    if (!session?.user?.id || !providerId) return;
    
    try {
      console.log('Loading data for provider:', providerId);
      
      // Load organizer data
      const organizer = await getUserOrganizer(session.user.id);
      console.log('Organizer data:', organizer);
      
      if (!organizer) {
        toast({
          title: "Setup Required", 
          description: "Please complete your organizer setup first.",
          variant: "destructive"
        });
        navigate('/modul8/setup/organizer');
        return;
      }
      setOrganizerData(organizer);

      // Load provider data
      const providerData = await getServiceProviderById(providerId);
      console.log('Provider data:', providerData);
      
      if (!providerData) {
        toast({
          title: "Provider Not Found",
          description: "The requested service provider could not be found.",
          variant: "destructive"
        });
        navigate('/modul8');
        return;
      }
      setProvider(providerData);
    } catch (error) {
      console.error('Error loading data:', error);
      toast({
        title: "Error",
        description: "Failed to load provider data",
        variant: "destructive"
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!organizerData || !provider) {
      console.error('Missing required data:', { organizerData, provider });
      toast({
        title: "Error",
        description: "Missing required data for submission",
        variant: "destructive"
      });
      return;
    }
    
    if (!formData.title.trim()) {
      toast({
        title: "Validation Error",
        description: "Please provide a service title",
        variant: "destructive"
      });
      return;
    }
    
    setLoading(true);
    try {
      console.log('Submitting request with data:', {
        organizer: organizerData.id,
        provider: provider.id,
        title: formData.title,
        budget_range: formData.budget_range
      });

      const budgetRange = {
        min: formData.budget_range.min ? parseFloat(formData.budget_range.min) : undefined,
        max: formData.budget_range.max ? parseFloat(formData.budget_range.max) : undefined,
        currency: formData.budget_range.currency
      };

      // Create service request with immediate provider assignment
      const serviceRequest = await createServiceRequest({
        organizer_id: organizerData.id,
        domain_page: provider.domain_specializations?.[0] || 1,
        title: formData.title,
        description: formData.description || undefined,
        budget_range: budgetRange,
        timeline: formData.timeline || undefined,
        milestones: formData.milestones,
        service_provider_id: provider.id, // Direct assignment
        status: 'assigned',
        engagement_status: 'affiliated'
      });

      console.log('Service request created:', serviceRequest);

      // Create notification for the service provider
      await createNotification({
        user_id: provider.user_id,
        type: 'service_request',
        title: 'New Service Request',
        message: `You have received a new service request: "${formData.title}" from ${organizerData.organization_name}`,
        data: {
          service_request_id: serviceRequest.id,
          organizer_name: organizerData.organization_name
        }
      });
      
      toast({
        title: "Request Submitted!",
        description: `Your request has been sent directly to ${provider.business_name}.`
      });
      
      navigate(`/modul8/request/${serviceRequest.id}`);
    } catch (error) {
      console.error('Error creating service request:', error);
      toast({
        title: "Error",
        description: `Failed to submit service request: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const addMilestone = () => {
    if (newMilestone.trim() && !formData.milestones.includes(newMilestone.trim())) {
      setFormData(prev => ({
        ...prev,
        milestones: [...prev.milestones, newMilestone.trim()]
      }));
      setNewMilestone('');
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

  if (!provider) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#00eada]"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
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
          </div>

          {/* Provider Information Header */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={provider.logo_url} />
                  <AvatarFallback>
                    <Building2 className="h-8 w-8" />
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1">
                  <h2 className="text-2xl font-bold mb-2">{provider.business_name}</h2>
                  {provider.tagline && (
                    <p className="text-muted-foreground mb-3">{provider.tagline}</p>
                  )}
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    {provider.pricing_range && (
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{formatPricing(provider.pricing_range)}</span>
                      </div>
                    )}
                  </div>
                  
                  {provider.tags && provider.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {provider.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Request Form */}
          <Card>
            <CardHeader>
              <CardTitle>Request Service from {provider.business_name}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Service Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="e.g., Set up CRM system for donor management"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe what you need in detail..."
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Budget Range</Label>
                  <div className="grid grid-cols-3 gap-2">
                    <Input
                      type="number"
                      placeholder="Min ($)"
                      value={formData.budget_range.min}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        budget_range: { ...prev.budget_range, min: e.target.value }
                      }))}
                    />
                    <Input
                      type="number"
                      placeholder="Max ($)"
                      value={formData.budget_range.max}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        budget_range: { ...prev.budget_range, max: e.target.value }
                      }))}
                    />
                    <Input
                      value={formData.budget_range.currency}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        budget_range: { ...prev.budget_range, currency: e.target.value }
                      }))}
                      placeholder="USD"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="timeline">Preferred Timeline</Label>
                  <Input
                    id="timeline"
                    value={formData.timeline}
                    onChange={(e) => setFormData(prev => ({ ...prev, timeline: e.target.value }))}
                    placeholder="e.g., 2-3 months, ASAP, By end of Q1"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Milestones / Deliverables</Label>
                  <div className="flex gap-2">
                    <Input
                      value={newMilestone}
                      onChange={(e) => setNewMilestone(e.target.value)}
                      placeholder="e.g., Initial setup complete"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addMilestone())}
                    />
                    <Button type="button" variant="outline" onClick={addMilestone}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  {formData.milestones.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {formData.milestones.map((milestone, index) => (
                        <Badge key={index} variant="secondary" className="flex items-center gap-1">
                          {milestone}
                          <X 
                            className="h-3 w-3 cursor-pointer" 
                            onClick={() => setFormData(prev => ({
                              ...prev,
                              milestones: prev.milestones.filter((_, i) => i !== index)
                            }))}
                          />
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-medium text-blue-800 mb-2">Direct Assignment</h4>
                  <p className="text-sm text-blue-700">
                    This request will be sent directly to {provider.business_name} and automatically assigned to them. 
                    They will be notified immediately and can begin working on your project.
                  </p>
                </div>

                <div className="flex gap-4 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate(-1)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={loading || !formData.title.trim()}
                    className="flex-1 bg-[#00eada] hover:bg-[#00eada]/90 text-black"
                  >
                    {loading ? 'Submitting...' : `Send to ${provider.business_name}`}
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

export default ProviderRequestPortal;
