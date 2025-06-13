
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSession } from '@/hooks/useSession';
import { createOrganizer } from '@/services/modul8Service';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { X, Plus } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { toast } from '@/hooks/use-toast';

const OrganizerSetup = () => {
  const { session } = useSession();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    organization_name: '',
    description: '',
    logo_url: '',
    focus_areas: [] as string[]
  });
  const [newFocusArea, setNewFocusArea] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user?.id) return;
    
    setLoading(true);
    try {
      await createOrganizer({
        ...formData,
        user_id: session.user.id
      });
      
      toast({
        title: "Success!",
        description: "Your organizer profile has been created."
      });
      
      navigate('/modul8');
    } catch (error) {
      console.error('Error creating organizer profile:', error);
      toast({
        title: "Error",
        description: "Failed to create organizer profile",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const addFocusArea = () => {
    if (newFocusArea.trim() && !formData.focus_areas.includes(newFocusArea.trim())) {
      setFormData(prev => ({
        ...prev,
        focus_areas: [...prev.focus_areas, newFocusArea.trim()]
      }));
      setNewFocusArea('');
    }
  };

  const removeFocusArea = (area: string) => {
    setFormData(prev => ({
      ...prev,
      focus_areas: prev.focus_areas.filter(a => a !== area)
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Set Up Your Organizer Profile
            </h1>
            <p className="text-gray-600">
              Create your profile to start managing ecosystem partnerships
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Organization Details</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="organization_name">Organization Name *</Label>
                  <Input
                    id="organization_name"
                    value={formData.organization_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, organization_name: e.target.value }))}
                    placeholder="Your Organization Name"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe your organization and mission..."
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="logo_url">Logo URL</Label>
                  <Input
                    id="logo_url"
                    type="url"
                    value={formData.logo_url}
                    onChange={(e) => setFormData(prev => ({ ...prev, logo_url: e.target.value }))}
                    placeholder="https://example.com/logo.png"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Focus Areas</Label>
                  <div className="flex gap-2">
                    <Input
                      value={newFocusArea}
                      onChange={(e) => setNewFocusArea(e.target.value)}
                      placeholder="e.g., Education, Healthcare, Environment"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFocusArea())}
                    />
                    <Button type="button" variant="outline" onClick={addFocusArea}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  {formData.focus_areas.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {formData.focus_areas.map((area) => (
                        <Badge key={area} variant="secondary" className="flex items-center gap-1">
                          {area}
                          <X 
                            className="h-3 w-3 cursor-pointer" 
                            onClick={() => removeFocusArea(area)}
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
                    onClick={() => navigate('/')}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={loading || !formData.organization_name.trim()}
                    className="flex-1"
                  >
                    {loading ? 'Creating...' : 'Create Profile'}
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

export default OrganizerSetup;
