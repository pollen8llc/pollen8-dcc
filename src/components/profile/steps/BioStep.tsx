
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form';

const BioStep = () => {
  const { register, formState: { errors } } = useFormContext();
  
  return (
    <div className="space-y-6">
      <FormField
        name="bio"
        control={undefined}
        render={() => (
          <FormItem>
            <FormLabel>Bio</FormLabel>
            <FormDescription>
              Tell others a bit about yourself
            </FormDescription>
            <FormControl>
              <Textarea 
                {...register('bio')}
                placeholder="Share a little about yourself, your interests, expertise, or what you're looking for..."
                className="min-h-32"
              />
            </FormControl>
            {errors.bio && (
              <FormMessage>{errors.bio.message as string}</FormMessage>
            )}
          </FormItem>
        )}
      />
      
      <FormField
        name="location"
        control={undefined}
        render={() => (
          <FormItem>
            <FormLabel>Location</FormLabel>
            <FormDescription>
              Where are you based?
            </FormDescription>
            <FormControl>
              <Input 
                {...register('location')}
                placeholder="City, State, Country" 
              />
            </FormControl>
            {errors.location && (
              <FormMessage>{errors.location.message as string}</FormMessage>
            )}
          </FormItem>
        )}
      />
    </div>
  );
};

export default BioStep;
