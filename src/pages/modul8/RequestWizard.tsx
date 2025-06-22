
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSession } from "@/hooks/useSession";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { UnifiedHeader } from "@/components/shared/UnifiedHeader";
import { getUserOrganizer } from "@/services/modul8Service";
import { createStructuredRequest } from "@/services/negotiationService";
import { Organizer } from "@/types/modul8";
import { toast } from "@/hooks/use-toast";
import {
  ArrowLeft,
  Plus,
  X,
  Building,
  DollarSign,
  Clock,
  FileText,
  Send
} from "lucide-react";

const RequestWizard: React.FC = () => {
  const { session, logout } = useSession();
  const navigate = useNavigate();
  const [organizer, setOrganizer] = useState<Organizer | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<any>(null);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    budgetMin: '',
    budgetMax: '',
    timeline: '',
    milestones: [] as string[],
    newMilestone: ''
  });

  useEffect(() => {
    loadData();
    
    // Check if a provider was selected
    const providerData = sessionStorage.getItem('selectedProvider');
    if (providerData) {
      setSelectedProvider(JSON.parse(providerData));
    }
  }, [session?.user?.id]);

  const loadData = async () => {
    if (!session?.user?.id) return;
    
    try {
      const organizerData = await getUserOrganizer(session.user.id);
      setOrganizer(organizerData);
    } catch (err: any) {
      console.error('Error loading organizer:', err);
      toast({
        title: "Error",
        description: "Failed to load organizer data",
        variant: "destructive",
      });
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addMilestone = () => {
    if (formData.newMilestone.trim()) {
      setFormData(prev => ({
        ...prev,
        milestones: [...prev.milestones, prev.newMilestone.trim()],
        newMilestone: ''
      }));
    }
  };

  const removeMilestone = (index: number) => {
    setFormData(prev => ({
      ...prev,
      milestones: prev.milestones.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!organizer || !session?.user?.id) {
      toast({
        title: "Error",
        description: "Organizer data not found",
        variant: "destructive",
      });
      return;
    }

    if (!formData.title || !formData.description || !formData.budgetMin || !formData.timeline) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    try {
      const requestData = {
        title: formData.title,
        description: formData.description,
        budgetMin: parseFloat(formData.budgetMin),
        budgetMax: formData.budgetMax ? parseFloat(formData.budgetMax) : parseFloat(formData.budgetMin),
        timeline: formData.timeline,
        milestones: formData.milestones,
        organizerId: organizer.id,
        serviceProviderId: selectedProvider?.id || '',
        domainPage: selectedProvider?.domain_id ? parseInt(selectedProvider.domain_id) : 1
      };

      console.log('Creating service request:', requestData);
      
      const newRequest = await createStructuredRequest(requestData);
      
      toast({
        title: "Request Created",
        description: `Your service request has been ${selectedProvider ? 'sent to the provider' : 'posted'}`,
      });

      // Clear selected provider from session
      sessionStorage.removeItem('selectedProvider');
      
      // Navigate to request details
      navigate(`/modul8/request/${newRequest.id}`);
      
    } catch (err: any) {
      console.error('Error creating request:', err);
      toast({
        title: "Error",
        description: err?.message || "Failed to create service request",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!organizer) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#00eada] mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <UnifiedHeader 
        platform="modul8" 
        user={session?.user}
        notificationCount={0}
        unreadMessages={0}
        onLogout={logout}
      />
      
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/modul8')}
            className="border-gray-600 text-gray-300 hover:bg-white/10"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>

        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Create Service Request</h1>
            <p className="text-gray-400">
              {selectedProvider 
                ? `Creating a request for ${selectedProvider.business_name}`
                : 'Create a new service request to find the right provider'
              }
            </p>
          </div>

          {selectedProvider && (
            <Card className="glass-card">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Building className="h-5 w-5 text-[#00eada]" />
                    <span className="text-white font-medium">{selectedProvider.business_name}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSelectedProvider(null);
                      sessionStorage.removeItem('selectedProvider');
                    }}
                    className="text-gray-400 hover:text-white"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <FileText className="h-5 w-5" />
                  Project Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-white">Project Title *</Label>
                  <Input
                    id="title"
                    placeholder="Enter a clear project title"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    className="bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-[#00eada]"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="text-white">Project Description *</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe your project requirements, goals, and any specific needs..."
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    rows={4}
                    className="bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-[#00eada] resize-none"
                    required
                  />
                </div>
              </CardContent>
            </Card>

            {/* Budget and Timeline */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <DollarSign className="h-5 w-5" />
                  Budget & Timeline
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="budgetMin" className="text-white">Minimum Budget (USD) *</Label>
                    <Input
                      id="budgetMin"
                      type="number"
                      placeholder="5000"
                      value={formData.budgetMin}
                      onChange={(e) => handleInputChange('budgetMin', e.target.value)}
                      className="bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-[#00eada]"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="budgetMax" className="text-white">Maximum Budget (USD)</Label>
                    <Input
                      id="budgetMax"
                      type="number"
                      placeholder="10000"
                      value={formData.budgetMax}
                      onChange={(e) => handleInputChange('budgetMax', e.target.value)}
                      className="bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-[#00eada]"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="timeline" className="text-white">Project Timeline *</Label>
                  <Input
                    id="timeline"
                    placeholder="e.g., 6-8 weeks, 3 months, By December 2024"
                    value={formData.timeline}
                    onChange={(e) => handleInputChange('timeline', e.target.value)}
                    className="bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-[#00eada]"
                    required
                  />
                </div>
              </CardContent>
            </Card>

            {/* Milestones */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Clock className="h-5 w-5" />
                  Project Milestones
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Add a milestone..."
                    value={formData.newMilestone}
                    onChange={(e) => handleInputChange('newMilestone', e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addMilestone())}
                    className="bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-[#00eada]"
                  />
                  <Button
                    type="button"
                    onClick={addMilestone}
                    className="bg-[#00eada] hover:bg-[#00c4b8] text-black"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                {formData.milestones.length > 0 && (
                  <div className="space-y-2">
                    <Label className="text-white">Milestones:</Label>
                    <div className="flex flex-wrap gap-2">
                      {formData.milestones.map((milestone, index) => (
                        <Badge 
                          key={index} 
                          variant="outline" 
                          className="border-gray-600 text-gray-300 bg-gray-800/50"
                        >
                          {milestone}
                          <button
                            type="button"
                            onClick={() => removeMilestone(index)}
                            className="ml-2 hover:text-red-400"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Submit */}
            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/modul8')}
                className="border-gray-600 text-gray-300 hover:bg-white/10"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="bg-[#00eada] hover:bg-[#00c4b8] text-black font-medium"
              >
                {loading ? 'Creating...' : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    {selectedProvider ? 'Send Request' : 'Create Request'}
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RequestWizard;
