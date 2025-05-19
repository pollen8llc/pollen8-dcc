
import React, { useEffect } from "react";
import { DatePicker } from "@/components/ui/date-picker";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Trigger } from "@/services/rel8t/triggerService";
import { useTriggerWizard } from "@/hooks/rel8t/useTriggerWizard";

interface ScheduleStepProps {
  triggerData: Partial<Trigger>;
  updateTriggerData: (newData: Partial<Trigger>) => void;
}

const ScheduleStep = ({ triggerData, updateTriggerData }: ScheduleStepProps) => {
  // Access schedule-specific functions from our hook
  const {
    executionDate,
    executionTime,
    isRecurring,
    recurrenceType,
    updateScheduleData,
    updateTriggerData: updateTriggerHookData
  } = useTriggerWizard();

  // Sync the executed date and time to triggerData when they change
  useEffect(() => {
    if (executionDate) {
      // Create a combined date object with the execution time
      const [hours, minutes] = executionTime.split(":").map(Number);
      const execDate = new Date(executionDate);
      execDate.setHours(hours, minutes);
      
      // Update the trigger data with the new execution time
      updateTriggerData({ execution_time: execDate.toISOString() });
      
      // If recurring is enabled, also update the recurrence pattern
      if (isRecurring) {
        updateTriggerData({ 
          recurrence_pattern: {
            type: recurrenceType,
            startDate: execDate.toISOString(),
          }
        });
      }
    }
  }, [executionDate, executionTime, isRecurring, recurrenceType, updateTriggerData]);

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold">Schedule Configuration</h2>
        <p className="text-muted-foreground">
          Set when your trigger should run and if it should repeat.
        </p>
      </div>

      <div className="space-y-6">
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="execution-date" className="required">Execution Date</Label>
            <div id="execution-date">
              <DatePicker
                value={executionDate}
                onChange={(date) => updateScheduleData(date)}
              />
            </div>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="execution-time" className="required">Execution Time</Label>
            <Input
              id="execution-time"
              type="time"
              value={executionTime}
              onChange={(e) => updateScheduleData(undefined, e.target.value)}
              className="w-full sm:w-[200px]"
            />
          </div>
        </div>
        
        <div className="border-t pt-4">
          <div className="flex items-center space-x-2 mb-4">
            <Switch
              id="recurring"
              checked={isRecurring}
              onCheckedChange={(checked) => updateScheduleData(undefined, undefined, checked)}
            />
            <Label htmlFor="recurring">Make this a recurring trigger</Label>
          </div>
          
          {isRecurring && (
            <div className="grid gap-2 mt-4">
              <Label htmlFor="recurrence-type">Recurrence Pattern</Label>
              <Select
                value={recurrenceType}
                onValueChange={(value) => updateScheduleData(undefined, undefined, undefined, value)}
              >
                <SelectTrigger id="recurrence-type" className="w-full sm:w-[200px]">
                  <SelectValue placeholder="Select recurrence pattern" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="quarterly">Quarterly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ScheduleStep;
