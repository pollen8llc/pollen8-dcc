
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';
import { StateSelector } from './StateSelector';
import { TagLibrarySelector } from './TagLibrarySelector';

interface CommunityFormData {
  name: string;
  description: string;
  type: string;
  location: string;
  format: string;
  website: string;
  is_public: boolean;
}

interface CommunityCreationFormProps {
  onSuccess?: (community: any) => void;
  onCancel?: () => void;
}

const COMMUNITY_TYPES = [
  { value: 'tech', label: 'Technology' },
  { value: 'creative', label: 'Creative' },
  { value: 'wellness', label: 'Wellness' },
  { value: 'professional', label: 'Professional' },
  { value: 'social-impact', label: 'Social Impact' },
  { value: 'education', label: 'Education' },
  { value: 'social', label: 'Social' },
  { value: 'other', label: 'Other' },
];

const FORMATS = [
  { value: 'online', label: 'Online' },
  { value: 'IRL', label: 'In-Person (IRL)' },
  { value: 'hybrid', label: 'Hybrid' },
];

export const CommunityCreationForm: React.FC<CommunityCreationFormProps> = ({
  onSuccess,
  onCancel,
}) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<CommunityFormData>({
    defaultValues: {
      name: '',
      description: '',
      type: 'tech',
      location: 'Remote',
      format: 'hybrid',
      website: '',
      is_public: true,
    },
  });

  const watchedType = watch('type');
  const watchedLocation = watch('location');
  const watchedFormat = watch('format');
  const watchedIsPublic = watch('is_public');

  const onSubmit = async (data: CommunityFormData) => {
    try {
      setIsSubmitting(true);
      
      console.log('Starting community creation via RPC...');

      // Get current user to verify authentication
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        console.error('Authentication error:', userError);
        throw new Error('You must be logged in to create a community');
      }
      
      console.log('User authenticated:', user.id);

      // Create the community directly in the communities table
      const { data: community, error } = await supabase
        .from('communities')
        .insert({
          name: data.name.trim(),
          description: data.description.trim(),
          type: data.type,
          location: data.location,
          format: data.format,
          website: data.website.trim() || null,
          is_public: data.is_public,
          tags: selectedTags,
          target_audience: [], // Empty array as default
          social_media: {}, // Empty object as default
          communication_platforms: {}, // Empty object as default
          owner_id: user.id
        })
        .select()
        .single();

      if (error) {
        console.error('RPC error:', error);
        throw new Error(error.message || 'Failed to create community');
      }

      console.log('Community created successfully via RPC:', community);

      toast({
        title: 'Community Created',
        description: 'Your community has been successfully created!',
      });

      // Reset form
      reset();
      setSelectedTags([]);

      if (onSuccess) {
        onSuccess(community);
      }
    } catch (error) {
      console.error('Error creating community:', error);
      toast({
        title: 'Creation Failed',
        description: error instanceof Error ? error.message : 'Failed to create community. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Create Your Community</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Community Name *</Label>
              <Input
                id="name"
                {...register('name', { 
                  required: 'Community name is required',
                  minLength: { value: 2, message: 'Name must be at least 2 characters' },
                  maxLength: { value: 100, message: 'Name must be less than 100 characters' }
                })}
                placeholder="Enter your community name"
              />
              {errors.name && (
                <p className="text-sm text-destructive mt-1">{errors.name.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                {...register('description', { 
                  required: 'Description is required',
                  minLength: { value: 10, message: 'Description must be at least 10 characters' },
                  maxLength: { value: 500, message: 'Description must be less than 500 characters' }
                })}
                placeholder="Describe your community's purpose and goals"
                rows={4}
              />
              {errors.description && (
                <p className="text-sm text-destructive mt-1">{errors.description.message}</p>
              )}
            </div>
          </div>

          {/* Community Details */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="type">Community Type</Label>
              <Select value={watchedType} onValueChange={(value) => setValue('type', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {COMMUNITY_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="format">Format</Label>
              <Select value={watchedFormat} onValueChange={(value) => setValue('format', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select format" />
                </SelectTrigger>
                <SelectContent>
                  {FORMATS.map((format) => (
                    <SelectItem key={format.value} value={format.value}>
                      {format.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Location */}
          <StateSelector
            value={watchedLocation}
            onValueChange={(value) => setValue('location', value)}
            placeholder="Select your community's location"
          />

          {/* Website */}
          <div>
            <Label htmlFor="website">Website (Optional)</Label>
            <Input
              id="website"
              {...register('website', {
                pattern: {
                  value: /^$|^https?:\/\/.+/,
                  message: 'Please enter a valid URL starting with http:// or https://'
                }
              })}
              placeholder="https://your-website.com"
              type="url"
            />
            {errors.website && (
              <p className="text-sm text-destructive mt-1">{errors.website.message}</p>
            )}
          </div>

          {/* Tags */}
          <TagLibrarySelector
            selectedTags={selectedTags}
            onTagsChange={setSelectedTags}
            maxTags={10}
          />

          {/* Public/Private */}
          <div className="flex items-center space-x-2">
            <Switch
              id="is_public"
              checked={watchedIsPublic}
              onCheckedChange={(checked) => setValue('is_public', checked)}
            />
            <Label htmlFor="is_public">Make community publicly visible</Label>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4 pt-4">
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            )}
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Community
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
