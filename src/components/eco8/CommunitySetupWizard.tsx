
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useCommunities } from '@/hooks/useCommunities';
import { Loader2 } from 'lucide-react';
import { StateSelector } from './StateSelector';
import { TagLibrarySelector } from './TagLibrarySelector';

interface CommunityFormData {
  name: string;
  description: string;
  location: string;
  website?: string;
  isPublic: boolean;
  tags: string[];
}

interface CommunitySetupWizardProps {
  onComplete?: (community: any) => void;
  onCancel?: () => void;
}

export const CommunitySetupWizard: React.FC<CommunitySetupWizardProps> = ({
  onComplete,
  onCancel,
}) => {
  const { toast } = useToast();
  const { createCommunity } = useCommunities();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<CommunityFormData>({
    defaultValues: {
      name: '',
      description: '',
      location: '',
      website: '',
      isPublic: true,
      tags: [],
    },
  });

  const watchedLocation = watch('location');
  const watchedIsPublic = watch('isPublic');

  const onSubmit = async (data: CommunityFormData) => {
    try {
      setIsSubmitting(true);

      const communityData = {
        name: data.name,
        description: data.description,
        location: data.location,
        website: data.website || null,
        is_public: data.isPublic,
        tags: selectedTags,
        type: 'tech', // Default type
        format: 'hybrid', // Default format
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      console.log('Creating community with data:', communityData);

      const newCommunity = await createCommunity(communityData);

      toast({
        title: 'Community Created',
        description: 'Your community has been successfully created!',
      });

      if (onComplete) {
        onComplete(newCommunity);
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

  const handleTagsChange = (tags: string[]) => {
    setSelectedTags(tags);
    setValue('tags', tags);
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Create Your Community</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <Label htmlFor="name">Community Name *</Label>
              <Input
                id="name"
                {...register('name', { required: 'Community name is required' })}
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
                {...register('description', { required: 'Description is required' })}
                placeholder="Describe your community's purpose and goals"
                rows={4}
              />
              {errors.description && (
                <p className="text-sm text-destructive mt-1">{errors.description.message}</p>
              )}
            </div>

            <StateSelector
              value={watchedLocation}
              onValueChange={(value) => setValue('location', value)}
              placeholder="Select your community's location"
            />

            <div>
              <Label htmlFor="website">Website (Optional)</Label>
              <Input
                id="website"
                {...register('website')}
                placeholder="https://your-website.com"
                type="url"
              />
            </div>

            <TagLibrarySelector
              selectedTags={selectedTags}
              onTagsChange={handleTagsChange}
              maxTags={10}
            />

            <div className="flex items-center space-x-2">
              <Switch
                id="isPublic"
                checked={watchedIsPublic}
                onCheckedChange={(checked) => setValue('isPublic', checked)}
              />
              <Label htmlFor="isPublic">Make community publicly visible</Label>
            </div>

            <div className="flex justify-end gap-4">
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
    </div>
  );
};
