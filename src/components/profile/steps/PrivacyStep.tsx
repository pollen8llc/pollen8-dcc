
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormDescription } from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Globe, Users, Lock } from 'lucide-react';

const PrivacyStep = () => {
  const { setValue, watch } = useFormContext();
  
  const profileVisibility = watch('profileVisibility');
  
  return (
    <div className="space-y-6">
      <FormField
        name="profileVisibility"
        control={undefined}
        render={() => (
          <FormItem>
            <FormLabel>Profile Visibility</FormLabel>
            <FormDescription>
              Control who can view your profile
            </FormDescription>
            <FormControl>
              <RadioGroup 
                value={profileVisibility} 
                onValueChange={(value) => setValue('profileVisibility', value)}
                className="space-y-4 mt-2"
              >
                <div className="flex items-center space-x-3 space-y-0">
                  <RadioGroupItem value="public" id="visibility-public" />
                  <Label htmlFor="visibility-public" className="flex items-center gap-2 font-normal cursor-pointer">
                    <div className="p-1 rounded-full bg-blue-100">
                      <Globe className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <div>Public</div>
                      <p className="text-sm text-muted-foreground">Anyone can view your profile</p>
                    </div>
                  </Label>
                </div>
                
                <div className="flex items-center space-x-3 space-y-0">
                  <RadioGroupItem value="connections" id="visibility-connections" />
                  <Label htmlFor="visibility-connections" className="flex items-center gap-2 font-normal cursor-pointer">
                    <div className="p-1 rounded-full bg-green-100">
                      <Users className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <div>Connections</div>
                      <p className="text-sm text-muted-foreground">Only your connections can view your profile</p>
                    </div>
                  </Label>
                </div>
                
                <div className="flex items-center space-x-3 space-y-0">
                  <RadioGroupItem value="private" id="visibility-private" />
                  <Label htmlFor="visibility-private" className="flex items-center gap-2 font-normal cursor-pointer">
                    <div className="p-1 rounded-full bg-amber-100">
                      <Lock className="h-4 w-4 text-amber-600" />
                    </div>
                    <div>
                      <div>Private</div>
                      <p className="text-sm text-muted-foreground">Only you and administrators can view your profile</p>
                    </div>
                  </Label>
                </div>
              </RadioGroup>
            </FormControl>
          </FormItem>
        )}
      />
    </div>
  );
};

export default PrivacyStep;
