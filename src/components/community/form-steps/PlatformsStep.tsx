
import React from "react";
import { FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { UseFormReturn } from "react-hook-form";
import { CommunityFormData } from "@/schemas/communitySchema";

interface PlatformsStepProps {
  form: UseFormReturn<CommunityFormData>;
  onNext: () => void;
  onPrev: () => void;
}

const platformOptions = [
  { id: "discord", label: "Discord" },
  { id: "slack", label: "Slack" },
  { id: "whatsapp", label: "WhatsApp" },
  { id: "luma", label: "Luma" },
  { id: "eventbrite", label: "Eventbrite" },
  { id: "meetup", label: "Meetup" },
  { id: "circle", label: "Circle" },
  { id: "hivebrite", label: "Hivebrite" },
  { id: "skool", label: "Skool" },
] as const;

export function PlatformsStep({ form, onNext, onPrev }: PlatformsStepProps) {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-5">Communication Platforms</h2>
      <FormField
        control={form.control}
        name="platforms"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Select the platforms your community uses</FormLabel>
            <div className="grid grid-cols-3 gap-3 mt-4">
              {platformOptions.map((platform) => (
                <Button
                  key={platform.id}
                  type="button"
                  variant="outline"
                  className={`h-20 flex flex-col items-center justify-center gap-2 ${
                    field.value?.includes(platform.id)
                      ? "bg-aquamarine text-black border-aquamarine"
                      : ""
                  }`}
                  onClick={() => {
                    const newValue = field.value || [];
                    if (newValue.includes(platform.id)) {
                      field.onChange(
                        newValue.filter((value) => value !== platform.id)
                      );
                    } else {
                      field.onChange([...newValue, platform.id]);
                    }
                  }}
                >
                  {platform.label}
                </Button>
              ))}
            </div>
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
