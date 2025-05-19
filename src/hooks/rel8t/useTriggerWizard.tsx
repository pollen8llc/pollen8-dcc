
import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { createTrigger, RecurrencePattern } from "@/services/rel8t/triggerService";
import { TIME_TRIGGER_TYPES, TRIGGER_ACTIONS } from "@/services/rel8t/triggerService";

export interface TriggerFormData {
  name: string;
  description: string;
  isActive: boolean;
  condition: string;
  action: string;
  executionDate: Date | null;
  recurrenceType: string | null;
  recurrencePattern: RecurrencePattern | null;
}

export function useTriggerWizard() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<TriggerFormData>({
    name: "",
    description: "",
    isActive: true,
    condition: TIME_TRIGGER_TYPES.DAILY,
    action: TRIGGER_ACTIONS.SEND_EMAIL,
    executionDate: new Date(),
    recurrenceType: null,
    recurrencePattern: null
  });

  // Update form data with partial updates
  const updateFormData = useCallback((data: Partial<TriggerFormData>) => {
    console.log("Updating form data:", data);
    setFormData(prev => ({ ...prev, ...data }));
  }, []);

  // Move to next step
  const handleNextStep = useCallback(() => {
    console.log(`Moving from step ${currentStep} to ${currentStep + 1}`);
    setCurrentStep(currentStep + 1);
  }, [currentStep]);

  // Move to previous step
  const handlePreviousStep = useCallback(() => {
    console.log(`Moving from step ${currentStep} to ${currentStep - 1}`);
    setCurrentStep(Math.max(1, currentStep - 1));
  }, [currentStep]);
  
  // Navigate to a specific step
  const navigateToStep = useCallback((step: number) => {
    console.log(`Directly navigating to step ${step} from ${currentStep}`);
    setCurrentStep(step);
  }, [currentStep]);

  // Submit the form data
  const handleSubmit = useCallback(async () => {
    try {
      console.log("Submitting trigger with data:", formData);
      
      // Transform form data to the format expected by the API
      const triggerData = {
        name: formData.name,
        description: formData.description,
        is_active: formData.isActive,
        condition: formData.condition,
        action: formData.action,
        execution_time: formData.executionDate ? formData.executionDate.toISOString() : undefined,
        recurrence_pattern: formData.recurrencePattern
      };
      
      const result = await createTrigger(triggerData);
      
      if (result) {
        toast({
          title: "Trigger created successfully",
          description: "Your automation trigger has been created."
        });
        
        // Navigate back to settings page
        navigate("/rel8/settings");
      }
    } catch (error) {
      console.error("Error creating trigger:", error);
      toast({
        title: "Failed to create trigger",
        description: "There was an error creating your trigger. Please try again.",
        variant: "destructive"
      });
    }
  }, [formData, navigate]);

  return {
    currentStep,
    formData,
    handleNextStep,
    handlePreviousStep,
    updateFormData,
    handleSubmit,
    navigateToStep,
    triggerTypes: TIME_TRIGGER_TYPES,
    actionTypes: TRIGGER_ACTIONS
  };
}
