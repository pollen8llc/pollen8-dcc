
import React, { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { Textarea } from '@/components/ui/textarea';
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form';
import { Loc8Dialog } from '@/components/ui/loc8-dialog';
import { Loc8DialogTrigger } from '@/components/ui/loc8-dialog-trigger';

const BioStep = () => {
  const form = useFormContext();
  const [isLocationDialogOpen, setIsLocationDialogOpen] = useState(false);
  
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
              <>
                <Loc8DialogTrigger
                  value={field.value ? [field.value] : []}
                  placeholder="Select your city"
                  onClick={() => setIsLocationDialogOpen(true)}
                />
                <Loc8Dialog
                  open={isLocationDialogOpen}
                  onOpenChange={setIsLocationDialogOpen}
                  mode="single"
                  value={field.value ? [field.value] : []}
                  onValueChange={(cities) => field.onChange(cities[0] || '')}
                  title="Where are you located?"
                  description="Select your city to connect with nearby communities"
                />
              </>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
    </div>
  );
};

export default BioStep;
