
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormContext } from 'react-hook-form';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Steps } from '@/components/ui/steps';
import { Loader2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Community } from '@/models/types';

// Import step components
import BasicDetailsStep from './steps/BasicDetailsStep';
import LocationFormatStep from './steps/LocationFormatStep';
import OnlinePresenceStep from './steps/OnlinePresenceStep';
import AdditionalDetailsStep from './steps/AdditionalDetailsStep';

interface UnifiedCommunityFormProps {
  mode: 'setup' | 'edit';
  community?: Community;
  onComplete?: () => void;
  onCancel?: () => void;
}

const UnifiedCommunityForm = ({ mode, community, onComplete, onCancel }: UnifiedCommunityFormProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [activeTab, setActiveTab] = useState("basic");
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Use the form context from the parent
  const form = useFormContext();
  const { formState: { isSubmitting } } = form;
  
  const stepNames = ['Basic Details', 'Location & Format', 'Online Presence', 'Additional Details'];
  
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
        return <BasicDetailsStep />;
      case 1:
        return <LocationFormatStep />;
      case 2:
        return <OnlinePresenceStep />;
      case 3:
        return <AdditionalDetailsStep />;
      default:
        return null;
    }
  };
  
  const renderTabContent = () => {
    switch (activeTab) {
      case "basic":
        return <BasicDetailsStep />;
      case "location":
        return <LocationFormatStep />;
      case "online":
        return <OnlinePresenceStep />;
      case "additional":
        return <AdditionalDetailsStep />;
      default:
        return null;
    }
  };
  
  // Setup mode with steps
  if (mode === 'setup') {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-2xl">Create Your Community</CardTitle>
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
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Community'
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
        <CardTitle>Edit Community</CardTitle>
        <CardDescription>
          Update your community information and settings
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="basic">Basic Details</TabsTrigger>
            <TabsTrigger value="location">Location & Format</TabsTrigger>
            <TabsTrigger value="online">Online Presence</TabsTrigger>
            <TabsTrigger value="additional">Additional Info</TabsTrigger>
          </TabsList>
          
          <div className="mt-6">
            {renderTabContent()}
          </div>
        </Tabs>
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onCancel || (() => navigate(-1))}>
          Cancel
        </Button>
        <Button 
          type="submit"
          disabled={isSubmitting}
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

export default UnifiedCommunityForm;
