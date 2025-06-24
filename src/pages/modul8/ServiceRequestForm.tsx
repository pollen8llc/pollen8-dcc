
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSession } from '@/hooks/useSession';
import { getUserOrganizer, createServiceRequest } from '@/services/modul8Service';
import { ServiceProvider, Organizer } from '@/types/modul8';
import { DOMAIN_PAGES } from '@/types/modul8';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ArrowLeft, Building2, Plus, X } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { toast } from '@/hooks/use-toast';

const ServiceRequestForm = () => {
  const navigate = useNavigate();
  const { session } = useSession();
  
  const [organizer, setOrganizer] = useState<Organizer | null>(null);
  const [selectedProvider, setSelectedProvider] = useState<ServiceProvider | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  // Form data
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    timeline: '',
    budgetMin: '',
    budgetMax: '',
    currency: 'USD',
    milestones: [''] as string[]
  });

  useEffect(() => {
    loadFormData();
  }, [session?.user?.id]);

  const loadFormData = async () => {
    if (!session?.user?.id) return;
    
    try {
      setLoading(true);
      
      // Load organizer data
      const organizerData = await getUserOrganizer(session.user.id);
      if (!organizerData) {
        toast({
          title: "Setup Required",
          description: "Please complete your organizer profile first",
          variant: "destructive"
        });
        navigate('/modul8/setup/organizer');
        return;
      }
      setOrganizer(organizerData);
      
      // Load selected provider from session storage
      const storedProvider = sessionStorage.getItem('selectedProvider');
      if (storedProvider) {
        setSelectedProvider(JSON.parse(storedProvider));
      }
      
    } catch (error) {
      console.error('Error loading form data:', error);
      toast({
        title: "Error",
        description: "Failed to load form data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleMilestoneChange = (index: number, value: string) => {
    const newMilestones = [...formData.milestones];
    newMilestones[index] = value;
    setFormData(prev => ({ ...prev, milestones: newMilestones }));
  };

  const addMilestone = () => {
    setFormData(prev => ({ ...prev, milestones: [...prev.milestones, ''] }));
  };

  const removeMilestone = (index: number) => {
    if (formData.milestones.length > 1) {
      const newMilestones = formData.milestones.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, milestones: newMilestones }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!organizer || !formData.title.trim()) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    setSubmitting(true);
    
    try {
      const requestData = {
        organizer_id: organizer.id,
        domain_page: selectedProvider?.domain_specializations?.[0] || 1,
        title: formData.title,
        description: formData.description || undefined,
        timeline: formData.timeline || undefined,
        budget_range: {
          min: formData.budgetMin ? parseInt(formData.budgetMin) : undefined,
          max: formData.budgetMax ? parseInt(formData.budgetMax) : undefined,
          currency: formData.currency
        },
        milestones: formData.milestones.filter(m => m.trim() !== ''),
        service_provider_id: selectedProvider?.id,
        status: selectedProvider ? 'assigned' : 'pending',
        engagement_status: selectedProvider ? 'affiliated' : 'none'
      };

      const createdRequest = await createServiceRequest(requestData);
      
      // Clear session storage
      sessionStorage.removeItem('selectedProvider');
      
      toast({
        title: "Request Submitted",
        description: "Your service request has been created successfully",
      });
      
      // Navigate to the request details page
      navigate(`/modul8/dashboard/request/${createdRequest.id}`);
      
    } catch (error) {
      console.error('Error creating request:', error);
      toast({
        title: "Error",
        description: "Failed to create service request",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00eada]"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/modul8/dashboard')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Create Service Request</h1>
            <p className="text-muted-foreground mt-1">
              {selectedProvider ? `Engaging with ${selectedProvider.business_name}` : 'Submit a new service request'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Request Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="title">Project Title *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      placeholder="Enter a clear, descriptive title for your project"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="description">Project Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      placeholder="Provide detailed information about your project requirements..."
                      rows={4}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="timeline">Timeline</Label>
                    <Input
                      id="timeline"
                      value={formData.timeline}
                      onChange={(e) => handleInputChange('timeline', e.target.value)}
                      placeholder="e.g., 2-3 weeks, By end of month"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Budget Range</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="budgetMin">Minimum Budget</Label>
                      <Input
                        id="budgetMin"
                        type="number"
                        value={formData.budgetMin}
                        onChange={(e) => handleInputChange('budgetMin', e.target.value)}
                        placeholder="1000"
                      />
                    </div>
                    <div>
                      <Label htmlFor="budgetMax">Maximum Budget</Label>
                      <Input
                        id="budgetMax"
                        type="number"
                        value={formData.budgetMax}
                        onChange={(e) => handleInputChange('budgetMax', e.target.value)}
                        placeholder="5000"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    Project Milestones
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addMilestone}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Milestone
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {formData.milestones.map((milestone, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={milestone}
                        onChange={(e) => handleMilestoneChange(index, e.target.value)}
                        placeholder={`Milestone ${index + 1}`}
                        className="flex-1"
                      />
                      {formData.milestones.length > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeMilestone(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>

              <div className="flex gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/modul8/dashboard')}
                  disabled={submitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={submitting}
                  className="bg-[#00eada] hover:bg-[#00eada]/90 text-black"
                >
                  {submitting ? 'Creating Request...' : 'Submit Request'}
                </Button>
              </div>
            </form>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {selectedProvider && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Selected Provider</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-start gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={selectedProvider.logo_url} />
                      <AvatarFallback>
                        <Building2 className="h-6 w-6" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium">{selectedProvider.business_name}</h3>
                      {selectedProvider.tagline && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {selectedProvider.tagline}
                        </p>
                      )}
                      {selectedProvider.tags && selectedProvider.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {selectedProvider.tags.slice(0, 3).map((tag, index) => (
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
            )}

            {organizer && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Your Organization</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-start gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={organizer.logo_url} />
                      <AvatarFallback>
                        <Building2 className="h-6 w-6" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium">{organizer.organization_name}</h3>
                      {organizer.description && (
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-3">
                          {organizer.description}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceRequestForm;
