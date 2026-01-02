import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Contact } from "@/services/rel8t/contactService";
import { Badge } from "@/components/ui/badge";
import { 
  CircleCheck, 
  Loader2,
  Flag,
  AlertCircle,
  Users
} from "lucide-react";
import { 
  createOutreach, 
  OutreachStatus,
  OutreachPriority 
} from "@/services/rel8t/outreachService";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { addDays, format } from "date-fns";
import { Trigger, createTrigger } from "@/services/rel8t/triggerService";
import { Actv8StepData } from "@/contexts/RelationshipWizardContext";

interface ReviewSubmitStepProps {
  wizardData: {
    contacts: Contact[];
    triggers: Trigger[];
    priority: OutreachPriority;
    // Actv8 development path data
    actv8ContactId?: string | null;
    actv8StepIndex?: number | null;
    actv8StepData?: Actv8StepData | null;
  };
  onSubmit: (trigger?: Trigger, icsContent?: string) => void;
  onPrevious?: () => void;
  onRemoveTrigger?: () => void;
}

// Helper function to get due date from trigger
const getDueDateFromTrigger = (trigger: Trigger) => {
  // Use execution_time if available
  if (trigger.execution_time) {
    return new Date(trigger.execution_time);
  }
  
  // Else use next_execution_at
  if (trigger.next_execution_at) {
    return new Date(trigger.next_execution_at);
  }
  
  // Fallback: calculate based on trigger name
  const today = new Date();
  const dueDateMap: Record<string, Date> = {
    "Follow up in 1 week": addDays(today, 7),
    "Schedule monthly check-in": addDays(today, 30),
    "Quarterly review": addDays(today, 90),
    "Send welcome message": addDays(today, 1),
    "Introduce to team": addDays(today, 3),
    "Share resources": addDays(today, 2),
    "Reconnect soon": addDays(today, 14), 
    "Birthday reminder": addDays(today, 7),
    "Monthly Check-in": addDays(today, 30),
    "Quarterly Review": addDays(today, 90),
    "Birthday Reminder": addDays(today, 7),
  };
  
  return dueDateMap[trigger.name] || addDays(today, 7); // Default to 1 week
};

