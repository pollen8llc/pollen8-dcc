import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormContext } from 'react-hook-form';
import { useUser } from "@/contexts/UserContext";
import { useProfiles } from "@/hooks/useProfiles";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Steps } from '@/components/ui/steps';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

// Import step components
import BasicInfoStep from './steps/BasicInfoStep';
import BioStep from './steps/BioStep';
import InterestsStep from './steps/InterestsStep';
import PrivacyStep from './steps/PrivacyStep';

interface UnifiedProfileFormProps {
  mode: 'setup' | 'edit';
  existingData?: any;
  onComplete?: () => void;
}

const UnifiedProfileForm = ({ mode, existingData, onComplete }: UnifiedProfileFormProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("basic");
  const navigate = useNavigate();
  const { currentUser, refreshUser } = useUser();
  const { updateProfile } = useProfiles();
  const { toast } = useToast();
  
  // Instead of creating a new form instance, we use the parent's form context
  const form = useFormContext();
  
  const stepNames = ['Basic Info', 'Bio & Location', 'Interests', 'Privacy'];
  
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

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return <BasicInfoStep />;
      case 1:
        return <BioStep />;
      case 2:
        return <InterestsStep />;
      case 3:
        return <PrivacyStep />;
      default:
        return null;
    }
  };
  
  const renderTabContent = () => {
    switch (activeTab) {
      case "basic":
        return <BasicInfoStep />;
      case "bio":
        return <BioStep />;
      case "interests":
        return <InterestsStep />;
      case "privacy":
        return <PrivacyStep />;
      default:
        return null;
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
        
        try {
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
        } catch (error) {
          console.error('Error in avatar upload:', error);
          // Continue with profile update even if avatar upload fails
        }
      }
      
      // Update profile data
      try {
        const profileData = {
          id: currentUser.id,
          first_name: data.firstName,
          last_name: data.lastName,
          avatar_url: avatarUrl,
          bio: data.bio,
          location: data.location,
          interests: data.interests,
          social_links: data.socialLinks,
          privacy_settings: { profile_visibility: data.profileVisibility || 'public' },
          profile_complete: true,
        };
        
        await updateProfile(profileData);
      } catch (profileError) {
        console.error('Error updating profile data:', profileError);
        throw new Error('Failed to update profile information');
      }
      
      try {
        // Refresh user data
        await refreshUser();
      } catch (refreshError) {
        console.error('Error refreshing user data:', refreshError);
        // Continue with flow even if refresh fails
      }
      
      toast({
        title: mode === 'setup' ? 'Profile setup complete' : 'Profile updated',
        description: 'Your profile has been successfully updated.',
      });
      
      // Handle completion
      if (onComplete) {
        onComplete();
      } else {
        // Navigate based on mode
        navigate('/profile');
      }
      
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
  
  // Different layouts based on mode
  if (mode === 'setup') {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-2xl">Complete Your Profile</CardTitle>
          <CardDescription className="mb-4">
            Step {currentStep + 1} of {stepNames.length}
          </CardDescription>
          <Steps 
            currentStep={currentStep + 1}
            className="mt-2"
            steps={stepNames}
          />
        </CardHeader>
        
        <CardContent>
          {renderStepContent()}
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
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Complete Setup'
              )}
            </Button>
          )}
        </CardFooter>
      </Card>
    );
  }
  
  // Edit mode with tabs
  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit Profile</CardTitle>
        <CardDescription>
          Update your profile information and privacy settings
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="bio">Bio & Location</TabsTrigger>
            <TabsTrigger value="interests">Interests</TabsTrigger>
            <TabsTrigger value="privacy">Privacy</TabsTrigger>
          </TabsList>
          
          <div className="mt-6">
            <form id="profile-form" onSubmit={form.handleSubmit(onSubmit)}>
              {renderTabContent()}
            </form>
          </div>
        </Tabs>
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={() => navigate('/profile')}>
          Cancel
        </Button>
        <Button 
          onClick={form.handleSubmit(onSubmit)}
          disabled={isSubmitting}
          form="profile-form"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            'Save Changes'
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default UnifiedProfileForm;
