
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { 
  Trigger, 
  createTrigger, 
  TIME_TRIGGER_TYPES 
} from "@/services/rel8t/triggerService";

export function useTriggerWizard() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  
  // Default trigger data
  const [triggerData, setTriggerData] = useState<Partial<Trigger>>({
    name: "",
    description: "",
    condition: "",
    action: "send_email",
    is_active: true,
  });

  // Schedule-related state with defaults
  const [executionDate, setExecutionDate] = useState<Date | undefined>(undefined);
  const [executionTime, setExecutionTime] = useState<string>("12:00");
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurrenceType, setRecurrenceType] = useState("daily");

  // Check if the schedule step is required based on condition
  const isScheduleRequired = triggerData.condition === "scheduled_time" || 
    Object.values(TIME_TRIGGER_TYPES).includes(triggerData.condition as string);

  // Determine the total number of steps based on whether schedule is required
  const totalSteps = isScheduleRequired ? 3 : 2;

  // Move to the next step
  const nextStep = () => {
    if (isValid()) {
      const nextStepNumber = currentStep + 1;
      
      // Skip the schedule step if not needed
      if (nextStepNumber === 3 && !isScheduleRequired) {
        saveTrigger();
        return;
      }
      
      setCurrentStep(nextStepNumber);
      console.log(`Moving to step ${nextStepNumber} of ${totalSteps}`);
    } else {
      // Show feedback based on the current step
      if (currentStep === 1 && !triggerData.name) {
        toast({
          title: "Name required",
          description: "Please enter a name for your trigger.",
          variant: "destructive",
        });
      } else if (currentStep === 2 && !triggerData.condition) {
        toast({
          title: "Condition required",
          description: "Please select a trigger condition.",
          variant: "destructive",
        });
      } else if (currentStep === 3 && isScheduleRequired && !executionDate) {
        toast({
          title: "Date required",
          description: "Please select an execution date.",
          variant: "destructive",
        });
      }
    }
  };

  // Move to the previous step
  const prevStep = () => {
    setCurrentStep((prev) => Math.max(1, prev - 1));
  };

  // Update trigger data
  const updateTriggerData = (newData: Partial<Trigger>) => {
    console.log("Updating trigger data:", newData);
    setTriggerData((prev) => ({ ...prev, ...newData }));
  };

  // Update schedule-related data with better debug logging
  const updateScheduleData = (
    date?: Date, 
    time?: string, 
    recurring?: boolean, 
    recurrence?: string
  ) => {
    console.log("updateScheduleData called with:", { date, time, recurring, recurrence });
    
    if (date !== undefined) {
      console.log("Setting execution date:", date);
      setExecutionDate(date);
    }
    
    if (time !== undefined) {
      setExecutionTime(time);
    }
    
    if (recurring !== undefined) {
      setIsRecurring(recurring);
    }
    
    if (recurrence !== undefined) {
      setRecurrenceType(recurrence);
    }
  };

  // Add an effect to log state changes for debugging
  useEffect(() => {
    console.log("Current executionDate state:", executionDate);
    console.log("Current step:", currentStep);
    console.log("Is schedule required:", isScheduleRequired);
    console.log("Total steps:", totalSteps);
    console.log("Current triggerData:", triggerData);
  }, [executionDate, currentStep, isScheduleRequired, totalSteps, triggerData]);

  // Create the trigger in the database
  const saveTrigger = async () => {
    try {
      // Check if we have all required data before saving
      if (isScheduleRequired && !executionDate) {
        toast({
          title: "Date required",
          description: "Please select an execution date before creating the trigger.",
          variant: "destructive",
        });
        return;
      }
      
      const completeData = { ...triggerData };

      // Process date and time information if provided
      if (executionDate) {
        const [hours, minutes] = executionTime.split(":").map(Number);
        const execDate = new Date(executionDate);
        execDate.setHours(hours, minutes);
        
        // Set the execution time
        completeData.execution_time = execDate.toISOString();
        
        // Set the recurrence pattern if recurring is enabled
        if (isRecurring) {
          completeData.recurrence_pattern = {
            type: recurrenceType,
            startDate: execDate.toISOString(),
          };
        }
        
        // Set the next execution time to be the same as the execution time initially
        completeData.next_execution = execDate.toISOString();
      }
      
      console.log("Saving trigger with data:", completeData);
      
      // Create the trigger
      await createTrigger(completeData as Omit<Trigger, "id" | "user_id" | "created_at" | "updated_at">);
      
      // Show success message
      toast({
        title: "Trigger created",
        description: "Your automation trigger has been created successfully.",
      });
      
      // Navigate back to the settings page
      navigate("/rel8/settings");
    } catch (error: any) {
      console.error("Error creating trigger:", error);
      toast({
        title: "Error creating trigger",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  // Validate the current step with enhanced logging
  const isValid = () => {
    const result = (() => {
      switch (currentStep) {
        case 1: // Basic Info
          const basicValid = triggerData.name !== "";
          console.log("Basic info validation:", { name: triggerData.name, valid: basicValid });
          return basicValid;
          
        case 2: // Behavior
          const behaviorValid = triggerData.condition !== "" && triggerData.action !== "";
          console.log("Behavior validation:", { 
            condition: triggerData.condition, 
            action: triggerData.action, 
            valid: behaviorValid 
          });
          return behaviorValid;
          
        case 3: // Schedule
          if (isScheduleRequired) {
            const valid = executionDate !== undefined;
            console.log("Schedule step validation:", { executionDate, valid });
            return valid;
          }
          return true;
          
        default:
          return false;
      }
    })();
    
    console.log(`Validation for step ${currentStep}: ${result}`);
    return result;
  };

  // Is this the final step?
  const isFinalStep = currentStep === totalSteps;

  // Pass all necessary state and functions
  return {
    currentStep,
    totalSteps,
    nextStep,
    prevStep,
    triggerData,
    updateTriggerData,
    saveTrigger,
    executionDate,
    executionTime,
    isRecurring,
    recurrenceType,
    updateScheduleData,
    isScheduleRequired,
    isValid,
    isFinalStep,
  };
}
