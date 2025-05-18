
import React from "react";
import { Button } from "@/components/ui/button";
import { UseFormReturn } from "react-hook-form";
import { CommunityFormData } from "@/schemas/communitySchema";
import { 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel,
  FormDescription,
  FormMessage 
} from "@/components/ui/form";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { COMMUNITY_FORMATS } from "@/constants/communityConstants";

interface FormatStepProps {
  form: UseFormReturn<CommunityFormData>;
  onNext: () => void;
  onPrev: () => void;
}

export function FormatStep({ form, onNext, onPrev }: FormatStepProps) {
  const handleNext = () => {
    form.trigger("format").then((isValid) => {
      if (isValid) onNext();
    });
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-5">Community Format</h2>
      
      <div className="space-y-4 mb-8">
        <FormField
          control={form.control}
          name="format"
          render={({ field }) => (
            <FormItem>
              <FormLabel>How does your community meet?</FormLabel>
              <FormDescription>
                Choose how your community primarily gathers
              </FormDescription>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select format" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value={COMMUNITY_FORMATS.ONLINE}>Online</SelectItem>
                  <SelectItem value={COMMUNITY_FORMATS.IRL}>In-Person (IRL)</SelectItem>
                  <SelectItem value={COMMUNITY_FORMATS.HYBRID}>Hybrid</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={onPrev}>
          Back
        </Button>
        <Button type="button" onClick={handleNext}>
          Next
        </Button>
      </div>
    </div>
  );
}
