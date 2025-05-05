
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface PrivacyStepProps {
  form: UseFormReturn<any>;
}

const PrivacyStep = ({ form }: PrivacyStepProps) => {
  return (
    <div className="space-y-6">
      <FormField
        control={form.control}
        name="profileVisibility"
        render={({ field }) => (
          <FormItem className="space-y-3">
            <FormLabel>Profile Visibility</FormLabel>
            <FormDescription>
              Choose who can view your profile information
            </FormDescription>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                value={field.value}
                className="space-y-1"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="public" id="public" />
                  <Label htmlFor="public">Public - Anyone can view your profile</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="connections" id="connections" />
                  <Label htmlFor="connections">Connections - Only your direct connections can view your profile</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="connections2" id="connections2" />
                  <Label htmlFor="connections2">Extended Network - Your connections and their connections</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="private" id="private" />
                  <Label htmlFor="private">Private - Only you can view your profile</Label>
                </div>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <p className="text-sm text-muted-foreground">
        You can change your privacy settings at any time from your profile page.
      </p>
    </div>
  );
};

export default PrivacyStep;
