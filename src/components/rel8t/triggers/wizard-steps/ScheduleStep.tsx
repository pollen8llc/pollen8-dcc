
import React from "react";
import { DatePicker } from "@/components/ui/date-picker";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent
} from "@/components/ui/card";
import { Clock, Calendar, AlertCircle, RefreshCcw } from "lucide-react";
import { Trigger } from "@/services/rel8t/triggerService";
import { useTriggerWizard } from "@/hooks/rel8t/useTriggerWizard";

interface ScheduleStepProps {
  triggerData: Partial<Trigger>;
  updateTriggerData: (newData: Partial<Trigger>) => void;
}

const ScheduleStep = ({ triggerData, updateTriggerData }: ScheduleStepProps) => {
  const {
    executionDate,
    executionTime,
    isRecurring,
    recurrenceType,
    updateScheduleData,
  } = useTriggerWizard();

  // Time options in 30-minute intervals
  const timeOptions = Array.from({ length: 48 }, (_, i) => {
    const hour = Math.floor(i / 2);
    const minute = (i % 2) * 30;
    const displayHour = hour % 12 === 0 ? 12 : hour % 12;
    const ampm = hour < 12 ? 'AM' : 'PM';
    const formattedTime = `${String(displayHour).padStart(2, '0')}:${String(minute).padStart(2, '0')} ${ampm}`;
    const value = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
    return { label: formattedTime, value };
  });

  // Convert time from 24h to the select format
  const findTimeOption = (time24h: string) => {
    const [hours, minutes] = time24h.split(':').map(Number);
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
  };

  // Determine if there's an error
  const isDateMissing = executionDate === undefined;

  // When date/time changes, sync with the trigger data
  React.useEffect(() => {
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

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Date Selection
          </CardTitle>
          <CardDescription>
            Choose when this automation should first run
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="execution-date" className="required">Execution Date</Label>
            <DatePicker
              value={executionDate}
              onChange={(date) => updateScheduleData(date)}
              className={isDateMissing ? "border-red-300 focus-visible:ring-red-300" : ""}
            />
            {isDateMissing && (
              <div className="flex items-center text-red-500 text-sm mt-1">
                <AlertCircle className="h-4 w-4 mr-1" />
                <span>A date is required</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            Time Selection
          </CardTitle>
          <CardDescription>
            Set the time when this automation should run
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="execution-time">Execution Time</Label>
            <Select
              value={findTimeOption(executionTime)}
              onValueChange={(value) => updateScheduleData(undefined, value)}
            >
              <SelectTrigger id="execution-time">
                <SelectValue placeholder="Select a time" />
              </SelectTrigger>
              <SelectContent>
                {timeOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <RefreshCcw className="h-5 w-5 text-primary" />
            Recurrence
          </CardTitle>
          <CardDescription>
            Should this trigger repeat periodically?
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
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
                <SelectTrigger id="recurrence-type">
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
        </CardContent>
      </Card>
    </div>
  );
};

export default ScheduleStep;
