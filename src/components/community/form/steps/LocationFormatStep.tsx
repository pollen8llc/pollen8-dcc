
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { 
  FormField, 
  FormItem, 
  FormLabel, 
  FormControl, 
  FormMessage,
  FormDescription
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { 
  COMMUNITY_FORMATS, 
  COMMUNITY_TYPES 
} from '@/constants/communityConstants';

const LocationFormatStep = () => {
  const form = useFormContext();
  
  return (
    <div className="space-y-6">
      <FormField
        name="location"
        control={form.control}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Location</FormLabel>
            <FormDescription>
              Where is your community based?
            </FormDescription>
            <FormControl>
              <Input 
                {...field}
                placeholder="City, State, Country or 'Remote'" 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        name="format"
        control={form.control}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Format</FormLabel>
            <FormDescription>
              How does your community meet and interact?
            </FormDescription>
            <Select
              onValueChange={field.onChange}
              defaultValue={field.value}
              value={field.value}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select format" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value={COMMUNITY_FORMATS.ONLINE}>Online</SelectItem>
                <SelectItem value={COMMUNITY_FORMATS.IRL}>In Person (IRL)</SelectItem>
                <SelectItem value={COMMUNITY_FORMATS.HYBRID}>Hybrid</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        name="type"
        control={form.control}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Community Type</FormLabel>
            <FormDescription>
              What category best describes your community?
            </FormDescription>
            <Select
              onValueChange={field.onChange}
              defaultValue={field.value}
              value={field.value}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value={COMMUNITY_TYPES.TECH}>Tech</SelectItem>
                <SelectItem value={COMMUNITY_TYPES.CREATIVE}>Creative</SelectItem>
                <SelectItem value={COMMUNITY_TYPES.WELLNESS}>Wellness</SelectItem>
                <SelectItem value={COMMUNITY_TYPES.PROFESSIONAL}>Professional</SelectItem>
                <SelectItem value={COMMUNITY_TYPES.SOCIAL_IMPACT}>Social Impact</SelectItem>
                <SelectItem value={COMMUNITY_TYPES.EDUCATION}>Education</SelectItem>
                <SelectItem value={COMMUNITY_TYPES.SOCIAL}>Social</SelectItem>
                <SelectItem value={COMMUNITY_TYPES.OTHER}>Other</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        name="targetAudience"
        control={form.control}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Target Audience</FormLabel>
            <FormDescription>
              Who is your community for? (comma-separated tags)
            </FormDescription>
            <FormControl>
              <Input 
                {...field}
                placeholder="developers, designers, entrepreneurs, etc." 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default LocationFormatStep;
