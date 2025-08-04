
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Camera } from 'lucide-react';

const BasicInfoStep = () => {
  const { register, watch, setValue, formState: { errors } } = useFormContext();
  
  const avatarUrl = watch('avatarUrl');
  const firstName = watch('firstName');
  const lastName = watch('lastName');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue('avatar', file);
      
      // Create a preview URL for the selected image
      const fileUrl = URL.createObjectURL(file);
      setValue('avatarUrl', fileUrl);
    }
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
            <AvatarImage src={avatarUrl} />
            <AvatarFallback>{getInitials()}</AvatarFallback>
          </Avatar>
          
          <label htmlFor="avatar-upload" className="absolute -bottom-2 -right-2 p-1 rounded-full bg-primary text-white cursor-pointer">
            <Camera className="h-4 w-4" />
            <input 
              id="avatar-upload" 
              type="file" 
              accept="image/*"
              className="sr-only"
              onChange={handleFileChange}
            />
          </label>
        </div>
        
        <p className="text-sm text-muted-foreground mb-4">
          Upload a profile picture to make your profile more personable
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
    </div>
  );
};

export default BasicInfoStep;
