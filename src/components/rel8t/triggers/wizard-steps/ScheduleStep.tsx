
import React, { useEffect, useState } from "react";
import { DatePicker } from "@/components/ui/date-picker";
import { DateSelect } from "@/components/ui/date-select";
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
  CardContent,
  CardFooter
} from "@/components/ui/card";
import { Clock } from "lucide-react";
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

  // When date/time changes, sync with the trigger data
  useEffect(() => {
    if (executionDate) {
      // Create a combined date object with the execution time
      const [hours, minutes] = executionTime.split(":").map(Number);
      const execDate = new Date(executionDate);
      execDate.setHours(hours, minutes);
      
      console.log("ScheduleStep - Updating triggerData with execution_time:", execDate.toISOString());
      
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

  // Debug information
  console.log("ScheduleStep rendering with executionDate:", executionDate);
  console.log("ScheduleStep rendering with executionTime:", executionTime);
  console.log("ScheduleStep rendering with timeOptions:", timeOptions);
  console.log("ScheduleStep rendering with selected option:", findTimeOption(executionTime));

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold">Schedule Configuration</h2>
        <p className="text-muted-foreground">
          Set when your trigger should run and if it should repeat.
        </p>
      </div>

      <Card className="border-border/40">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Date and Time
          </CardTitle>
          <CardDescription>
            When should this trigger be executed?
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="execution-date" className="required">Execution Date</Label>
              <DatePicker
                value={executionDate}
                onChange={(date) => {
                  console.log("DatePicker onChange:", date);
                  updateScheduleData(date);
                }}
                className="w-full"
              />
              {!executionDate && (
                <p className="text-sm text-red-500">Please select a date</p>
              )}
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="execution-time" className="required">Execution Time</Label>
              <Select
                value={findTimeOption(executionTime)}
                onValueChange={(value) => updateScheduleData(undefined, value)}
              >
                <SelectTrigger id="execution-time" className="w-full">
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
          </div>
        </CardContent>
      </Card>
      
      <Card className="border-border/40">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
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
        </CardContent>
      </Card>
    </div>
  );
};

export default ScheduleStep;
