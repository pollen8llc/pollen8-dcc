
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form';

const BioStep = () => {
  const form = useFormContext();
  
  return (
    <div className="space-y-6">
      <FormField
        name="bio"
        control={form.control}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Bio</FormLabel>
            <FormDescription>
              Tell others a bit about yourself
            </FormDescription>
            <FormControl>
              <Textarea 
                {...field}
                placeholder="Share a little about yourself, your interests, expertise, or what you're looking for..."
                className="min-h-32"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        name="location"
        control={form.control}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Location</FormLabel>
            <FormDescription>
              Where are you based?
            </FormDescription>
            <FormControl>
              <Input 
                {...field}
                placeholder="City, State, Country" 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
    </div>
  );
};

export default BioStep;
