
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Contact } from "@/services/rel8t/contactService";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { 
  CircleCheck, 
  Loader2,
  Flag,
  AlertCircle
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { 
  createOutreach, 
  OutreachStatus,
  OutreachPriority 
} from "@/services/rel8t/outreachService";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { addDays, format } from "date-fns";
import { Trigger } from "@/services/rel8t/triggerService";

interface ReviewSubmitStepProps {
  wizardData: {
    contacts: Contact[];
    triggers: Trigger[];
    priority: OutreachPriority;
  };
  onSubmit: () => void;
  onPrevious?: () => void;
}

// Helper function to get due date from trigger
const getDueDateFromTrigger = (trigger: Trigger) => {
  // Use execution_time if available
  if (trigger.execution_time) {
    return new Date(trigger.execution_time);
  }
  
  // Else use next_execution
  if (trigger.next_execution) {
    return new Date(trigger.next_execution);
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
      
      setSubmissionStatus("success");
      toast({
        title: "Relationship plan created",
        description: `Created ${triggers.length} outreach reminders for ${contacts.length} contacts.`
      });
      
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
        return 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300 border-red-200 dark:border-red-800';
      case 'medium':
        return 'bg-amber-100 dark:bg-amber-900/20 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800';
      case 'low':
        return 'bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800';
      default:
        return '';
    }
  };

  if (submissionStatus === "success") {
    return (
      <div className="flex flex-col items-center py-12">
        <CircleCheck className="h-16 w-16 text-green-500 mb-4" />
        <h3 className="text-xl font-semibold mb-2">Success!</h3>
        <p className="text-center text-muted-foreground mb-6">
          Your relationship plan has been created successfully.
        </p>
      </div>
    );
  }

  if (submissionStatus === "error") {
    return (
      <div className="flex flex-col items-center py-12">
        <AlertCircle className="h-16 w-16 text-red-500 mb-4" />
        <h3 className="text-xl font-semibold mb-2">Error</h3>
        <p className="text-center text-muted-foreground mb-6">{errorMessage}</p>
        <div className="flex gap-4">
          <Button variant="outline" onClick={onPrevious}>
            Back
          </Button>
          <Button onClick={() => setSubmissionStatus("idle")}>Try Again</Button>
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
      <div>
        <h3 className="text-lg font-medium mb-2">Review Your Relationship Plan</h3>
        <div className="flex items-center gap-3 mb-6">
          <Badge 
            variant="outline" 
            className={`px-2.5 py-1 ${getPriorityStyle(priority)}`}
          >
            <Flag className="h-3.5 w-3.5 mr-1" />
            {priority.charAt(0).toUpperCase() + priority.slice(1)} Priority
          </Badge>
          
          <Badge variant="outline" className="px-2.5 py-1">
            {contacts.length} Contact{contacts.length !== 1 ? "s" : ""}
          </Badge>
          
          <Badge variant="outline" className="px-2.5 py-1">
            {triggers.length} Reminder{triggers.length !== 1 ? "s" : ""}
          </Badge>
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="font-medium">Selected Contacts</h4>
        <ScrollArea className="h-[200px] border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Organization</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {contacts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-6">
                    No contacts selected
                  </TableCell>
                </TableRow>
              ) : (
                contacts.map((contact) => (
                  <TableRow key={contact.id}>
                    <TableCell className="font-medium">{contact.name}</TableCell>
                    <TableCell>{contact.email || "—"}</TableCell>
                    <TableCell>{contact.organization || "—"}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </ScrollArea>
      </div>

      <div className="space-y-4">
        <h4 className="font-medium">Selected Reminders</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {triggers.length === 0 ? (
            <div className="border rounded-md p-6 text-center col-span-2">
              <p className="text-muted-foreground">No reminders selected</p>
            </div>
          ) : (
            triggers.map((trigger) => {
              const dueDate = getDueDateFromTrigger(trigger);
              return (
                <div 
                  key={trigger.id} 
                  className="border rounded-md p-4 border-border/30"
                >
                  <h5 className="font-medium">{trigger.name}</h5>
                  {trigger.description && (
                    <p className="text-sm text-muted-foreground mt-1 mb-2">
                      {trigger.description}
                    </p>
                  )}
                  <div className="flex flex-wrap gap-2 mt-2">
                    <Badge variant="outline">Due {formatDate(dueDate)}</Badge>
                    <Badge variant="secondary">{trigger.action.replace(/_/g, ' ')}</Badge>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      <div className="flex justify-between pt-6">
        {onPrevious && (
          <Button variant="outline" onClick={onPrevious} disabled={isSubmitting}>
            Back
          </Button>
        )}
        <Button 
          onClick={handleSubmit} 
          disabled={isSubmitting || contacts.length === 0}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating Relationship...
            </>
          ) : (
            "Create Relationship Plan"
          )}
        </Button>
      </div>
    </div>
  );
};

export default ReviewSubmitStep;
