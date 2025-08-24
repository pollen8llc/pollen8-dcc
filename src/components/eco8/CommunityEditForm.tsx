import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Community } from '@/hooks/useCommunities';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, X, Plus } from 'lucide-react';

interface CommunityEditFormProps {
  community: Community;
  onSave: (updatedCommunity: Community) => void;
  onCancel: () => void;
}

interface CommunityFormData {
  name: string;
  description: string;
  type: string;
  location: string;
  is_public: boolean;
  website?: string;
  newsletter_url?: string;
  vision?: string;
  community_values?: string;
  community_structure?: string;
  personal_background?: string;
  format?: string;
  community_size?: string;
  event_frequency?: string;
  target_audience: string[];
  tags: string[];
}

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

const sizes = [
  { value: '1-10', label: '1-10 members' },
  { value: '11-50', label: '11-50 members' },
  { value: '51-100', label: '51-100 members' },
  { value: '101-500', label: '101-500 members' },
  { value: '500+', label: '500+ members' },
];

const frequencies = [
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'biweekly', label: 'Bi-weekly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'quarterly', label: 'Quarterly' },
  { value: 'adhoc', label: 'Ad-hoc' },
];

export const CommunityEditForm: React.FC<CommunityEditFormProps> = ({
  community,
  onSave,
  onCancel,
}) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [targetAudience, setTargetAudience] = useState<string[]>(community.target_audience || []);
  const [tags, setTags] = useState<string[]>(community.tags || []);
  const [newTag, setNewTag] = useState('');
  const [newAudience, setNewAudience] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<CommunityFormData>({
    defaultValues: {
      name: community.name,
      description: community.description,
      type: community.type || 'tech',
      location: community.location || '',
      is_public: community.is_public,
      website: community.website || '',
      newsletter_url: community.newsletter_url || '',
      vision: community.vision || '',
      community_values: community.community_values || '',
      community_structure: community.community_structure || '',
      personal_background: community.personal_background || '',
      format: community.format || 'hybrid',
      community_size: community.community_size || '1-10',
      event_frequency: community.event_frequency || 'monthly',
      target_audience: community.target_audience || [],
      tags: community.tags || [],
    },
  });

  const addTargetAudience = () => {
    if (newAudience.trim() && !targetAudience.includes(newAudience.trim())) {
      const updated = [...targetAudience, newAudience.trim()];
      setTargetAudience(updated);
      setValue('target_audience', updated);
      setNewAudience('');
    }
  };

  const removeTargetAudience = (audience: string) => {
    const updated = targetAudience.filter(a => a !== audience);
    setTargetAudience(updated);
    setValue('target_audience', updated);
  };

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      const updated = [...tags, newTag.trim()];
      setTags(updated);
      setValue('tags', updated);
      setNewTag('');
    }
  };

  const removeTag = (tag: string) => {
    const updated = tags.filter(t => t !== tag);
    setTags(updated);
    setValue('tags', updated);
  };

  const onSubmit = async (data: CommunityFormData) => {
    try {
      setIsSubmitting(true);

      const updateData = {
        ...data,
        target_audience: targetAudience,
        tags: tags,
        updated_at: new Date().toISOString(),
      };

      const { data: updatedCommunity, error } = await supabase
        .from('communities')
        .update(updateData)
        .eq('id', community.id)
        .select()
        .single();

      if (error) throw error;

      toast({
        title: 'Community Updated',
        description: 'Your community has been successfully updated.',
      });

      onSave(updatedCommunity);
    } catch (error) {
      console.error('Error updating community:', error);
      toast({
        title: 'Update Failed',
        description: error instanceof Error ? error.message : 'Failed to update community.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="name">Community Name *</Label>
            <Input
              id="name"
              {...register('name', { required: 'Community name is required' })}
              placeholder="Enter community name"
            />
            {errors.name && (
              <p className="text-sm text-destructive mt-1">{errors.name.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              {...register('description', { required: 'Description is required' })}
              placeholder="Describe your community"
              rows={3}
            />
            {errors.description && (
              <p className="text-sm text-destructive mt-1">{errors.description.message}</p>
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="type">Community Type</Label>
              <Select onValueChange={(value) => setValue('type', value)} defaultValue={community.type}>
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
                {...register('location')}
                placeholder="e.g., San Francisco, Remote"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="is_public"
              checked={watch('is_public')}
              onCheckedChange={(checked) => setValue('is_public', checked)}
            />
            <Label htmlFor="is_public">Make community public</Label>
          </div>
        </CardContent>
      </Card>

      {/* Details */}
      <Card>
        <CardHeader>
          <CardTitle>Community Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="vision">Vision</Label>
            <Textarea
              id="vision"
              {...register('vision')}
              placeholder="What's your community's vision?"
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="community_values">Values</Label>
            <Textarea
              id="community_values"
              {...register('community_values')}
              placeholder="What values does your community uphold?"
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="community_structure">Structure & Organization</Label>
            <Textarea
              id="community_structure"
              {...register('community_structure')}
              placeholder="How is your community organized?"
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="personal_background">Founder Background</Label>
            <Textarea
              id="personal_background"
              {...register('personal_background')}
              placeholder="Tell us about your background and why you started this community"
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Configuration */}
      <Card>
        <CardHeader>
          <CardTitle>Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="format">Format</Label>
              <Select onValueChange={(value) => setValue('format', value)} defaultValue={community.format}>
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
              <Label htmlFor="community_size">Community Size</Label>
              <Select onValueChange={(value) => setValue('community_size', value)} defaultValue={community.community_size}>
                <SelectTrigger>
                  <SelectValue placeholder="Select size" />
                </SelectTrigger>
                <SelectContent>
                  {sizes.map((size) => (
                    <SelectItem key={size.value} value={size.value}>
                      {size.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="event_frequency">Event Frequency</Label>
              <Select onValueChange={(value) => setValue('event_frequency', value)} defaultValue={community.event_frequency}>
                <SelectTrigger>
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent>
                  {frequencies.map((freq) => (
                    <SelectItem key={freq.value} value={freq.value}>
                      {freq.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                {...register('website')}
                placeholder="https://your-website.com"
                type="url"
              />
            </div>

            <div>
              <Label htmlFor="newsletter_url">Newsletter URL</Label>
              <Input
                id="newsletter_url"
                {...register('newsletter_url')}
                placeholder="https://newsletter-signup.com"
                type="url"
              />
            </div>
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
              {targetAudience.map((audience) => (
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
              {tags.map((tag) => (
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

      {/* Actions */}
      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save Changes
        </Button>
      </div>
    </form>
  );
};