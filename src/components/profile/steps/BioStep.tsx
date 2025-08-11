
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
      
      <FormField
        name="socialLinks.linkedin"
        control={form.control}
        render={({ field }) => (
          <FormItem>
            <FormLabel>LinkedIn Profile</FormLabel>
            <FormDescription>
              Your LinkedIn profile URL
            </FormDescription>
            <FormControl>
              <Input 
                {...field}
                placeholder="https://linkedin.com/in/yourprofile" 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        name="socialLinks.twitter"
        control={form.control}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Twitter/X Profile</FormLabel>
            <FormDescription>
              Your Twitter/X profile URL
            </FormDescription>
            <FormControl>
              <Input 
                {...field}
                placeholder="https://twitter.com/yourhandle" 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        name="socialLinks.github"
        control={form.control}
        render={({ field }) => (
          <FormItem>
            <FormLabel>GitHub Profile</FormLabel>
            <FormDescription>
              Your GitHub profile URL
            </FormDescription>
            <FormControl>
              <Input 
                {...field}
                placeholder="https://github.com/yourusername" 
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
