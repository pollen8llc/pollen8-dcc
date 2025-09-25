
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Camera } from 'lucide-react';
import SocialLinksInput from './SocialLinksInput';

const BasicInfoStep = () => {
  const { register, watch, setValue, formState: { errors } } = useFormContext();
  
  // Avatar display only (no upload)
  const avatarUrl = "";
  const firstName = watch('firstName');
  const lastName = watch('lastName');

  const handleFileChange = () => {
    // Avatar upload removed - using dynamic avatars only
  };
  
  // Get avatar fallback (initials) based on current form values
  const getInitials = () => {
    const firstChar = firstName ? firstName[0] : '';
    const lastChar = lastName ? lastName[0] : '';
    
    return (firstChar + lastChar).toUpperCase();
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center">
        <div className="relative mb-4">
          <Avatar className="h-24 w-24">
            <AvatarFallback useDynamicAvatar={true}>{getInitials()}</AvatarFallback>
          </Avatar>
        </div>
        
        <p className="text-sm text-muted-foreground mb-4">
          Your avatar is managed through the dynamic avatar system
        </p>
      </div>
      
      <FormField
        name="firstName"
        control={undefined}
        render={() => (
          <FormItem>
            <FormLabel>First Name</FormLabel>
            <FormControl>
              <Input 
                {...register('firstName', { 
                  required: "First name is required" 
                })} 
                placeholder="Enter your first name" 
              />
            </FormControl>
            {errors.firstName && (
              <FormMessage>{errors.firstName.message as string}</FormMessage>
            )}
          </FormItem>
        )}
      />
      
      <FormField
        name="lastName"
        control={undefined}
        render={() => (
          <FormItem>
            <FormLabel>Last Name</FormLabel>
            <FormControl>
              <Input 
                {...register('lastName', { 
                  required: "Last name is required" 
                })} 
                placeholder="Enter your last name" 
              />
            </FormControl>
            {errors.lastName && (
              <FormMessage>{errors.lastName.message as string}</FormMessage>
            )}
          </FormItem>
        )}
      />
      
      <FormField
        name="phone"
        control={undefined}
        render={() => (
          <FormItem>
            <FormLabel>Phone Number</FormLabel>
            <FormControl>
              <Input 
                {...register('phone')} 
                placeholder="Enter your phone number" 
                type="tel"
              />
            </FormControl>
            {errors.phone && (
              <FormMessage>{errors.phone.message as string}</FormMessage>
            )}
          </FormItem>
        )}
      />
      
      <FormField
        name="website"
        control={undefined}
        render={() => (
          <FormItem>
            <FormLabel>Website</FormLabel>
            <FormControl>
              <Input 
                {...register('website')} 
                placeholder="Enter your website URL" 
                type="url"
              />
            </FormControl>
            {errors.website && (
              <FormMessage>{errors.website.message as string}</FormMessage>
            )}
          </FormItem>
        )}
      />
      
      <SocialLinksInput />
    </div>
  );
};

export default BasicInfoStep;
