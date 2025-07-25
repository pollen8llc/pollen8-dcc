
import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { createTrigger } from "@/services/rel8t/triggerService";
import { useRelationshipWizard } from "@/contexts/RelationshipWizardContext";

export interface SimpleTriggerFormData {
  name: string;
  triggerDate: Date | null;
  triggerTime: string;
  frequency: string;
  priority: string;
}

export function useTriggerWizard() {
  const navigate = useNavigate();
  const { setSelectedTrigger } = useRelationshipWizard();
  const [formData, setFormData] = useState<SimpleTriggerFormData>({
    name: "",
    triggerDate: new Date(),
    triggerTime: "09:00",
    frequency: "daily",
    priority: "medium"
  });

  // Update form data with partial updates
  const updateFormData = useCallback((data: Partial<SimpleTriggerFormData>) => {
    console.log("Updating form data:", data);
    setFormData(prev => ({ ...prev, ...data }));
  }, []);

  // Submit the form data and return the created trigger
  const handleSubmit = useCallback(async (returnTo?: string) => {
    try {
      console.log("Submitting trigger with data:", formData);
      
      // Combine date and time into a single datetime
      let executionTime: string | undefined;
      if (formData.triggerDate && formData.triggerTime) {
        const [hours, minutes] = formData.triggerTime.split(':');
        const combinedDateTime = new Date(formData.triggerDate);
        combinedDateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
        executionTime = combinedDateTime.toISOString();
      }
      
      // Transform simple form data to the format expected by the API
      const triggerData = {
        name: formData.name,
        description: `${formData.frequency} trigger with ${formData.priority} priority at ${formData.triggerTime}`,
        is_active: true,
        condition: formData.frequency,
        action: "send_email",
        execution_time: executionTime,
        recurrence_pattern: {
          type: formData.frequency,
          startDate: executionTime || new Date().toISOString()
        }
      };
      
      const result = await createTrigger(triggerData);
      
      if (result) {
        toast({
          title: "Trigger created successfully",
          description: "Your automation trigger has been created."
        });
        
        // If returning to relationship wizard, store trigger in context
        if (returnTo === 'relationship') {
          setSelectedTrigger(result);
        }
        
        return result; // Return the created trigger
      }
      
      return null;
    } catch (error) {
      console.error("Error creating trigger:", error);
      toast({
        title: "Failed to create trigger",
        description: "There was an error creating your trigger. Please try again.",
        variant: "destructive"
      });
      return null;
    }
  }, [formData, setSelectedTrigger]);

  return {
    formData,
    updateFormData,
    handleSubmit,
    frequencyOptions: [
      { value: "onetime", label: "One Time" },
      { value: "daily", label: "Daily" },
      { value: "monthly", label: "Monthly" },
      { value: "weekly", label: "Weekly" }
    ],
    priorityOptions: [
      { value: "low", label: "Low" },
      { value: "medium", label: "Medium" },
      { value: "high", label: "High" }
    ]
  };
}
