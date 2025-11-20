import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Contact } from "@/services/rel8t/contactService";
import { Badge } from "@/components/ui/badge";
import { 
  CircleCheck, 
  Loader2,
  Flag,
  AlertCircle
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

interface ReviewSubmitStepProps {
  wizardData: {
    contacts: Contact[];
    triggers: Trigger[];
    priority: OutreachPriority;
  };
  onSubmit: (trigger?: Trigger, icsContent?: string) => void;
  onPrevious?: () => void;
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
}: ReviewSubmitStepProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const { contacts, triggers, priority } = wizardData;

  const handleSubmit = async () => {
    if (contacts.length === 0) {
      toast({
        variant: "destructive",
        title: "No contacts selected",
        description: "Please select at least one contact to create a relationship plan."
      });
      return;
    }

    setIsSubmitting(true);
    setSubmissionStatus("submitting");

    try {
      // Create an outreach item for each trigger
      const contactIds = contacts.map(contact => contact.id);
      const outreachPromises = triggers.map(async (trigger) => {
        // Get the due date from the trigger with proper fallbacks
        const dueDate = getDueDateFromTrigger(trigger);
        
        const outreach = {
          title: trigger.name,
          description: trigger.description || `Reminder for ${contacts.map(c => c.name).join(', ')}`,
          priority: priority,
          status: 'pending' as OutreachStatus,
          due_date: dueDate.toISOString()
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
      
      // Create a trigger for the relationship plan (using first trigger as base)
      const baseTrigger = triggers[0];
      const dueDate = getDueDateFromTrigger(baseTrigger);
      const executionTime = dueDate.toISOString();

      const triggerPayload = {
        name: baseTrigger.name || "Relationship Outreach Reminder",
        description: baseTrigger.description || `Reminder to follow up with ${contacts.length} contact${contacts.length !== 1 ? "s" : ""}.`,
        is_active: true,
        condition: "onetime",
        action: "send_email",
        execution_time: executionTime,
        next_execution_at: executionTime,
        recurrence_pattern: {
          type: "onetime",
          startDate: executionTime
        }
      };

      const triggerResult = await createTrigger(triggerPayload);

      if (triggerResult) {
        const { trigger, icsContent } = triggerResult;

        setSubmissionStatus("success");
        toast({
          title: "Relationship plan created",
          description: `Created ${triggers.length} outreach reminder${triggers.length !== 1 ? 's' : ''} for ${contacts.length} contact${contacts.length !== 1 ? 's' : ''}.`
        });

        // Pass trigger and ICS to parent to show dialog and download
        setTimeout(() => {
          onSubmit(trigger, icsContent);
        }, 1500);
      } else {
        // Fallback: outreach created but no trigger/ICS
        setSubmissionStatus("success");
        toast({
          title: "Relationship plan created",
          description: "Your outreach items were created successfully."
        });

        setTimeout(() => {
          onSubmit();
        }, 1500);
      }
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
        <h4 className="text-sm font-medium text-muted-foreground">Reminders</h4>
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
