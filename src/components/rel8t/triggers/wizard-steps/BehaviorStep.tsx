
import { Button } from "@/components/ui/button";
import { FormItem, FormLabel } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTriggerWizard } from "@/hooks/rel8t/useTriggerWizard";
import { Clock, Mail, Clipboard, Bell } from "lucide-react";

export function BehaviorStep() {
  const { formData, updateFormData, handleNextStep, handlePreviousStep, errors, triggerTypes, actionTypes } = useTriggerWizard();

  // Helper to convert object keys to readable labels
  const formatLabel = (key: string) => {
    return key
      .replace(/_/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <FormItem>
          <FormLabel className="text-base">Trigger Condition</FormLabel>
          <p className="text-sm text-muted-foreground mb-2">
            When should this automation be triggered?
          </p>

          <Select
            value={formData.condition}
            onValueChange={(value) => updateFormData({ condition: value })}
          >
            <SelectTrigger className={errors.condition ? "border-destructive" : ""}>
              <SelectValue placeholder="Select trigger condition" />
            </SelectTrigger>
            <SelectContent>
              {Object.values(triggerTypes).map((type) => (
                <SelectItem key={type} value={type}>
                  <div className="flex items-center">
                    <Clock className="mr-2 h-4 w-4" />
                    {formatLabel(type)}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.condition && (
            <p className="text-sm text-destructive mt-1">{errors.condition}</p>
          )}
        </FormItem>

        <FormItem>
          <FormLabel className="text-base">Trigger Action</FormLabel>
          <p className="text-sm text-muted-foreground mb-2">
            What should happen when this trigger is activated?
          </p>

          <Select
            value={formData.action}
            onValueChange={(value) => updateFormData({ action: value })}
          >
            <SelectTrigger className={errors.action ? "border-destructive" : ""}>
              <SelectValue placeholder="Select trigger action" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={actionTypes.SEND_EMAIL}>
                <div className="flex items-center">
                  <Mail className="mr-2 h-4 w-4" />
                  Send Email
                </div>
              </SelectItem>
              <SelectItem value={actionTypes.CREATE_TASK}>
                <div className="flex items-center">
                  <Clipboard className="mr-2 h-4 w-4" />
                  Create Task
                </div>
              </SelectItem>
              <SelectItem value={actionTypes.ADD_REMINDER}>
                <div className="flex items-center">
                  <Clock className="mr-2 h-4 w-4" />
                  Add Reminder
                </div>
              </SelectItem>
              <SelectItem value={actionTypes.SEND_NOTIFICATION}>
                <div className="flex items-center">
                  <Bell className="mr-2 h-4 w-4" />
                  Send Notification
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
          {errors.action && (
            <p className="text-sm text-destructive mt-1">{errors.action}</p>
          )}
        </FormItem>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={handlePreviousStep}>
          Previous
        </Button>
        <Button onClick={handleNextStep}>Next Step</Button>
      </div>
    </div>
  );
}
