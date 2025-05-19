import { Button } from "@/components/ui/button";
import { FormItem, FormLabel } from "@/components/ui/form";
import { useTriggerWizard } from "@/hooks/rel8t/useTriggerWizard";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { RecurrencePattern } from "@/services/rel8t/triggerService";

export function ScheduleStep() {
  const { formData, updateFormData, handleNextStep, handlePreviousStep, errors, triggerTypes } = useTriggerWizard();
  const [recurrenceFrequency, setRecurrenceFrequency] = useState<number>(1);

  // Helper to format time string
  const formatTimeString = (date: Date | null): string => {
    if (!date) return "12:00";
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
  };

  // Helper to parse time string
  const parseTimeString = (timeStr: string, date: Date | null): Date => {
    if (!date) date = new Date();
    const [hours, minutes] = timeStr.split(':').map(Number);
    const newDate = new Date(date);
    newDate.setHours(hours, minutes);
    return newDate;
  };

  // Handle recurrence type change
  const handleRecurrenceTypeChange = (type: string) => {
    // Create a basic recurrence pattern based on the selected type
    let recurrencePattern: RecurrencePattern = {
      type,
      startDate: formData.executionDate?.toISOString() || new Date().toISOString(),
      frequency: recurrenceFrequency
    };
    
    // Add specific fields based on recurrence type
    if (type === triggerTypes.WEEKLY) {
      recurrencePattern = {
        ...recurrencePattern,
        daysOfWeek: [new Date().getDay()]
      };
    } else if (type === triggerTypes.MONTHLY) {
      recurrencePattern = {
        ...recurrencePattern,
        dayOfMonth: new Date().getDate()
      };
    }
    
    updateFormData({
      recurrenceType: type,
      recurrencePattern
    });
  };

  // Update frequency in recurrence pattern
  const updateFrequency = (frequency: number) => {
    setRecurrenceFrequency(frequency);
    if (formData.recurrencePattern) {
      updateFormData({
        recurrencePattern: {
          ...formData.recurrencePattern,
          frequency
        }
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <FormItem>
          <FormLabel className="text-base">Start Date</FormLabel>
          <DatePicker
            value={formData.executionDate || undefined}
            onChange={(date) => updateFormData({ executionDate: date || null })}
            className={errors.executionDate ? "border-destructive" : ""}
          />
          {errors.executionDate && (
            <p className="text-sm text-destructive mt-1">{errors.executionDate}</p>
          )}
        </FormItem>

        <FormItem>
          <FormLabel className="text-base">Start Time</FormLabel>
          <Input 
            type="time"
            value={formatTimeString(formData.executionDate)}
            onChange={(e) => {
              if (formData.executionDate) {
                const newDateTime = parseTimeString(e.target.value, formData.executionDate);
                updateFormData({ executionDate: newDateTime });
              }
            }}
            className="w-40"
          />
        </FormItem>

        <FormItem>
          <FormLabel className="text-base">Recurrence</FormLabel>
          <Select
            value={formData.recurrenceType || ""}
            onValueChange={handleRecurrenceTypeChange}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select recurrence pattern" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">One time only</SelectItem>
              <SelectItem value={triggerTypes.HOURLY}>Hourly</SelectItem>
              <SelectItem value={triggerTypes.DAILY}>Daily</SelectItem>
              <SelectItem value={triggerTypes.WEEKLY}>Weekly</SelectItem>
              <SelectItem value={triggerTypes.MONTHLY}>Monthly</SelectItem>
              <SelectItem value={triggerTypes.QUARTERLY}>Quarterly</SelectItem>
              <SelectItem value={triggerTypes.YEARLY}>Yearly</SelectItem>
            </SelectContent>
          </Select>
        </FormItem>

        {formData.recurrenceType && (
          <FormItem>
            <FormLabel className="text-base">Frequency</FormLabel>
            <div className="flex items-center space-x-2">
              <p>Every</p>
              <Input 
                type="number" 
                min={1} 
                max={99}
                value={recurrenceFrequency}
                onChange={(e) => updateFrequency(parseInt(e.target.value) || 1)}
                className="w-20"
              />
              <p>{formData.recurrenceType.toLowerCase()}
                {recurrenceFrequency > 1 ? 
                  (formData.recurrenceType === triggerTypes.DAILY ? "s" : 
                   formData.recurrenceType === triggerTypes.HOURLY ? "s" : "") : ""}
              </p>
            </div>
          </FormItem>
        )}
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
