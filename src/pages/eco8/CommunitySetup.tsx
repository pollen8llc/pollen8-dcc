
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, X, Plus } from 'lucide-react';
import Navbar from '@/components/Navbar';

const communityTypes = [
  { value: 'tech', label: 'Technology' },
  { value: 'creative', label: 'Creative' },
  { value: 'wellness', label: 'Wellness' },
  { value: 'professional', label: 'Professional' },
  { value: 'social-impact', label: 'Social Impact' },
  { value: 'education', label: 'Education' },
  { value: 'social', label: 'Social' },
  { value: 'other', label: 'Other' },
];

const formats = [
  { value: 'online', label: 'Online' },
  { value: 'IRL', label: 'In-Person (IRL)' },
  { value: 'hybrid', label: 'Hybrid' },
];

interface CommunityFormData {
  name: string;
  description: string;
  type: string;
  location: string;
  is_public: boolean;
  website?: string;
  format: string;
  target_audience: string[];
  tags: string[];
}

const CommunitySetup: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { currentUser } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState<CommunityFormData>({
    name: '',
    description: '',
    type: 'tech',
    location: '',
    is_public: true,
    website: '',
    format: 'hybrid',
    target_audience: [],
    tags: [],
  });

  const [newTag, setNewTag] = useState('');
  const [newAudience, setNewAudience] = useState('');

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }));
  };

  const addTargetAudience = () => {
    if (newAudience.trim() && !formData.target_audience.includes(newAudience.trim())) {
      setFormData(prev => ({
        ...prev,
        target_audience: [...prev.target_audience, newAudience.trim()]
      }));
      setNewAudience('');
    }
  };

  const removeTargetAudience = (audience: string) => {
    setFormData(prev => ({
      ...prev,
      target_audience: prev.target_audience.filter(a => a !== audience)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentUser) {
      toast({
        title: 'Authentication Required',
        description: 'Please log in to create a community.',
        variant: 'destructive',
      });
      return;
    }

    if (!formData.name.trim() || !formData.description.trim()) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in the community name and description.',
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsSubmitting(true);

      // Insert directly into communities table
      const { data: community, error } = await supabase
        .from('communities')
        .insert({
          name: formData.name.trim(),
          description: formData.description.trim(),
          type: formData.type,
          location: formData.location.trim() || 'Remote',
          is_public: formData.is_public,
          website: formData.website?.trim() || null,
          format: formData.format,
          target_audience: formData.target_audience,
          tags: formData.tags,
          owner_id: currentUser.id,
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating community:', error);
        throw error;
      }

      toast({
        title: 'Community Created',
        description: 'Your community has been successfully created!',
      });

      // Navigate to the edit page to complete the profile
      navigate(`/eco8/community/${community.id}?edit=true`);

    } catch (error) {
      console.error('Error creating community:', error);
      toast({
        title: 'Creation Failed',
        description: error instanceof Error ? error.message : 'Failed to create community.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
      <Navbar />
      <div className="w-full px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4">Create Your Community</h1>
            <p className="text-lg text-muted-foreground">
              Start building connections and growing your community
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="name">Community Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter your community name"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe what your community is about"
                    rows={3}
                    required
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="type">Community Type</Label>
                    <Select onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        {communityTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                      placeholder="e.g., San Francisco, Remote"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="format">Format</Label>
                  <Select onValueChange={(value) => setFormData(prev => ({ ...prev, format: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select format" />
                    </SelectTrigger>
                    <SelectContent>
                      {formats.map((format) => (
                        <SelectItem key={format.value} value={format.value}>
                          {format.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="website">Website (Optional)</Label>
                  <Input
                    id="website"
                    type="url"
                    value={formData.website}
                    onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
                    placeholder="https://your-website.com"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_public"
                    checked={formData.is_public}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_public: checked }))}
                  />
                  <Label htmlFor="is_public">Make community public</Label>
                </div>
              </CardContent>
            </Card>

            {/* Target Audience */}
            <Card>
              <CardHeader>
                <CardTitle>Target Audience</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      value={newAudience}
                      onChange={(e) => setNewAudience(e.target.value)}
                      placeholder="Add target audience"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTargetAudience())}
                    />
                    <Button type="button" onClick={addTargetAudience} variant="outline">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.target_audience.map((audience) => (
                      <Badge key={audience} variant="secondary" className="flex items-center gap-1">
                        {audience}
                        <X 
                          className="h-3 w-3 cursor-pointer" 
                          onClick={() => removeTargetAudience(audience)}
                        />
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tags */}
            <Card>
              <CardHeader>
                <CardTitle>Tags</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      placeholder="Add tag"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                    />
                    <Button type="button" onClick={addTag} variant="outline">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                        {tag}
                        <X 
                          className="h-3 w-3 cursor-pointer" 
                          onClick={() => removeTag(tag)}
                        />
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end gap-4">
              <Button type="button" variant="outline" onClick={() => navigate('/eco8')}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Community
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CommunitySetup;
