
import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useSession } from '@/hooks/useSession';
import { getUserOrganizer, createServiceRequest } from '@/services/modul8Service';
import { DOMAIN_PAGES } from '@/types/modul8';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { X, Plus, ArrowLeft } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { toast } from '@/hooks/use-toast';

const ServiceRequestForm = () => {
  const { session } = useSession();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const domainId = parseInt(searchParams.get('domain') || '1');
  
  const [loading, setLoading] = useState(false);
  const [organizerData, setOrganizerData] = useState(null);
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
    loadOrganizerData();
  }, [session?.user?.id]);

  const loadOrganizerData = async () => {
    if (!session?.user?.id) return;
    
    try {
      const organizer = await getUserOrganizer(session.user.id);
      if (!organizer) {
        navigate('/modul8/setup/organizer');
        return;
      }
      setOrganizerData(organizer);
    } catch (error) {
      console.error('Error loading organizer data:', error);
      toast({
        title: "Error",
        description: "Failed to load organizer data",
        variant: "destructive"
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!organizerData) return;
    
    setLoading(true);
    try {
      const budgetRange = {
        min: formData.budget_range.min ? parseFloat(formData.budget_range.min) : undefined,
        max: formData.budget_range.max ? parseFloat(formData.budget_range.max) : undefined,
        currency: formData.budget_range.currency
      };

      await createServiceRequest({
        organizer_id: organizerData.id,
        domain_page: domainId,
        title: formData.title,
        description: formData.description || undefined,
        budget_range: budgetRange,
        timeline: formData.timeline || undefined,
        milestones: formData.milestones
      });
      
      toast({
        title: "Success!",
        description: "Your service request has been created."
      });
      
      navigate('/modul8');
    } catch (error) {
      console.error('Error creating service request:', error);
      toast({
        title: "Error",
        description: "Failed to create service request",
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

  const currentDomain = DOMAIN_PAGES.find(p => p.id === domainId);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/modul8')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
          </div>

          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">
              Request Service
            </h1>
            <p className="text-muted-foreground">
              {currentDomain?.title} • {currentDomain?.description}
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Service Request Details</CardTitle>
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

                <div className="flex gap-4 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate('/modul8')}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={loading || !formData.title.trim()}
                    className="flex-1 bg-[#00eada] hover:bg-[#00eada]/90 text-black"
                  >
                    {loading ? 'Creating...' : 'Create Request'}
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

export default ServiceRequestForm;
