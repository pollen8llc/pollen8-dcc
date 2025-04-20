
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { DatePicker } from "@/components/ui/date-picker";
import { Button } from "@/components/ui/button";

export function StartDateStep({ form, onNext, onPrev }) {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-5">Date Organization Began</h2>
      <FormField
        control={form.control}
        name="startDate"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Organization Start Date</FormLabel>
            <FormControl>
              <DatePicker value={field.value} onChange={field.onChange} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <div className="mt-8 flex justify-between">
        <Button variant="outline" onClick={onPrev}>Back</Button>
        <Button onClick={onNext}>Next</Button>
      </div>
    </div>
  );
}
