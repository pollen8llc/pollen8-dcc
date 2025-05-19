
import React from "react";
import { format } from "date-fns";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader,
  CardTitle 
} from "@/components/ui/card";
import {
  Trigger,
  TIME_TRIGGER_TYPES,
  TRIGGER_ACTIONS
} from "@/services/rel8t/triggerService";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CalendarDays, Clock, MailCheck, Bell, CheckCircle, RefreshCcw } from "lucide-react";
import { useTriggerWizard } from "@/hooks/rel8t/useTriggerWizard";

interface ReviewStepProps {
  triggerData: Partial<Trigger>;
  updateTriggerData: (newData: Partial<Trigger>) => void;
  onSave: () => void;
}

const ReviewStep = ({ 
  triggerData, 
  updateTriggerData 
}: ReviewStepProps) => {
  const { executionDate, executionTime, isRecurring, recurrenceType } = useTriggerWizard();

  // Format date for display
  const formatDate = (date?: Date) => {
    if (!date) return "Not set";
    return format(date, "MMMM d, yyyy");
  };

  // Get readable condition name
  const getConditionName = (condition?: string) => {
    if (!condition) return "Not set";
    
    switch (condition) {
      case "contact_added": return "New contact added";
      case "birthday_upcoming": return "Birthday approaching";
      case "anniversary_upcoming": return "Anniversary approaching";
      case "no_contact_30days": return "No contact for 30 days";
      case "meeting_scheduled": return "Meeting scheduled";
      case "scheduled_time": return "At scheduled time";
      case TIME_TRIGGER_TYPES.HOURLY: return "Hourly";
      case TIME_TRIGGER_TYPES.DAILY: return "Daily";
      case TIME_TRIGGER_TYPES.WEEKLY: return "Weekly";
      case TIME_TRIGGER_TYPES.MONTHLY: return "Monthly";
      case TIME_TRIGGER_TYPES.QUARTERLY: return "Quarterly";
      case TIME_TRIGGER_TYPES.YEARLY: return "Yearly";
      default: return condition;
    }
  };

  // Get readable action name
  const getActionName = (action?: string) => {
    if (!action) return "Not set";
    
    switch (action) {
      case TRIGGER_ACTIONS.SEND_EMAIL: return "Send email";
      case TRIGGER_ACTIONS.CREATE_TASK: return "Create task";
      case TRIGGER_ACTIONS.ADD_REMINDER: return "Add reminder";
      case TRIGGER_ACTIONS.SEND_NOTIFICATION: return "Send notification";
      default: return action;
    }
  };

  // Get icon for action type
  const getActionIcon = (action?: string) => {
    switch (action) {
      case TRIGGER_ACTIONS.SEND_EMAIL: return <MailCheck className="h-5 w-5 text-blue-500" />;
      case TRIGGER_ACTIONS.CREATE_TASK: return <CheckCircle className="h-5 w-5 text-green-500" />;
      case TRIGGER_ACTIONS.ADD_REMINDER: return <Bell className="h-5 w-5 text-amber-500" />;
      case TRIGGER_ACTIONS.SEND_NOTIFICATION: return <Bell className="h-5 w-5 text-purple-500" />;
      default: return <MailCheck className="h-5 w-5 text-blue-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold">Review & Activate</h2>
        <p className="text-muted-foreground">
          Review your trigger configuration and activate it when you're ready.
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>{triggerData.name || "Untitled Trigger"}</CardTitle>
          {triggerData.description && (
            <CardDescription>{triggerData.description}</CardDescription>
          )}
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">Trigger Condition</h3>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>{getConditionName(triggerData.condition)}</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">Action</h3>
              <div className="flex items-center gap-2">
                {getActionIcon(triggerData.action)}
                <span>{getActionName(triggerData.action)}</span>
              </div>
            </div>
          </div>
          
          {(executionDate || triggerData.condition === "scheduled_time" || 
            Object.values(TIME_TRIGGER_TYPES).includes(triggerData.condition as string)) && (
            <>
              <div className="border-t pt-4">
                <h3 className="text-sm font-medium mb-2">Schedule Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <CalendarDays className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Start Date:</span>
                      <span>{formatDate(executionDate)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Time:</span>
                      <span>{executionTime || "Not set"}</span>
                    </div>
                  </div>
                  
                  {isRecurring && (
                    <div className="flex items-center gap-2">
                      <RefreshCcw className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Recurrence:</span>
                      <span>{recurrenceType.charAt(0).toUpperCase() + recurrenceType.slice(1)}</span>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
          
          <div className="border-t pt-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="trigger-active"
                checked={triggerData.is_active === true}
                onCheckedChange={(checked) => updateTriggerData({ is_active: checked })}
              />
              <Label htmlFor="trigger-active">Activate trigger immediately</Label>
            </div>
            {!triggerData.is_active && (
              <Alert className="mt-4">
                <AlertDescription>
                  This trigger will be saved but won't run until you activate it.
                </AlertDescription>
              </Alert>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReviewStep;
