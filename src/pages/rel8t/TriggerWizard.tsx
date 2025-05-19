
import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Steps } from "@/components/ui/steps";
import { Rel8Navigation } from "@/components/rel8t/Rel8TNavigation";
import { ArrowLeft } from "lucide-react";
import { useTriggerWizard } from "@/hooks/rel8t/useTriggerWizard";

// Import wizard steps
import BasicInfoStep from "@/components/rel8t/triggers/wizard-steps/BasicInfoStep";
import BehaviorStep from "@/components/rel8t/triggers/wizard-steps/BehaviorStep";
import ScheduleStep from "@/components/rel8t/triggers/wizard-steps/ScheduleStep";

const TriggerWizard = () => {
  const navigate = useNavigate();
  const {
    currentStep,
    nextStep, 
    prevStep, 
    triggerData,
    updateTriggerData,
    saveTrigger,
    isScheduleRequired,
    isValid,
  } = useTriggerWizard();

  const goBack = () => {
    navigate("/rel8/settings");
  };

  // Define wizard steps - removed Review step
  const steps = [
    "Basic Info",
    "Behavior",
    isScheduleRequired ? "Schedule" : null,
  ].filter(Boolean) as string[];

  // Determine if the next button should be disabled
  const isNextDisabled = !isValid();
  
  // Is this the final step?
  const isFinalStep = currentStep === (isScheduleRequired ? 3 : 2);

  // Calculate the current content based on the step
  const renderContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <BasicInfoStep 
            triggerData={triggerData} 
            updateTriggerData={updateTriggerData} 
          />
        );
      case 2:
        return (
          <BehaviorStep 
            triggerData={triggerData} 
            updateTriggerData={updateTriggerData} 
          />
        );
      case 3:
        if (isScheduleRequired) {
          return (
            <ScheduleStep 
              triggerData={triggerData} 
              updateTriggerData={updateTriggerData} 
            />
          );
        }
        return null;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <Rel8Navigation />

        <div className="flex flex-wrap items-center justify-between gap-4 mb-6 mt-6">
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={goBack}
              className="mr-2"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-3xl font-bold">Create Automation Trigger</h1>
          </div>
        </div>

        <Card className="mb-8">
          <CardContent className="pt-6">
            <Steps currentStep={currentStep} steps={steps} className="mb-8" />

            <div className="mt-8">
              {renderContent()}

              <div className="flex justify-between mt-8">
                <Button
                  variant="outline"
                  onClick={currentStep === 1 ? goBack : prevStep}
                >
                  {currentStep === 1 ? "Cancel" : "Previous"}
                </Button>

                {isFinalStep ? (
                  <Button 
                    variant="default" 
                    onClick={saveTrigger} 
                    disabled={isNextDisabled}
                  >
                    Create Trigger
                  </Button>
                ) : (
                  <Button 
                    onClick={nextStep} 
                    disabled={isNextDisabled}
                    variant={isNextDisabled ? "outline" : "default"}
                  >
                    Next
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TriggerWizard;
