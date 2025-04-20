
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

export function SizeStep({ form, onNext, onPrev }) {
  // We'll use a string field in form, and map this as needed
  return (
    <div>
      <h2 className="text-xl font-semibold mb-5">Community Size</h2>
      <FormField
        control={form.control}
        name="communitySize"
        render={({ field }) => (
          <FormItem>
            <FormLabel>How many members?</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Estimate" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="1-10">1-10</SelectItem>
                <SelectItem value="11-100">11-100</SelectItem>
                <SelectItem value="101-1000">101-1,000</SelectItem>
                <SelectItem value="1001-10000">1,001-10,000</SelectItem>
                <SelectItem value="10001+">10,001+</SelectItem>
              </SelectContent>
            </Select>
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
