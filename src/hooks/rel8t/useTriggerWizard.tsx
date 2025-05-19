
import { useState } from "react";
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

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateBasicInfo = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = "Trigger name is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateBehavior = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.condition) {
      newErrors.condition = "Trigger condition is required";
    }
    
    if (!formData.action) {
      newErrors.action = "Trigger action is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateSchedule = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.executionDate) {
      newErrors.executionDate = "Execution date is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    let isValid = false;
    
    switch (currentStep) {
      case 1:
        isValid = validateBasicInfo();
        break;
      case 2:
        isValid = validateBehavior();
        break;
      case 3:
        isValid = validateSchedule();
        break;
      default:
        isValid = true;
    }
    
    if (isValid) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePreviousStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const updateFormData = (data: Partial<TriggerFormData>) => {
    setFormData(prev => ({ ...prev, ...data }));
  };
  
  // Add a new function to navigate to a specific step
  const navigateToStep = (step: number) => {
    setCurrentStep(step);
  };

  const handleSubmit = async () => {
    try {
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
  };

  return {
    currentStep,
    formData,
    errors,
    handleNextStep,
    handlePreviousStep,
    updateFormData,
    handleSubmit,
    navigateToStep, // Export the new function
    triggerTypes: TIME_TRIGGER_TYPES,
    actionTypes: TRIGGER_ACTIONS
  };
}
