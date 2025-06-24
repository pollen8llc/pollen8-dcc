
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
import { Building, ArrowRight, Check } from 'lucide-react';
import { createOrganizer } from '@/services/modul8Service';

const focusAreas = [
  'Community Building',
  'Event Management',
  'Social Impact',
  'Technology',
  'Education',
  'Healthcare',
  'Environment',
  'Arts & Culture',
  'Business Development',
  'Nonprofit',
  'Other'
];

const OrganizerSetup = () => {
  const { currentUser } = useUser();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    organizationName: '',
    description: '',
    selectedFocusAreas: []
  });

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const toggleFocusArea = (area: string) => {
    setFormData(prev => ({
      ...prev,
      selectedFocusAreas: prev.selectedFocusAreas.includes(area)
        ? prev.selectedFocusAreas.filter(a => a !== area)
        : [...prev.selectedFocusAreas, area]
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

    if (!formData.organizationName.trim()) {
      toast({
        title: "Error",
        description: "Organization name is required",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      await createOrganizer({
        user_id: currentUser.id,
        organization_name: formData.organizationName,
        description: formData.description,
        focus_areas: formData.selectedFocusAreas
      });

      toast({
        title: "Setup Complete!",
        description: "Your organizer profile has been created",
      });

      navigate('/modul8');

    } catch (error) {
      console.error('Error creating organizer:', error);
      toast({
        title: "Error",
        description: "Failed to create organizer profile. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="container mx-auto max-w-2xl">
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="h-12 w-12 rounded-lg bg-primary flex items-center justify-center">
              <Building className="h-6 w-6 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-3xl font-bold mb-2">Organizer Setup</h1>
          <p className="text-muted-foreground">
            Complete your organizer profile to start using Modul8
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Organization Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="organizationName">Organization Name *</Label>
                <Input
                  id="organizationName"
                  value={formData.organizationName}
                  onChange={(e) => handleInputChange('organizationName', e.target.value)}
                  placeholder="Your organization or company name"
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Brief description of your organization and mission"
                  rows={4}
                />
              </div>

              <div>
                <Label>Focus Areas (Select all that apply)</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                  {focusAreas.map((area) => (
                    <div
                      key={area}
                      onClick={() => toggleFocusArea(area)}
                      className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                        formData.selectedFocusAreas.includes(area)
                          ? 'border-primary bg-primary/10'
                          : 'border-muted hover:border-muted-foreground'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{area}</span>
                        {formData.selectedFocusAreas.includes(area) && (
                          <Check className="h-4 w-4 text-primary" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/modul8')}
                >
                  Back
                </Button>
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="flex-1"
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

export default OrganizerSetup;
