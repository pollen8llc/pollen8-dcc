
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useUser } from '@/contexts/UserContext';
import { useToast } from "@/hooks/use-toast";
import { useForm } from 'react-hook-form';
import { supabase } from '@/integrations/supabase/client';
import { Steps } from '@/components/ui/steps';

// Import step components
import BasicInfoStep from './steps/BasicInfoStep';
import BioStep from './steps/BioStep';
import InterestsStep from './steps/InterestsStep';
import PrivacyStep from './steps/PrivacyStep';

const stepNames = ['Basic Info', 'Bio & Location', 'Interests', 'Privacy'];

const ProfileSetupWizard = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { currentUser, refreshUser } = useUser();
  const { toast } = useToast();
  
  const form = useForm({
    defaultValues: {
      firstName: currentUser?.name.split(' ')[0] || '',
      lastName: currentUser?.name.split(' ').slice(1).join(' ') || '',
      avatar: null as File | null,
      avatarUrl: currentUser?.imageUrl || '',
      bio: currentUser?.bio || '',
      location: '',
      interests: [] as string[],
      profileVisibility: 'connections',
      socialLinks: {} as Record<string, string>
    }
  });
  
  const handleNext = () => {
    if (currentStep < stepNames.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };
  
  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  const onSubmit = async (data: any) => {
    if (!currentUser) return;
    
    setIsSubmitting(true);
    
    try {
      // Upload avatar if provided
      let avatarUrl = data.avatarUrl;
      if (data.avatar) {
        const fileExt = data.avatar.name.split('.').pop();
        const fileName = `${currentUser.id}-${Date.now()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(fileName, data.avatar);
          
        if (uploadError) {
          console.error('Error uploading avatar:', uploadError);
          throw new Error('Failed to upload profile image');
        }
        
        // Get public URL
        const { data: publicUrl } = supabase.storage
          .from('avatars')
          .getPublicUrl(fileName);
          
        avatarUrl = publicUrl.publicUrl;
      }
      
      // Update profile in database
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          first_name: data.firstName,
          last_name: data.lastName, 
          avatar_url: avatarUrl,
          bio: data.bio,
          location: data.location,
          interests: data.interests,
          social_links: data.socialLinks,
          privacy_settings: { profile_visibility: data.profileVisibility },
          profile_complete: true,
          updated_at: new Date().toISOString()
        })
        .eq('id', currentUser.id);
        
      if (updateError) {
        console.error('Error updating profile:', updateError);
        throw new Error('Failed to update profile');
      }
      
      // Refresh user data to get the latest changes
      await refreshUser();
      
      toast({
        title: 'Profile setup complete',
        description: 'Your profile has been successfully updated.',
      });
      
      // Navigate to profile page
      navigate('/profile');
      
    } catch (error: any) {
      toast({
        title: 'Error updating profile',
        description: error.message || 'Something went wrong.',
        variant: 'destructive',
      });
      
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <BasicInfoStep form={form} />;
      case 1:
        return <BioStep form={form} />;
      case 2:
        return <InterestsStep form={form} />;
      case 3:
        return <PrivacyStep form={form} />;
      default:
        return null;
    }
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl">Complete Your Profile</CardTitle>
        <CardDescription className="mb-4">
          Step {currentStep + 1} of {stepNames.length}
        </CardDescription>
        <Steps 
          steps={stepNames} 
          currentStep={currentStep}
          className="mt-2"
        />
      </CardHeader>
      
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          {renderStep()}
        </form>
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <Button 
          type="button" 
          variant="outline" 
          onClick={handleBack}
          disabled={currentStep === 0 || isSubmitting}
        >
          Back
        </Button>
        
        {currentStep < stepNames.length - 1 ? (
          <Button type="button" onClick={handleNext}>
            Next
          </Button>
        ) : (
          <Button 
            type="submit" 
            onClick={form.handleSubmit(onSubmit)}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : 'Complete Setup'}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default ProfileSetupWizard;
