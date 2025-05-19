
import { Button } from "@/components/ui/button";
import { useTriggerWizard } from "@/hooks/rel8t/useTriggerWizard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CalendarIcon, CheckCircle2, Clock, Edit, Mail, Bell, Clipboard } from "lucide-react";
import { format } from "date-fns";

export function ReviewStep() {
  const { formData, handlePreviousStep, handleSubmit, currentStep, updateFormData } = useTriggerWizard();

  // Helper function to format trigger conditions
  const formatCondition = (condition: string): string => {
    return condition
      .replace(/_/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  // Helper function to format time
  const formatTime = (date: Date | null): string => {
    if (!date) return "Not set";
    return format(date, "PPP 'at' h:mm a");
  };

  // Helper function to get icon for action
  const getActionIcon = (action: string) => {
    switch (action) {
      case "send_email":
        return <Mail className="h-5 w-5 mr-2" />;
      case "create_task":
        return <Clipboard className="h-5 w-5 mr-2" />;
      case "add_reminder":
        return <Clock className="h-5 w-5 mr-2" />;
      case "send_notification":
        return <Bell className="h-5 w-5 mr-2" />;
      default:
        return <CheckCircle2 className="h-5 w-5 mr-2" />;
    }
  };

  // Format recurrence pattern
  const formatRecurrence = () => {
    if (!formData.recurrencePattern) return "One time only";
    
    const { type, frequency } = formData.recurrencePattern;
    const freqText = frequency && frequency > 1 ? `${frequency} ` : "";
    
    return `Every ${freqText}${formatCondition(type).toLowerCase()}`;
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-4">
        <h3 className="text-lg font-medium">Review Your Trigger</h3>
        <p className="text-muted-foreground">
          Please review the trigger details before creating it
        </p>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle>{formData.name}</CardTitle>
            <CardDescription>
              {formData.isActive ? 
                <span className="flex items-center text-green-500"><CheckCircle2 className="h-3 w-3 mr-1" /> Active</span> : 
                "Inactive"}
            </CardDescription>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            className="h-8 px-2"
            onClick={() => updateFormData({ currentStep: 1 })}
          >
            <Edit className="h-4 w-4 mr-1" /> Edit
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {formData.description && (
              <p className="text-sm text-muted-foreground">{formData.description}</p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle>Behavior</CardTitle>
          <Button 
            variant="outline" 
            size="sm" 
            className="h-8 px-2"
            onClick={() => updateFormData({ currentStep: 2 })}
          >
            <Edit className="h-4 w-4 mr-1" /> Edit
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div>
              <h4 className="text-sm font-medium">When:</h4>
              <p className="flex items-center text-sm">
                <Clock className="h-4 w-4 mr-2" />
                {formatCondition(formData.condition)}
              </p>
            </div>
            <Separator />
            <div>
              <h4 className="text-sm font-medium">Action:</h4>
              <p className="flex items-center text-sm">
                {getActionIcon(formData.action)}
                {formData.action === "send_email" && "Send Email"}
                {formData.action === "create_task" && "Create Task"}
                {formData.action === "add_reminder" && "Add Reminder"}
                {formData.action === "send_notification" && "Send Notification"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle>Schedule</CardTitle>
          <Button 
            variant="outline" 
            size="sm" 
            className="h-8 px-2"
            onClick={() => updateFormData({ currentStep: 3 })}
          >
            <Edit className="h-4 w-4 mr-1" /> Edit
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div>
              <h4 className="text-sm font-medium">Start:</h4>
              <p className="flex items-center text-sm">
                <CalendarIcon className="h-4 w-4 mr-2" />
                {formatTime(formData.executionDate)}
              </p>
            </div>
            <Separator />
            <div>
              <h4 className="text-sm font-medium">Recurrence:</h4>
              <p className="flex items-center text-sm">
                <Clock className="h-4 w-4 mr-2" />
                {formatRecurrence()}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={handlePreviousStep}>
          Previous
        </Button>
        <Button onClick={handleSubmit}>
          Create Trigger
        </Button>
      </div>
    </div>
  );
}
