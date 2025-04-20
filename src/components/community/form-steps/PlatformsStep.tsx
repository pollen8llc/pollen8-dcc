
import React from "react";
import { PlatformsForm } from "@/components/community/PlatformsForm";
import { Button } from "@/components/ui/button";
import { FormMessage } from "@/components/ui/form";

export function PlatformsStep({ form, onNext, onPrev }) {
  // No trigger needed, skip validation here
  return (
    <div>
      <h2 className="text-xl font-semibold mb-5">Communication Platforms</h2>
      <PlatformsForm form={form} />
      <FormMessage />
      <div className="mt-8 flex justify-between">
        <Button variant="outline" onClick={onPrev}>Back</Button>
        <Button onClick={onNext}>Next</Button>
      </div>
    </div>
  );
}
