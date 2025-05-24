
import { Button } from "@/components/ui/button";
import { FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useTriggerWizard } from "@/hooks/rel8t/useTriggerWizard";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { RecurrencePattern } from "@/services/rel8t/triggerService";
import { useFormContext } from "react-hook-form";

export function ScheduleStep({ validateAndNext }: { validateAndNext: () => void }) {
  const { handlePreviousStep, triggerTypes } = useTriggerWizard();
  const { control, watch, setValue, formState: { errors } } = useFormContext();
  const [recurrenceFrequency, setRecurrenceFrequency] = useState<number>(1);
  
  const formData = watch();
  
  useEffect(() => {
    // Ensure executionDate is set to a default if null
    if (!formData.executionDate) {
      setValue('executionDate', new Date());
    }
  }, [formData.executionDate, setValue]);

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
    console.log("Recurrence type changed to:", type);
    if (type === "one_time") {
      setValue('recurrenceType', 'one_time');
      setValue('recurrencePattern', null);
      return;
    }
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
    
    setValue('recurrenceType', type);
    setValue('recurrencePattern', recurrencePattern);
  };

  // Update frequency in recurrence pattern
  const updateFrequency = (frequency: number) => {
    console.log("Frequency updated to:", frequency);
    setRecurrenceFrequency(frequency);
    if (formData.recurrencePattern) {
      const updatedPattern = {
        ...formData.recurrencePattern,
        frequency
      };
      setValue('recurrencePattern', updatedPattern);
    }
  };
  
  const onPreviousClick = () => {
    console.log("Previous button clicked in ScheduleStep");
    handlePreviousStep();
  };
  
  const handleDateChange = (date: Date | undefined) => {
    console.log("Date changed to:", date);
    setValue('executionDate', date || null);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <FormItem>
          <FormLabel className="text-base">Start Date</FormLabel>
          <DatePicker
            value={formData.executionDate || undefined}
            onChange={handleDateChange}
            className={errors.executionDate ? "border-destructive" : ""}
          />
          {errors.executionDate && (
            <p className="text-sm text-destructive mt-1">{errors.executionDate.message as string}</p>
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
                setValue('executionDate', newDateTime);
                console.log("Time updated to:", newDateTime);
              }
            }}
            className="w-40"
          />
        </FormItem>

        <FormItem>
          <FormLabel className="text-base">Recurrence</FormLabel>
          <Select
            value={formData.recurrenceType || "one_time"}
            onValueChange={handleRecurrenceTypeChange}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select recurrence pattern" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="one_time">One time only</SelectItem>
              <SelectItem value={triggerTypes.HOURLY || "hourly"}>Hourly</SelectItem>
              <SelectItem value={triggerTypes.DAILY || "daily"}>Daily</SelectItem>
              <SelectItem value={triggerTypes.WEEKLY || "weekly"}>Weekly</SelectItem>
              <SelectItem value={triggerTypes.MONTHLY || "monthly"}>Monthly</SelectItem>
              <SelectItem value={triggerTypes.QUARTERLY || "quarterly"}>Quarterly</SelectItem>
              <SelectItem value={triggerTypes.YEARLY || "yearly"}>Yearly</SelectItem>
            </SelectContent>
          </Select>
        </FormItem>

        {formData.recurrenceType && formData.recurrenceType !== 'one_time' && (
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
        <Button type="button" variant="outline" onClick={onPreviousClick}>
          Previous
        </Button>
        <Button type="button" onClick={validateAndNext}>Next Step</Button>
      </div>
    </div>
  );
}
