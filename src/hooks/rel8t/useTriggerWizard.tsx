
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { 
  Trigger, 
  RecurrencePattern,
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

  // Debug logging to track state changes
  useEffect(() => {
    console.log("useTriggerWizard - executionDate:", executionDate);
    console.log("useTriggerWizard - executionTime:", executionTime);
    console.log("useTriggerWizard - triggerData:", triggerData);
  }, [executionDate, executionTime, triggerData]);

  // Check if the schedule step is required based on condition
  const isScheduleRequired = triggerData.condition === "scheduled_time" || 
    Object.values(TIME_TRIGGER_TYPES).includes(triggerData.condition as string);

  // Move to the next step
  const nextStep = () => {
    console.log("Attempting to move to next step from step:", currentStep);
    console.log("isScheduleRequired:", isScheduleRequired);
    console.log("isValid():", isValid());
    
    if (isValid()) {
      if (isScheduleRequired || currentStep < 3) {
        setCurrentStep((prev) => prev + 1);
        console.log("Moving to next step");
      }
    } else {
      // Show feedback to user about what's missing
      if (currentStep === 3 && isScheduleRequired && !executionDate) {
        toast({
          title: "Date required",
          description: "Please select an execution date to continue.",
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
    setTriggerData((prev) => ({ ...prev, ...newData }));
  };

  // Update schedule-related data
  const updateScheduleData = (
    date?: Date, 
    time?: string, 
    recurring?: boolean, 
    recurrence?: string
  ) => {
    console.log("updateScheduleData called with date:", date);
    if (date !== undefined) {
      console.log("Setting execution date to:", date);
      setExecutionDate(date);
    }
    if (time !== undefined) setExecutionTime(time);
    if (recurring !== undefined) setIsRecurring(recurring);
    if (recurrence !== undefined) setRecurrenceType(recurrence);
  };

  // Create the trigger in the database
  const saveTrigger = async () => {
    try {
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

  // Validate the current step with improved logic
  const isValid = () => {
    console.log(`Validating step ${currentStep}:`);
    console.log(`- executionDate:`, executionDate);
    console.log(`- triggerName:`, triggerData.name);
    console.log(`- condition:`, triggerData.condition);
    
    switch (currentStep) {
      case 1: // Basic Info
        const basicInfoValid = triggerData.name !== "";
        console.log("Basic info validation:", basicInfoValid);
        return basicInfoValid;
        
      case 2: // Behavior
        const behaviorValid = triggerData.condition !== "" && triggerData.action !== "";
        console.log("Behavior validation:", behaviorValid);
        return behaviorValid;
        
      case 3: // Schedule
        if (isScheduleRequired) {
          // Fixed validation logic: only check if a date is selected
          const scheduleValid = executionDate !== undefined;
          console.log("Schedule validation:", scheduleValid);
          return scheduleValid;
        }
        return true;
        
      case 4: // Review
        return true;
        
      default:
        return false;
    }
  };

  // Pass all necessary state and functions
  return {
    currentStep,
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
  };
}
