import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Steps, Step } from '@/components/ui/steps';
import { ChevronLeft, ChevronRight, Check, Building2, Globe, Users, Camera, Loader2 } from 'lucide-react';
import { CommunityFormData, COMMUNITY_TYPES } from '@/types/community';
import { useToast } from '@/hooks/use-toast';

// Structured data options
const LOCATION_OPTIONS = [
  { value: 'remote', label: 'Remote/Online' },
  { value: 'san-francisco', label: 'San Francisco, CA' },
  { value: 'new-york', label: 'New York, NY' },
  { value: 'los-angeles', label: 'Los Angeles, CA' },
  { value: 'chicago', label: 'Chicago, IL' },
  { value: 'austin', label: 'Austin, TX' },
  { value: 'seattle', label: 'Seattle, WA' },
  { value: 'boston', label: 'Boston, MA' },
  { value: 'miami', label: 'Miami, FL' },
  { value: 'denver', label: 'Denver, CO' },
  { value: 'london', label: 'London, UK' },
  { value: 'toronto', label: 'Toronto, Canada' },
  { value: 'berlin', label: 'Berlin, Germany' },
  { value: 'amsterdam', label: 'Amsterdam, Netherlands' },
  { value: 'singapore', label: 'Singapore' },
  { value: 'sydney', label: 'Sydney, Australia' },
  { value: 'other', label: 'Other' },
];

const FORMAT_OPTIONS = [
  { value: 'online', label: 'Online Only' },
  { value: 'IRL', label: 'In-Person Only (IRL)' },
  { value: 'hybrid', label: 'Hybrid (Online & In-Person)' },
];

const COMMUNITY_SIZE_OPTIONS = [
  { value: '1-10', label: '1-10 members' },
  { value: '11-50', label: '11-50 members' },
  { value: '51-100', label: '51-100 members' },
  { value: '101-500', label: '101-500 members' },
  { value: '500+', label: '500+ members' },
];

const EVENT_FREQUENCY_OPTIONS = [
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'biweekly', label: 'Bi-weekly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'quarterly', label: 'Quarterly' },
  { value: 'adhoc', label: 'Ad-hoc' },
];

const WIZARD_STEPS = [
  'Basic Information',
  'Community Details', 
  'Visibility & Contact',
  'Review & Complete'
];

interface CommunitySetupWizardProps {
  onComplete: (data: CommunityFormData) => void;
}

