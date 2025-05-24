import Navbar from "@/components/Navbar";
import { Rel8Navigation } from "@/components/rel8t/Rel8TNavigation";
import { Card, CardContent } from "@/components/ui/card";
import { Step, Steps } from "@/components/ui/steps";
import { useTriggerWizard, TriggerFormData } from "@/hooks/rel8t/useTriggerWizard";
import { BasicInfoStep } from "@/components/rel8t/triggers/wizard-steps/BasicInfoStep";
import { BehaviorStep } from "@/components/rel8t/triggers/wizard-steps/BehaviorStep";
import { ScheduleStep } from "@/components/rel8t/triggers/wizard-steps/ScheduleStep";
import { ReviewStep } from "@/components/rel8t/triggers/wizard-steps/ReviewStep";
import { FormProvider, useForm } from "react-hook-form";
import { Shell } from "@/components/layout/Shell";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const TriggerWizard = () => {
  const navigate = useNavigate();
  // Get trigger wizard state and functions
  const { 
    currentStep, 
    formData, 
    updateFormData, 
    navigateToStep, 
    handleSubmit: submitTrigger,
    handleNextStep
  } = useTriggerWizard();

  // Initialize react-hook-form with our existing form data
  const methods = useForm<TriggerFormData>({
    defaultValues: formData,
    mode: "onBlur" // Validate on blur instead of onChange to prevent rapid validations
  });

  // Update our custom state when form values change
  useEffect(() => {
    const subscription = methods.watch((values) => {
      if (values) {
        updateFormData(values as Partial<TriggerFormData>);
      }
    });
    
    return () => subscription.unsubscribe();
  }, [methods, updateFormData]);

  // Handle form submission
  const onSubmit = (data: TriggerFormData) => {
    console.log("Form submitted with data:", data);
    // Update our form data first
    updateFormData(data);
    // Then trigger the submission
    submitTrigger();
  };

  return (
    <Shell>
      <div className="container mx-auto px-4 py-8">
        <Rel8Navigation />
        
        <div className="flex justify-between items-center mt-6 mb-8">
          <div>
            <h1 className="text-3xl font-bold">Create Automation Trigger</h1>
            <p className="text-muted-foreground mt-1">
              Set up automated actions based on specific events or schedules
            </p>
          </div>
        </div>

        <Card className="mb-6">
          <CardContent className="p-6">
            <Steps currentStep={currentStep} className="mb-8">
              <Step title="Basic Info" />
              <Step title="Behavior" />
              <Step title="Schedule" />
              <Step title="Review" />
            </Steps>

            {/* Wrap everything in FormProvider */}
            <FormProvider {...methods}>
              <form onSubmit={methods.handleSubmit(onSubmit)}>
                {currentStep === 1 && (
                  <BasicInfoStep
                    validateAndNext={async () => {
                      const valid = await methods.trigger(['name']);
                      if (valid) handleNextStep();
                    }}
                  />
                )}
                {currentStep === 2 && (
                  <BehaviorStep
                    validateAndNext={async () => {
                      const valid = await methods.trigger(['condition', 'action']);
                      if (valid) handleNextStep();
                    }}
                  />
                )}
                {currentStep === 3 && (
                  <ScheduleStep
                    validateAndNext={async () => {
                      const valid = await methods.trigger(['executionDate']);
                      if (valid) handleNextStep();
                    }}
                  />
                )}
                {currentStep === 4 && <ReviewStep />}
              </form>
            </FormProvider>
          </CardContent>
        </Card>
      </div>
    </Shell>
  );
};

export default TriggerWizard;
