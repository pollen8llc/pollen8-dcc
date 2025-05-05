
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Globe, Users, Network, Lock } from "lucide-react";

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
          <FormItem>
            <FormLabel>Who can see your profile?</FormLabel>
            <FormControl>
              <RadioGroup
                value={field.value}
                onValueChange={field.onChange}
                className="space-y-3"
              >
                <div className="flex items-center space-x-2 border rounded-md p-3 hover:bg-accent transition-colors">
                  <RadioGroupItem value="public" id="public" />
                  <Label htmlFor="public" className="flex items-center gap-2 font-normal cursor-pointer flex-1">
                    <Globe className="h-4 w-4 text-blue-500" />
                    <div>
                      <p>Everyone (Public)</p>
                      <p className="text-xs text-muted-foreground">Anyone can view your full profile</p>
                    </div>
                  </Label>
                </div>
                
                <div className="flex items-center space-x-2 border rounded-md p-3 hover:bg-accent transition-colors">
                  <RadioGroupItem value="connections" id="connections" />
                  <Label htmlFor="connections" className="flex items-center gap-2 font-normal cursor-pointer flex-1">
                    <Users className="h-4 w-4 text-green-500" />
                    <div>
                      <p>Direct Connections Only</p>
                      <p className="text-xs text-muted-foreground">Only people directly connected to you can view your profile</p>
                    </div>
                  </Label>
                </div>
                
                <div className="flex items-center space-x-2 border rounded-md p-3 hover:bg-accent transition-colors">
                  <RadioGroupItem value="connections2" id="connections2" />
                  <Label htmlFor="connections2" className="flex items-center gap-2 font-normal cursor-pointer flex-1">
                    <Network className="h-4 w-4 text-purple-500" />
                    <div>
                      <p>2nd Degree Connections</p>
                      <p className="text-xs text-muted-foreground">Your connections and their connections can view your profile</p>
                    </div>
                  </Label>
                </div>
                
                <div className="flex items-center space-x-2 border rounded-md p-3 hover:bg-accent transition-colors">
                  <RadioGroupItem value="private" id="private" />
                  <Label htmlFor="private" className="flex items-center gap-2 font-normal cursor-pointer flex-1">
                    <Lock className="h-4 w-4 text-red-500" />
                    <div>
                      <p>Only You (Private)</p>
                      <p className="text-xs text-muted-foreground">Only you can see your profile information</p>
                    </div>
                  </Label>
                </div>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default PrivacyStep;
