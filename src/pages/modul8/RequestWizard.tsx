
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import { useToast } from '@/hooks/use-toast';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ArrowLeft, Building, Send } from 'lucide-react';
import { createServiceRequest, getUserOrganizer } from '@/services/modul8Service';

const RequestWizard = () => {
  const { currentUser } = useUser();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [selectedProvider, setSelectedProvider] = useState<any>(null);
  const [selectedDomain, setSelectedDomain] = useState<any>(null);
  const [organizer, setOrganizer] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    timeline: '',
    budgetMin: '',
    budgetMax: '',
    milestones: ''
  });

  useEffect(() => {
    loadRequestWizardData();
  }, [currentUser]);

  const loadRequestWizardData = async () => {
    if (!currentUser) return;

    try {
      // Check if user has organizer profile
      const organizerProfile = await getUserOrganizer(currentUser.id);
      if (!organizerProfile) {
        toast({
          title: "Setup Required",
          description: "Please complete your organizer profile setup first",
          variant: "destructive"
        });
        navigate('/modul8/setup/organizer');
        return;
      }
      setOrganizer(organizerProfile);

      // Retrieve data from sessionStorage
      const storedProvider = sessionStorage.getItem('selectedProvider');
      const storedDomain = sessionStorage.getItem('selectedDomain');
      
      if (storedProvider) {
        setSelectedProvider(JSON.parse(storedProvider));
      }
      if (storedDomain) {
        setSelectedDomain(JSON.parse(storedDomain));
      }

      if (!storedProvider || !storedDomain) {
        navigate('/modul8');
        return;
      }
    } catch (error) {
      console.error('Error loading request wizard data:', error);
      toast({
        title: "Error",
        description: "Failed to load request data",
        variant: "destructive"
      });
      navigate('/modul8');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/modul8/directory');
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentUser || !selectedProvider || !selectedDomain || !organizer) {
      toast({
        title: "Error",
        description: "Missing required information. Please try again.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Create the service request using organizer ID (not user ID)
      const budgetRange = {
        min: formData.budgetMin ? parseInt(formData.budgetMin) : undefined,
        max: formData.budgetMax ? parseInt(formData.budgetMax) : undefined,
        currency: 'USD'
      };

      const milestones = formData.milestones 
        ? formData.milestones.split('\n').filter(m => m.trim())
        : [];

      await createServiceRequest({
        organizer_id: organizer.id, // Use organizer.id, not currentUser.id
        domain_page: selectedDomain.id,
        title: formData.title,
        description: formData.description,
        budget_range: budgetRange,
        timeline: formData.timeline,
        milestones,
        service_provider_id: null, // Start without assignment
        status: 'pending',
        engagement_status: 'none'
      });

      // Clear sessionStorage
      sessionStorage.removeItem('selectedProvider');
      sessionStorage.removeItem('selectedDomain');

      toast({
        title: "Request Sent",
        description: "Your service request has been created successfully.",
      });

      // Navigate to status page
      navigate('/modul8/status');

    } catch (error) {
      console.error('Error creating service request:', error);
      toast({
        title: "Error",
        description: "Failed to send request. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!selectedProvider || !selectedDomain) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Building className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold text-muted-foreground mb-2">
                No Provider Selected
              </h3>
              <p className="text-muted-foreground text-center mb-4">
                Please select a provider from the directory first
              </p>
              <Button onClick={() => navigate('/modul8')}>
                Back to Dashboard
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
      
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={handleBack}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Directory
          </Button>
          
          <div>
            <h1 className="text-3xl font-bold">Create Service Request</h1>
            <p className="text-muted-foreground mt-2">
              Send a detailed request for the selected domain
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Domain & Selection Info */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle className="text-lg">Request Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="font-medium mb-1">Domain:</p>
                  <p className="text-sm text-muted-foreground">{selectedDomain.title}</p>
                </div>
                
                <div>
                  <p className="font-medium mb-1">Organization:</p>
                  <p className="text-sm text-muted-foreground">
                    {organizer?.organization_name || 'Your Organization'}
                  </p>
                </div>

                <div>
                  <p className="font-medium mb-1">Selected Provider:</p>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={selectedProvider.logoUrl} />
                      <AvatarFallback>
                        <Building className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{selectedProvider.businessName}</p>
                      <p className="text-xs text-muted-foreground">{selectedProvider.tagline}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Request Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Request Details</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <Label htmlFor="title">Project Title</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      placeholder="Brief, descriptive title for your project"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="description">Project Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      placeholder="Detailed description of what you need..."
                      rows={4}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="timeline">Timeline</Label>
                    <Input
                      id="timeline"
                      value={formData.timeline}
                      onChange={(e) => handleInputChange('timeline', e.target.value)}
                      placeholder="e.g., 2-3 weeks, by end of month"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="budgetMin">Budget Min ($)</Label>
                      <Input
                        id="budgetMin"
                        type="number"
                        value={formData.budgetMin}
                        onChange={(e) => handleInputChange('budgetMin', e.target.value)}
                        placeholder="5000"
                      />
                    </div>
                    <div>
                      <Label htmlFor="budgetMax">Budget Max ($)</Label>
                      <Input
                        id="budgetMax"
                        type="number"
                        value={formData.budgetMax}
                        onChange={(e) => handleInputChange('budgetMax', e.target.value)}
                        placeholder="10000"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="milestones">Key Milestones (one per line)</Label>
                    <Textarea
                      id="milestones"
                      value={formData.milestones}
                      onChange={(e) => handleInputChange('milestones', e.target.value)}
                      placeholder="Initial design mockups&#10;Content draft&#10;Final deliverables"
                      rows={3}
                    />
                  </div>

                  <div className="flex gap-4">
                    <Button type="button" variant="outline" onClick={handleBack}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isSubmitting} className="flex-1">
                      {isSubmitting ? (
                        "Sending..."
                      ) : (
                        <>
                          <Send className="h-4 w-4 mr-2" />
                          Send Request
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestWizard;
