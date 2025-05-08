
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/contexts/UserContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import BasicInfoStep from "./wizard-steps/BasicInfoStep";
import LocationInterestsStep from "./wizard-steps/LocationInterestsStep";
import SocialLinksStep from "./wizard-steps/SocialLinksStep";
import PrivacySettingsStep from "./wizard-steps/PrivacySettingsStep";
import ReviewCompleteStep from "./wizard-steps/ReviewCompleteStep";
import { ChevronLeft, ChevronRight, CheckCircle2, UserCircle, MapPin, Share2, Shield, FileCheck } from "lucide-react";
import { FormProvider, useForm } from "react-hook-form";

type WizardStep = {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  component: React.FC<any>;
};

const ProfileSetupWizard = () => {
  const navigate = useNavigate();
  const { currentUser, refreshUser } = useUser();
  const [currentStep, setCurrentStep] = useState<string>("basic-info");
  const [completed, setCompleted] = useState<Set<string>>(new Set());

  // Create the form context
  const methods = useForm({
    defaultValues: {
      firstName: currentUser?.name?.split(' ')[0] || '',
      lastName: currentUser?.name?.split(' ').slice(1).join(' ') || '',
      avatarUrl: currentUser?.imageUrl || '',
      avatar: null,
      bio: currentUser?.bio || '',
      location: '',
      interests: [] as string[],
      profileVisibility: 'public', // Default to public for discoverability
      socialLinks: {} as Record<string, string>
    }
  });

  // Define wizard steps
  const steps: WizardStep[] = [
    {
      id: "basic-info",
      title: "Basic Information",
      description: "Your name and profile picture",
      icon: UserCircle,
      component: BasicInfoStep
    },
    {
      id: "location-interests",
      title: "Location & Interests",
      description: "Where you're based and what you're into",
      icon: MapPin,
      component: LocationInterestsStep
    },
    {
      id: "social-links",
      title: "Social Links",
      description: "Connect your online presence",
      icon: Share2,
      component: SocialLinksStep
    },
    {
      id: "privacy",
      title: "Privacy Settings",
      description: "Control your profile visibility",
      icon: Shield,
      component: PrivacySettingsStep
    },
    {
      id: "review",
      title: "Review & Complete",
      description: "Finalize your profile",
      icon: FileCheck,
      component: ReviewCompleteStep
    }
  ];

  // Navigation functions
  const goToNextStep = () => {
    const currentIndex = steps.findIndex(step => step.id === currentStep);
    if (currentIndex < steps.length - 1) {
      const nextStepId = steps[currentIndex + 1].id;
      setCompleted(prev => new Set([...prev, currentStep]));
      setCurrentStep(nextStepId);
    }
  };

  const goToPreviousStep = () => {
    const currentIndex = steps.findIndex(step => step.id === currentStep);
    if (currentIndex > 0) {
      const prevStepId = steps[currentIndex - 1].id;
      setCurrentStep(prevStepId);
    }
  };

  const handleCompleteSetup = async () => {
    try {
      // Get all form data
      const formData = methods.getValues();
      
      // Format data for API
      const profileData = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        bio: formData.bio,
        location: formData.location,
        avatar_url: formData.avatarUrl,
        interests: formData.interests,
        privacy_settings: {
          profile_visibility: formData.profileVisibility
        },
        social_links: formData.socialLinks,
        profile_complete: true
      };

      // TODO: Save profile data to API
      console.log("Saving profile data:", profileData);

      // Refresh user data and navigate to profile
      await refreshUser();
      navigate("/profile");
    } catch (error) {
      console.error("Error saving profile:", error);
    }
  };

  // Get current step component
  const currentStepData = steps.find(step => step.id === currentStep) || steps[0];
  const StepComponent = currentStepData.component;
  const isFirstStep = currentStep === steps[0].id;
  const isLastStep = currentStep === steps[steps.length - 1].id;

  return (
    <FormProvider {...methods}>
      <div className="max-w-4xl mx-auto">
        <Card className="mb-6">
          <CardContent className="p-6">
            <Tabs value={currentStep} onValueChange={setCurrentStep} className="w-full">
              <TabsList className="grid grid-cols-5 mb-8">
                {steps.map(step => {
                  const isCompleted = completed.has(step.id);
                  const isActive = currentStep === step.id;
                  
                  return (
                    <TabsTrigger 
                      key={step.id} 
                      value={step.id}
                      className={`flex flex-col items-center p-2 h-auto data-[state=active]:shadow-none ${
                        isCompleted ? 'text-green-500' : ''
                      }`}
                    >
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted mb-1">
                        {isCompleted ? (
                          <CheckCircle2 className="h-5 w-5 text-green-500" />
                        ) : (
                          <step.icon className="h-5 w-5" />
                        )}
                      </div>
                      <span className="text-xs font-medium hidden md:block">{step.title}</span>
                    </TabsTrigger>
                  );
                })}
              </TabsList>

              <div className="mb-6">
                <h2 className="text-xl font-semibold">{currentStepData.title}</h2>
                <p className="text-muted-foreground">{currentStepData.description}</p>
              </div>
              
              <Separator className="my-6" />
              
              {steps.map(step => (
                <TabsContent key={step.id} value={step.id} className="mt-0">
                  <StepComponent form={methods} />
                </TabsContent>
              ))}
              
              <Separator className="my-6" />
              
              <div className="flex justify-between items-center mt-6">
                <Button
                  variant="outline"
                  onClick={goToPreviousStep}
                  disabled={isFirstStep}
                >
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Previous
                </Button>
                
                {isLastStep ? (
                  <Button onClick={handleCompleteSetup}>
                    Complete Setup
                    <CheckCircle2 className="w-4 h-4 ml-2" />
                  </Button>
                ) : (
                  <Button onClick={goToNextStep}>
                    Next
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                )}
              </div>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </FormProvider>
  );
};

export default ProfileSetupWizard;
