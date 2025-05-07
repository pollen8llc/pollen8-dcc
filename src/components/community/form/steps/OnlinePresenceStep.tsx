
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

const OnlinePresenceStep = () => {
  const form = useFormContext();
  
  return (
    <div className="space-y-6">
      <FormField
        name="website"
        control={form.control}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Website</FormLabel>
            <FormDescription>
              Your community's website or landing page
            </FormDescription>
            <FormControl>
              <Input 
                {...field}
                placeholder="https://example.com" 
                type="url"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        name="newsletterUrl"
        control={form.control}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Newsletter URL</FormLabel>
            <FormDescription>
              Link to your newsletter signup page
            </FormDescription>
            <FormControl>
              <Input 
                {...field}
                placeholder="https://newsletter.example.com" 
                type="url"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <h3 className="text-lg font-medium mt-8 mb-4">Social Media</h3>
      
      <FormField
        name="social_media.twitter"
        control={form.control}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Twitter / X</FormLabel>
            <FormControl>
              <Input 
                {...field}
                placeholder="https://twitter.com/username" 
                type="url"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        name="social_media.linkedin"
        control={form.control}
        render={({ field }) => (
          <FormItem>
            <FormLabel>LinkedIn</FormLabel>
            <FormControl>
              <Input 
                {...field}
                placeholder="https://linkedin.com/company/name" 
                type="url"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        name="social_media.instagram"
        control={form.control}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Instagram</FormLabel>
            <FormControl>
              <Input 
                {...field}
                placeholder="https://instagram.com/username" 
                type="url"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default OnlinePresenceStep;
