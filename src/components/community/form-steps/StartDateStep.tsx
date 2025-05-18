
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { DateSelect } from "@/components/ui/date-select";
import { UseFormReturn } from "react-hook-form";
import { CommunityFormData } from "@/schemas/communitySchema";

interface StartDateStepProps {
  form: UseFormReturn<CommunityFormData>;
  onNext: () => void;
  onPrev: () => void;
}

export function StartDateStep({ form, onNext, onPrev }: StartDateStepProps) {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-5">Date Organization Began</h2>
      <p className="text-muted-foreground mb-4">When did your community or organization start?</p>
      
      <div className="space-y-4">
        <FormField
          control={form.control}
          name="foundingDate"
          render={({ field }) => (
            <FormItem className="hidden">
              <FormControl>
                <input type="hidden" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="startDateMonth"
          render={({ field: monthField }) => (
            <FormField
              control={form.control}
              name="startDateDay"
              render={({ field: dayField }) => (
                <FormField
                  control={form.control}
                  name="startDateYear"
                  render={({ field: yearField }) => (
                    <FormItem>
                      <FormLabel>Organization Start Date</FormLabel>
                      <FormControl>
                        <DateSelect
                          monthValue={monthField.value?.toString() || ""}
                          onMonthChange={(value) => monthField.onChange(value)}
                          dayValue={dayField.value?.toString() || ""}
                          onDayChange={(value) => dayField.onChange(value)}
                          yearValue={yearField.value?.toString() || ""}
                          onYearChange={(value) => yearField.onChange(value)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            />
          )}
        />
      </div>
      
      <div className="mt-8 flex justify-between">
        <Button variant="outline" onClick={onPrev}>Back</Button>
        <Button onClick={onNext}>Next</Button>
      </div>
    </div>
  );
}
