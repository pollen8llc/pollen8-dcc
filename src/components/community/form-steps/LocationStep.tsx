
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function LocationStep({ form, onNext, onPrev }) {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-5">Location</h2>
      <FormField
        control={form.control}
        name="location"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Location*</FormLabel>
            <FormControl>
              <Input placeholder="e.g. New York, Global, Remote" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <div className="mt-8 flex justify-between">
        <Button variant="outline" onClick={onPrev}>Back</Button>
        <Button
          onClick={async () => {
            const valid = await form.trigger("location");
            if (valid) onNext();
          }}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
