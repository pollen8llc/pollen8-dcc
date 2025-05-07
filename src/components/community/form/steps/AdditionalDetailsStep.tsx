
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
import { Textarea } from '@/components/ui/textarea';

const AdditionalDetailsStep = () => {
  const form = useFormContext();
  
  return (
    <div className="space-y-6">
      <FormField
        name="founder_name"
        control={form.control}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Founder Name</FormLabel>
            <FormDescription>
              Name of the community founder or organizer
            </FormDescription>
            <FormControl>
              <Input 
                {...field}
                placeholder="Enter founder's name" 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        name="role_title"
        control={form.control}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Organizer Role Title</FormLabel>
            <FormDescription>
              Your title or role in the community
            </FormDescription>
            <FormControl>
              <Input 
                {...field}
                placeholder="Community Manager, Founder, etc." 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        name="vision"
        control={form.control}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Community Vision</FormLabel>
            <FormDescription>
              What is your long-term vision for this community?
            </FormDescription>
            <FormControl>
              <Textarea 
                {...field}
                placeholder="Share your vision and goals for the community..."
                className="min-h-24"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        name="community_values"
        control={form.control}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Community Values</FormLabel>
            <FormDescription>
              What core values guide your community?
            </FormDescription>
            <FormControl>
              <Textarea 
                {...field}
                placeholder="Describe the values that are important to your community..."
                className="min-h-24"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default AdditionalDetailsStep;