export const ReviewSubmitStep = ({
  wizardData,
  onSubmit,
  onPrevious,
  onRemoveTrigger,
}: ReviewSubmitStepProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const { contacts, triggers, priority, actv8ContactId, actv8StepIndex, actv8StepData } = wizardData;
  const isActv8Mode = !!actv8ContactId;

  const handleSubmit = async () => {
    // Synchronous guard to prevent double submission (before any state updates)
    if (isSubmitting) {
      console.log("⚠️ Double submission prevented");
      return;
    }
    
    if (contacts.length === 0) {
      toast({
        variant: "destructive",
        title: "No contacts selected",
        description: "Please select at least one contact to create a relationship plan."
      });
      return;
    }

    // Set submitting state immediately (synchronously update the flag)
    setIsSubmitting(true);
    setSubmissionStatus("submitting");

    try {
      // Create an outreach item for each trigger
      const contactIds = contacts.map(contact => contact.id);
      const outreachPromises = triggers.map(async (trigger) => {
        // Get the due date from the trigger with proper fallbacks
        const dueDate = getDueDateFromTrigger(trigger);
        
        // Build outreach title - include actv8 step name if available
        const titlePrefix = isActv8Mode && actv8StepData 
          ? `${actv8StepData.stepName}: ` 
          : '';
        
        const outreach = {
          title: titlePrefix + (contacts.length === 1 
            ? `Follow up with ${contacts[0].name}`
            : `Follow up with ${contacts.map(c => c.name).join(', ')}`),
          description: trigger.description || `Reminder for ${contacts.map(c => c.name).join(', ')}`,
          priority: priority,
          status: 'pending' as OutreachStatus,
          due_date: dueDate.toISOString(),
          outreach_channel: trigger.outreach_channel || (isActv8Mode && actv8StepData ? actv8StepData.suggestedChannel : null),
          channel_details: trigger.channel_details,
          trigger_id: trigger.id,
          // Actv8 Build Rapport linkage for step tracking
          actv8_contact_id: actv8ContactId || null,
          actv8_step_index: actv8StepIndex ?? null,
        };
        
        return await createOutreach(outreach, contactIds);
      });
      
      // Wait for all outreach items to be created
      const results = await Promise.all(outreachPromises);
      
      // Check if any failed
      if (results.some(id => id === null)) {
        throw new Error("Some outreach items could not be created");
      }
      
      // Invalidate relevant queries to refresh data
      queryClient.invalidateQueries({ queryKey: ["outreach"] });
      queryClient.invalidateQueries({ queryKey: ["outreach-counts"] });
      
      // Success! Outreach items created from existing triggers
      setSubmissionStatus("success");
      toast({
        title: "Relationship plan created",
        description: `Created ${triggers.length} outreach reminder${triggers.length !== 1 ? 's' : ''} for ${contacts.length} contact${contacts.length !== 1 ? 's' : ''}.`
      });

      // Complete without creating duplicate triggers
      setTimeout(() => {
        onSubmit();
      }, 1500);
    } catch (error) {
      console.error("Submission error:", error);
      setSubmissionStatus("error");
      setErrorMessage("Failed to create relationship plan. Please try again.");
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create relationship plan. Please try again."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Function to get the style for priority badges
  const getPriorityStyle = (priority: string) => {
    switch(priority) {
      case 'high':
        return 'bg-destructive/10 text-destructive border-destructive/30';
      case 'medium':
        return 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/30';
      case 'low':
        return 'bg-primary/10 text-primary border-primary/30';
      default:
        return '';
    }
  };

  if (submissionStatus === "success") {
    return (
      <div className="flex flex-col items-center py-8">
        <CircleCheck className="h-12 w-12 text-green-500 mb-3" />
        <h3 className="text-lg font-semibold mb-1">Success!</h3>
        <p className="text-center text-sm text-muted-foreground">
          Your relationship plan has been created successfully.
        </p>
      </div>
    );
  }

  if (submissionStatus === "error") {
    return (
      <div className="flex flex-col items-center py-8">
        <AlertCircle className="h-12 w-12 text-destructive mb-3" />
        <h3 className="text-lg font-semibold mb-1">Error</h3>
        <p className="text-center text-sm text-muted-foreground mb-4">{errorMessage}</p>
        <div className="flex gap-3">
          <Button variant="outline" size="sm" onClick={onPrevious}>
            Back
          </Button>
          <Button size="sm" onClick={() => setSubmissionStatus("idle")}>Try Again</Button>
        </div>
      </div>
    );
  }

  // Format date for display
  const formatDate = (date: Date) => {
    try {
      return format(date, "MMM d, yyyy");
    } catch (error) {
      console.error("Date formatting error:", error);
      return "Invalid date";
    }
  };

  return (
    <div className="space-y-6">
      {/* Actv8 Development Path Mode Indicator */}
      {isActv8Mode && actv8StepData && (
        <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            <span className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
              {actv8StepData.pathName}: {actv8StepData.stepName}
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {actv8StepData.stepDescription}
          </p>
        </div>
      )}

      {/* Compact Header with Stats */}
      <div className="flex flex-wrap items-center gap-2">
        <Badge 
          variant="outline" 
          className={`px-2.5 py-1 text-xs ${getPriorityStyle(priority)}`}
        >
          <Flag className="h-3 w-3 mr-1" />
          {priority.charAt(0).toUpperCase() + priority.slice(1)}
        </Badge>
        
        <Badge variant="secondary" className="px-2.5 py-1 text-xs">
          {contacts.length} Contact{contacts.length !== 1 ? "s" : ""}
        </Badge>
        
        <Badge variant="secondary" className="px-2.5 py-1 text-xs">
          {triggers.length} Reminder{triggers.length !== 1 ? "s" : ""}
        </Badge>
      </div>

      {/* Contacts - Compact Card Grid */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-muted-foreground">Contacts</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {contacts.length === 0 ? (
            <div className="col-span-2 text-center py-6 text-sm text-muted-foreground">
              No contacts selected
            </div>
          ) : (
            contacts.map((contact) => (
              <div 
                key={contact.id}
                className="p-3 rounded-lg border border-border/40 bg-card/30 hover:bg-card/50 hover:border-primary/30 transition-all"
              >
                <div className="font-medium text-sm">{contact.name}</div>
                {contact.email && (
                  <div className="text-xs text-muted-foreground mt-0.5">{contact.email}</div>
                )}
                {contact.organization && (
                  <div className="text-xs text-muted-foreground">{contact.organization}</div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Reminders - Sleek Cards */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-medium text-muted-foreground">Reminders</h4>
          {onRemoveTrigger && triggers.length > 0 && (
            <Badge
              variant="outline"
              onClick={onRemoveTrigger}
              className="h-8 px-3 cursor-pointer backdrop-blur-sm bg-red-500/10 border-red-500/30 text-red-600 dark:text-red-400 hover:bg-red-500/20 hover:border-red-500/50 transition-all"
            >
              Remove Selected Triggers
            </Badge>
          )}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {triggers.length === 0 ? (
            <div className="col-span-2 text-center py-6 text-sm text-muted-foreground">
              No reminders selected
            </div>
          ) : (
            triggers.map((trigger) => {
              const dueDate = getDueDateFromTrigger(trigger);
              return (
                <div 
                  key={trigger.id} 
                  className="p-3 rounded-lg border border-border/40 bg-card/30 hover:bg-card/50 hover:border-primary/30 transition-all"
                >
                  <h5 className="font-medium text-sm">{trigger.name}</h5>
                  {trigger.description && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {trigger.description}
                    </p>
                  )}
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    <Badge variant="outline" className="text-xs px-1.5 py-0.5">
                      {formatDate(dueDate)}
                    </Badge>
                    <Badge variant="secondary" className="text-xs px-1.5 py-0.5">
                      {trigger.action.replace(/_/g, ' ')}
                    </Badge>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between pt-4 border-t border-border/40">
        {onPrevious && (
          <Button 
            variant="outline" 
            size="sm"
            onClick={onPrevious} 
            disabled={isSubmitting}
            className="border-primary/30 hover:border-primary hover:bg-primary/10"
          >
            Back
          </Button>
        )}
        <Button 
          size="sm"
          onClick={handleSubmit} 
          disabled={isSubmitting || contacts.length === 0}
          className="ml-auto"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
              Creating...
            </>
          ) : (
            "Create Plan"
          )}
        </Button>
      </div>
    </div>
  );
};

export default ReviewSubmitStep;