export const CommunitySetupWizard: React.FC<CommunitySetupWizardProps> = ({ onComplete }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<CommunityFormData>({
    name: '',
    description: '',
    bio: '',
    type: '',
    location: 'remote',
    format: 'hybrid',
    communitySize: '1-10',
    eventFrequency: 'monthly',
    tags: [],
    isPublic: true,
    website: '',
    email: '',
    socialLinks: {
      twitter: '',
      linkedin: '',
      facebook: ''
    },
    customLocation: ''
  });

  const [newTag, setNewTag] = useState('');

  const updateFormData = (field: keyof CommunityFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      updateFormData('tags', [...formData.tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    updateFormData('tags', formData.tags.filter(tag => tag !== tagToRemove));
  };

  const nextStep = () => {
    if (currentStep < WIZARD_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 0:
        return formData.name.trim() && formData.type && formData.location && formData.format;
      case 1:
        return formData.description.trim() && formData.bio.trim();
      case 2:
        return true; // Optional fields
      case 3:
        return true; // Review step
      default:
        return false;
    }
  };

  const handleComplete = async () => {
    if (isSubmitting) return; // Prevent double submission
    
    try {
      setIsSubmitting(true);
      await onComplete(formData);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create community. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <Building2 className="h-16 w-16 text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Create Your Community</h2>
              <p className="text-muted-foreground">Let's start with the basics</p>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Community Name *</Label>
                <Input
                  id="name"
                  placeholder="e.g., San Francisco Tech Meetup"
                  value={formData.name}
                  onChange={(e) => updateFormData('name', e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="type">Community Type *</Label>
                <Select value={formData.type} onValueChange={(value) => updateFormData('type', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {COMMUNITY_TYPES.map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="location">Location *</Label>
                <Select value={formData.location} onValueChange={(value) => updateFormData('location', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    {LOCATION_OPTIONS.map(location => (
                      <SelectItem key={location.value} value={location.value}>
                        {location.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {formData.location === 'other' && (
                  <Input
                    className="mt-2"
                    placeholder="Enter custom location"
                    value={formData.customLocation}
                    onChange={(e) => updateFormData('customLocation', e.target.value)}
                  />
                )}
              </div>

              <div>
                <Label htmlFor="format">Community Format *</Label>
                <Select value={formData.format} onValueChange={(value) => updateFormData('format', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select format" />
                  </SelectTrigger>
                  <SelectContent>
                    {FORMAT_OPTIONS.map(format => (
                      <SelectItem key={format.value} value={format.value}>
                        {format.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="communitySize">Expected Size</Label>
                  <Select value={formData.communitySize} onValueChange={(value) => updateFormData('communitySize', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select size" />
                    </SelectTrigger>
                    <SelectContent>
                      {COMMUNITY_SIZE_OPTIONS.map(size => (
                        <SelectItem key={size.value} value={size.value}>
                          {size.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="eventFrequency">Event Frequency</Label>
                  <Select value={formData.eventFrequency} onValueChange={(value) => updateFormData('eventFrequency', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      {EVENT_FREQUENCY_OPTIONS.map(freq => (
                        <SelectItem key={freq.value} value={freq.value}>
                          {freq.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <Users className="h-16 w-16 text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Tell Your Story</h2>
              <p className="text-muted-foreground">Help people understand what your community is about</p>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="description">Short Description *</Label>
                <Input
                  id="description"
                  placeholder="A brief one-line description"
                  value={formData.description}
                  onChange={(e) => updateFormData('description', e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="bio">Community Bio *</Label>
                <Textarea
                  id="bio"
                  placeholder="Tell us more about your community, its mission, and what makes it special..."
                  value={formData.bio}
                  onChange={(e) => updateFormData('bio', e.target.value)}
                  rows={4}
                />
              </div>

              <div>
                <Label htmlFor="tags">Tags</Label>
                <div className="flex gap-2 mb-2">
                  <Input
                    id="tags"
                    placeholder="Add a tag"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  />
                  <Button type="button" onClick={addTag} size="sm">Add</Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map(tag => (
                    <Badge key={tag} variant="secondary" className="cursor-pointer" onClick={() => removeTag(tag)}>
                      {tag} ×
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <Globe className="h-16 w-16 text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Visibility & Contact</h2>
              <p className="text-muted-foreground">How can people find and connect with your community?</p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Public Community</Label>
                  <p className="text-sm text-muted-foreground">Allow your community to be discovered in the directory</p>
                </div>
                <Switch
                  checked={formData.isPublic}
                  onCheckedChange={(checked) => updateFormData('isPublic', checked)}
                />
              </div>

              <div>
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  placeholder="https://your-community.com"
                  value={formData.website}
                  onChange={(e) => updateFormData('website', e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="email">Contact Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="contact@your-community.com"
                  value={formData.email}
                  onChange={(e) => updateFormData('email', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Social Links</Label>
                <Input
                  placeholder="Twitter URL"
                  value={formData.socialLinks?.twitter || ''}
                  onChange={(e) => updateFormData('socialLinks', { ...formData.socialLinks, twitter: e.target.value })}
                />
                <Input
                  placeholder="LinkedIn URL"
                  value={formData.socialLinks?.linkedin || ''}
                  onChange={(e) => updateFormData('socialLinks', { ...formData.socialLinks, linkedin: e.target.value })}
                />
                <Input
                  placeholder="Facebook URL"
                  value={formData.socialLinks?.facebook || ''}
                  onChange={(e) => updateFormData('socialLinks', { ...formData.socialLinks, facebook: e.target.value })}
                />
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <Check className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Review & Complete</h2>
              <p className="text-muted-foreground">Review your community details before publishing</p>
            </div>

            <Card>
              <CardContent className="p-6 space-y-4">
                <div>
                  <h3 className="font-semibold text-lg">{formData.name}</h3>
                  <p className="text-muted-foreground">
                    {formData.type} • {LOCATION_OPTIONS.find(l => l.value === formData.location)?.label || formData.customLocation} • {formData.format}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Size: {formData.communitySize} • Events: {formData.eventFrequency}
                  </p>
                </div>
                
                <div>
                  <p className="font-medium mb-1">Description:</p>
                  <p className="text-sm text-muted-foreground">{formData.description}</p>
                </div>

                <div>
                  <p className="font-medium mb-1">Bio:</p>
                  <p className="text-sm text-muted-foreground">{formData.bio}</p>
                </div>

                {formData.tags.length > 0 && (
                  <div>
                    <p className="font-medium mb-2">Tags:</p>
                    <div className="flex flex-wrap gap-2">
                      {formData.tags.map(tag => (
                        <Badge key={tag} variant="secondary">{tag}</Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <p className="font-medium">Visibility: {formData.isPublic ? 'Public' : 'Private'}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
      <div className="max-w-2xl mx-auto pt-8">
        <Card className="backdrop-blur-md bg-white/5 border border-white/10">
          <CardHeader>
            <Steps currentStep={currentStep} steps={WIZARD_STEPS} />
          </CardHeader>
          
          <CardContent className="p-8">
            {renderStep()}

            <div className="flex justify-between mt-8">
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 0}
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>

              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  onClick={() => navigate('/')}
                >
                  Cancel
                </Button>
                
                {currentStep === WIZARD_STEPS.length - 1 ? (
                  <Button onClick={handleComplete} disabled={isSubmitting}>
                    {isSubmitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                    {!isSubmitting && <Check className="h-4 w-4 mr-2" />}
                    {isSubmitting ? 'Creating...' : 'Create Community'}
                  </Button>
                ) : (
                  <Button
                    onClick={nextStep}
                    disabled={!isStepValid()}
                  >
                    Next
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};