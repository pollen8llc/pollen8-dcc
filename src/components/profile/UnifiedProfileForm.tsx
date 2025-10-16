import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormContext } from 'react-hook-form';
import { useUser } from "@/contexts/UserContext";
import { useProfiles } from "@/hooks/useProfiles";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Steps } from '@/components/ui/steps';
import { Loader2, User, FileText, Heart, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';
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
    
    console.log("UnifiedProfileForm: Form data being submitted:", data);
    console.log("UnifiedProfileForm: Social links in form data:", data.social_links);
    
    setIsSubmitting(true);
    
    try {
      
      // Update profile data
      try {
        const profileData = {
          id: currentUser.id,
          first_name: data.firstName,
          last_name: data.lastName,
          bio: data.bio,
          location: data.location,
          interests: data.interests,
          social_links: data.social_links || {},
          privacy_settings: { profile_visibility: data.profileVisibility || 'public' },
          profile_complete: true,
          phone: data.phone,
          website: data.website,
        };
        
        console.log("UnifiedProfileForm: Profile data being sent to updateProfile:", profileData);
        console.log("UnifiedProfileForm: Social links being saved:", profileData.social_links);
        
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
  
  // Edit mode with navigation
  const navItems = [
    {
      value: "basic",
      label: "Basic Info",
      icon: User,
      iconColor: "text-blue-500"
    },
    {
      value: "bio",
      label: "Bio & Location",
      icon: FileText,
      iconColor: "text-green-500"
    },
    {
      value: "interests",
      label: "Interests",
      icon: Heart,
      iconColor: "text-pink-500"
    },
    {
      value: "privacy",
      label: "Privacy",
      icon: Lock,
      iconColor: "text-orange-500"
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit Profile</CardTitle>
        <CardDescription>
          Update your profile information and privacy settings
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {/* Navigation Bar */}
        <nav className="flex items-center gap-2 p-2 backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl shadow-lg mb-6">
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-4 gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => setActiveTab(item.value)}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-xl transition-all duration-200",
                    "hover:scale-105 hover:shadow-[#00eada]/20",
                    activeTab === item.value
                      ? "bg-white/10 border border-white/20 text-foreground shadow-lg"
                      : "bg-white/5 border border-white/5 text-muted-foreground hover:bg-white/10 hover:border-white/15"
                  )}
                >
                  <Icon className={cn("h-4 w-4", item.iconColor)} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </nav>
        
        {/* Content Area */}
        <div className="mt-6">
          <form id="profile-form" onSubmit={form.handleSubmit(onSubmit)}>
            {renderTabContent()}
          </form>
        </div>
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
