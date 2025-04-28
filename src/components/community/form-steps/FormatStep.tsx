
import React from "react";
import { FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { UseFormReturn } from "react-hook-form";
import { CommunityFormData } from "@/schemas/communitySchema";

interface FormatStepProps {
  form: UseFormReturn<CommunityFormData>;
  onNext: () => void;
  onPrev: () => void;
}

export function FormatStep({ form, onNext, onPrev }: FormatStepProps) {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-5">Meeting Format</h2>
      <FormField
        control={form.control}
        name="format"
        render={({ field }) => (
          <FormItem>
            <FormLabel>How does your community meet?</FormLabel>
            <ToggleGroup
              type="single"
              value={field.value}
              onValueChange={field.onChange}
              className="justify-start"
            >
              <ToggleGroupItem
                value="online"
                className="data-[state=on]:bg-aquamarine data-[state=on]:text-black"
              >
                Online
              </ToggleGroupItem>
              <ToggleGroupItem
                value="IRL"
                className="data-[state=on]:bg-aquamarine data-[state=on]:text-black"
              >
                IRL
              </ToggleGroupItem>
              <ToggleGroupItem
                value="hybrid"
                className="data-[state=on]:bg-aquamarine data-[state=on]:text-black"
              >
                Hybrid
              </ToggleGroupItem>
            </ToggleGroup>
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
