
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

export function TypeStep({ form, onNext, onPrev }) {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-5">Type of Community</h2>
      <FormField
        control={form.control}
        name="type"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Type*</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="tech">Tech</SelectItem>
                <SelectItem value="creative">Creative</SelectItem>
                <SelectItem value="wellness">Wellness</SelectItem>
                <SelectItem value="professional">Professional</SelectItem>
                <SelectItem value="social-impact">Social Impact</SelectItem>
                <SelectItem value="education">Education</SelectItem>
                <SelectItem value="social">Social</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      <div className="mt-8 flex justify-between">
        <Button variant="outline" onClick={onPrev}>Back</Button>
        <Button
          onClick={async () => {
            const valid = await form.trigger("type");
            if (valid) onNext();
          }}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
