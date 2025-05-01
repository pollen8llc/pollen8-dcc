
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useProfiles } from "@/hooks/useProfiles";
import { useUser } from "@/contexts/UserContext";
import { Loader2 } from "lucide-react";
import { Steps } from "@/components/ui/steps";
import BasicInfoStep from "./wizard-steps/BasicInfoStep";
import LocationInterestsStep from "./wizard-steps/LocationInterestsStep";
import SocialLinksStep from "./wizard-steps/SocialLinksStep";
import PrivacySettingsStep from "./wizard-steps/PrivacySettingsStep";
import ReviewCompleteStep from "./wizard-steps/ReviewCompleteStep";
import { ExtendedProfile } from "@/services/profileService";

const ProfileSetupWizard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { currentUser, refreshUser } = useUser();
  const { updateProfile, isLoading } = useProfiles();
  
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Partial<ExtendedProfile>>({
    first_name: currentUser?.name?.split(' ')[0] || '',
    last_name: currentUser?.name?.split(' ').slice(1).join(' ') || '',
    avatar_url: currentUser?.imageUrl || '',
    bio: '',
    location: '',
    interests: [],
    social_links: {},
    privacy_settings: { profile_visibility: "connections" },
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!currentUser) {
    return null;
  }

  const steps = ["Basic Info", "Location & Interests", "Social Links", "Privacy", "Complete"];

  const handleNext = () => {
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const handleUpdateFormData = (data: Partial<ExtendedProfile>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Mark profile as complete
      const dataToUpdate = {
        ...formData,
        id: currentUser.id,
        profile_complete: true,
      };
      
      const updatedProfile = await updateProfile(dataToUpdate);
      
      if (updatedProfile) {
        // Refresh user context
        await refreshUser();
        
        toast({
          title: "Profile setup complete",
          description: "Your profile has been successfully created.",
        });
        
        // Redirect to profile page
        navigate(`/profile/${currentUser.id}`);
      } else {
        throw new Error("Failed to update profile");
      }
    } catch (error) {
      console.error("Error completing profile setup:", error);
      toast({
        title: "Error",
        description: "Failed to complete profile setup. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return <BasicInfoStep formData={formData} updateFormData={handleUpdateFormData} />;
      case 1:
        return <LocationInterestsStep formData={formData} updateFormData={handleUpdateFormData} />;
      case 2:
        return <SocialLinksStep formData={formData} updateFormData={handleUpdateFormData} />;
      case 3:
        return <PrivacySettingsStep formData={formData} updateFormData={handleUpdateFormData} />;
      case 4:
        return <ReviewCompleteStep formData={formData} />;
      default:
        return null;
    }
  };

  const isLastStep = currentStep === steps.length - 1;

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Complete Your Profile</CardTitle>
        <CardDescription>
          Please complete your profile to get the most out of our platform.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-8">
          <Steps currentStep={currentStep} steps={steps} />
        </div>
        
        {renderStepContent()}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={handleBack} 
          disabled={currentStep === 0 || isSubmitting}
        >
          Back
        </Button>
        
        <div>
          {isLastStep ? (
            <Button 
              onClick={handleSubmit} 
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Completing...
                </>
              ) : (
                "Complete Setup"
              )}
            </Button>
          ) : (
            <Button onClick={handleNext}>
              Next Step
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default ProfileSetupWizard;
