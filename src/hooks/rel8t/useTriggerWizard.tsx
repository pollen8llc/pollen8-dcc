import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { createTrigger } from "@/services/rel8t/triggerService";
import { createOutreach } from "@/services/rel8t/outreachService";
import { useRelationshipWizard } from "@/contexts/RelationshipWizardContext";
import { Contact } from "@/services/rel8t/contactService";

const WIZARD_STATE_KEY = "trigger_wizard_state";

export interface SimpleTriggerFormData {
  selectedContacts: Contact[];
  name: string; // Auto-generated from contacts
  triggerDate: Date | null;
  triggerTime: string;
  frequency: string;
  priority: string;
  outreachChannel?: string;
  channelDetails?: {
    phone?: string;
    email?: string;
    platform?: string;
    handle?: string;
    link?: string;
    meetingPlatform?: string;
    address?: string;
  };
}

// Generate trigger name from selected contacts
const generateTriggerName = (contacts: Contact[]): string => {
  if (contacts.length === 0) return "";
  
  const getDisplayName = (contact: Contact) => {
    return contact.name || contact.email || "Contact";
  };
  
  if (contacts.length === 1) {
    return `Reminder: ${getDisplayName(contacts[0])}`;
  }
  
  if (contacts.length === 2) {
    return `Reminder: ${getDisplayName(contacts[0])}, ${getDisplayName(contacts[1])}`;
  }
  
  return `Reminder: ${getDisplayName(contacts[0])}, ${getDisplayName(contacts[1])} +${contacts.length - 2} more`;
};

export function useTriggerWizard() {
  const navigate = useNavigate();
  const { setSelectedTrigger } = useRelationshipWizard();
  
  // Load initial state from localStorage if available
  const getInitialFormData = (): SimpleTriggerFormData => {
    const savedState = localStorage.getItem(WIZARD_STATE_KEY);
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);
        // Convert date string back to Date object
        if (parsed.triggerDate) {
          parsed.triggerDate = new Date(parsed.triggerDate);
        }
        // Ensure selectedContacts exists
        if (!parsed.selectedContacts) {
          parsed.selectedContacts = [];
        }
        return parsed;
      } catch (e) {
        console.error("Failed to parse saved wizard state:", e);
      }
    }
    return {
      selectedContacts: [],
      name: "",
      triggerDate: new Date(),
      triggerTime: "09:00",
      frequency: "weekly",
      priority: "medium",
      outreachChannel: undefined,
      channelDetails: undefined
    };
  };

  const [formData, setFormData] = useState<SimpleTriggerFormData>(getInitialFormData);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(WIZARD_STATE_KEY, JSON.stringify(formData));
  }, [formData]);

  // Update form data with partial updates
  const updateFormData = useCallback((data: Partial<SimpleTriggerFormData>) => {
    console.log("Updating form data:", data);
    setFormData(prev => {
      const updated = { ...prev, ...data };
      // Auto-generate name when contacts change
      if (data.selectedContacts !== undefined) {
        updated.name = generateTriggerName(data.selectedContacts);
      }
      return updated;
    });
  }, []);

  // Submit the form data and return the created trigger with ICS content
  const handleSubmit = useCallback(async (returnTo?: string, createOutreachTask: boolean = false) => {
    try {
      console.log("Submitting trigger with data:", formData, "createOutreach:", createOutreachTask);
      
      // Combine date and time into a single datetime
      let executionTime: string | undefined;
      if (formData.triggerDate && formData.triggerTime) {
        const [hours, minutes] = formData.triggerTime.split(':');
        const combinedDateTime = new Date(formData.triggerDate);
        combinedDateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
        executionTime = combinedDateTime.toISOString();
      }

      // Extract contact IDs
      const contactIds = formData.selectedContacts.map(c => c.id);
      
      // Transform simple form data to the format expected by the API
      const triggerData = {
        name: formData.name || `Reminder at ${formData.triggerTime}`,
        description: `${formData.frequency} trigger with ${formData.priority} priority at ${formData.triggerTime}`,
        is_active: true,
        condition: formData.frequency,
        action: "send_email",
        next_execution_at: executionTime,
        recurrence_pattern: {
          type: formData.frequency,
          startDate: executionTime || new Date().toISOString()
        },
        outreach_channel: formData.outreachChannel,
        channel_details: formData.channelDetails
      };
      
      const result = await createTrigger(triggerData, contactIds);
      
      if (result) {
        const { trigger, icsContent } = result;
        
        // Create outreach task if requested
        if (createOutreachTask) {
          const outreachData = {
            title: formData.name || `Reminder at ${formData.triggerTime}`,
            description: `Scheduled ${formData.frequency} reminder`,
            priority: formData.priority as 'low' | 'medium' | 'high',
            status: 'pending' as const,
            due_date: executionTime || new Date().toISOString(),
            outreach_channel: formData.outreachChannel,
            channel_details: formData.channelDetails,
            trigger_id: trigger.id,
          };
          
          await createOutreach(outreachData, contactIds);
        }
        
        toast({
          title: createOutreachTask ? "Reminder & Task created" : "Reminder created",
          description: createOutreachTask 
            ? "Your reminder and outreach task have been created."
            : "Your automation reminder has been created."
        });
        
        // Clear saved state after successful creation
        localStorage.removeItem(WIZARD_STATE_KEY);
        
        // If returning to relationship wizard, store trigger in context
        if (returnTo === 'relationship') {
          setSelectedTrigger(trigger);
        }
        
        return { trigger, icsContent }; // Return trigger and ICS content
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
      { value: "weekly", label: "Weekly" },
      { value: "biweekly", label: "Biweekly" },
      { value: "monthly", label: "Monthly" },
      { value: "quarterly", label: "Quarterly" }
    ],
    priorityOptions: [
      { value: "low", label: "Low" },
      { value: "medium", label: "Medium" },
      { value: "high", label: "High" }
    ]
  };
}
