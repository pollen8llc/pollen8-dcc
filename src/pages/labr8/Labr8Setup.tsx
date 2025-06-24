
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import LoadingSpinner from '@/components/ui/loading-spinner';

const Labr8Setup = () => {
  const { currentUser } = useUser();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    businessName: '',
    description: '',
    services: '',
    expertise: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // TODO: Implement service provider profile creation
      toast({
        title: "Setup Complete!",
        description: "Your LAB-R8 service provider profile has been created."
      });
      navigate('/labr8/dashboard');
    } catch (error) {
      toast({
        title: "Setup Failed",
        description: "There was an error setting up your profile. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (!currentUser) {
    return (
      <div className="flex items-center justify-center h-screen">
        <LoadingSpinner size="lg" text="Loading..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-[#00eada]">LAB-R8 Setup</CardTitle>
          <p className="text-muted-foreground">Complete your service provider profile</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="businessName">Business Name</Label>
              <Input
                id="businessName"
                value={formData.businessName}
                onChange={(e) => setFormData(prev => ({ ...prev, businessName: e.target.value }))}
                placeholder="Your business or professional name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe your services and what you offer..."
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="services">Services Offered</Label>
              <Textarea
                id="services"
                value={formData.services}
                onChange={(e) => setFormData(prev => ({ ...prev, services: e.target.value }))}
                placeholder="List the services you provide..."
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="expertise">Areas of Expertise</Label>
              <Input
                id="expertise"
                value={formData.expertise}
                onChange={(e) => setFormData(prev => ({ ...prev, expertise: e.target.value }))}
                placeholder="e.g., Web Development, Design, Marketing..."
              />
            </div>

            <Button 
              type="submit" 
              className="w-full bg-[#00eada] hover:bg-[#00eada]/90 text-black"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <LoadingSpinner size="sm" />
                  Setting up profile...
                </div>
              ) : (
                "Complete Setup"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Labr8Setup;
