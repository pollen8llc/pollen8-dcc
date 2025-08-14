import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { X, Plus } from 'lucide-react';
import { A10DClassification } from '@/types/a10d';

interface A10DAddProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultClassification?: A10DClassification;
}

const A10DAddProfileDialog: React.FC<A10DAddProfileDialogProps> = ({ open, onOpenChange }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    classification: '' as A10DClassification | '',
    communityEngagement: 0,
    eventsAttended: 0,
    notes: '',
    interests: [] as string[],
    socialMedia: {
      twitter: '',
      linkedin: '',
      instagram: ''
    }
  });
  
  const [newInterest, setNewInterest] = useState('');

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSocialMediaChange = (platform: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      socialMedia: {
        ...prev.socialMedia,
        [platform]: value
      }
    }));
  };

  const addInterest = () => {
    if (newInterest.trim() && !formData.interests.includes(newInterest.trim())) {
      setFormData(prev => ({
        ...prev,
        interests: [...prev.interests, newInterest.trim()]
      }));
      setNewInterest('');
    }
  };

  const removeInterest = (index: number) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically save the profile to your backend
    console.log('New profile data:', formData);
    
    // Reset form and close dialog
    setFormData({
      name: '',
      email: '',
      classification: '',
      communityEngagement: 0,
      eventsAttended: 0,
      notes: '',
      interests: [],
      socialMedia: {
        twitter: '',
        linkedin: '',
        instagram: ''
      }
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New A10D Profile</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Enter full name"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="Enter email address"
                required
              />
            </div>
          </div>

          {/* Classification */}
          <div className="space-y-2">
            <Label htmlFor="classification">Classification *</Label>
            <Select value={formData.classification} onValueChange={(value) => handleInputChange('classification', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select classification" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Ambassador">Ambassador</SelectItem>
                <SelectItem value="Volunteer">Volunteer</SelectItem>
                <SelectItem value="Moderator">Moderator</SelectItem>
                <SelectItem value="Supporter">Supporter</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Engagement Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="engagement">Community Engagement (%)</Label>
              <Input
                id="engagement"
                type="number"
                min="0"
                max="100"
                value={formData.communityEngagement}
                onChange={(e) => handleInputChange('communityEngagement', parseInt(e.target.value) || 0)}
                placeholder="0-100"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="events">Events Attended</Label>
              <Input
                id="events"
                type="number"
                min="0"
                value={formData.eventsAttended}
                onChange={(e) => handleInputChange('eventsAttended', parseInt(e.target.value) || 0)}
                placeholder="Number of events"
              />
            </div>
          </div>

          {/* Interests */}
          <div className="space-y-2">
            <Label>Interests</Label>
            <div className="flex gap-2">
              <Input
                value={newInterest}
                onChange={(e) => setNewInterest(e.target.value)}
                placeholder="Add interest"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addInterest())}
              />
              <Button type="button" onClick={addInterest} size="icon" variant="outline">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            {formData.interests.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.interests.map((interest, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {interest}
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="w-4 h-4 p-0 hover:bg-transparent"
                      onClick={() => removeInterest(index)}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Social Media */}
          <div className="space-y-4">
            <Label>Social Media (optional)</Label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="twitter" className="text-sm">Twitter</Label>
                <Input
                  id="twitter"
                  value={formData.socialMedia.twitter}
                  onChange={(e) => handleSocialMediaChange('twitter', e.target.value)}
                  placeholder="@username"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="linkedin" className="text-sm">LinkedIn</Label>
                <Input
                  id="linkedin"
                  value={formData.socialMedia.linkedin}
                  onChange={(e) => handleSocialMediaChange('linkedin', e.target.value)}
                  placeholder="linkedin.com/in/username"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="instagram" className="text-sm">Instagram</Label>
                <Input
                  id="instagram"
                  value={formData.socialMedia.instagram}
                  onChange={(e) => handleSocialMediaChange('instagram', e.target.value)}
                  placeholder="@username"
                />
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              placeholder="Additional notes about this profile..."
              rows={3}
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={!formData.name || !formData.email || !formData.classification}>
              Add Profile
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default A10DAddProfileDialog;