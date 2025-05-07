
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
                <SelectItem value="online">Online</SelectItem>
                <SelectItem value="IRL">In Person (IRL)</SelectItem>
                <SelectItem value="hybrid">Hybrid</SelectItem>
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
                <SelectItem value="tech">Tech</SelectItem>
                <SelectItem value="creative">Creative</SelectItem>
                <SelectItem value="wellness">Wellness</SelectItem>
                <SelectItem value="professional">Professional</SelectItem>
                <SelectItem value="social-impact">Social Impact</SelectItem>
                <SelectItem value="education">Education</SelectItem>
                <SelectItem value="social">Social</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        name="target_audience"
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
