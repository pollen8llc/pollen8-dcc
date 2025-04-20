
import React from "react";
import { Button } from "@/components/ui/button";
import { UseFormReturn } from "react-hook-form";
import { CommunityFormData } from "@/schemas/communitySchema";

interface ReviewSubmitStepProps {
  form: UseFormReturn<CommunityFormData>;
  onPrev: () => void;
  isSubmitting: boolean;
  setIsSubmitting: React.Dispatch<React.SetStateAction<boolean>>;
  onActualSubmit: () => Promise<void>;
}

export function ReviewSubmitStep({ 
  form, 
  onPrev, 
  isSubmitting, 
  setIsSubmitting,
  onActualSubmit,
}: ReviewSubmitStepProps) {
  const values = form.getValues();

  // Display a summary of all responses
  return (
    <div>
      <h2 className="text-xl font-semibold mb-5">Review & Submit</h2>
      <div className="space-y-2 bg-muted/30 px-4 py-3 rounded">
        <pre className="overflow-x-auto whitespace-pre-wrap text-xs">
          {JSON.stringify(values, null, 2)}
        </pre>
      </div>
      <div className="mt-8 flex justify-between">
        <Button variant="outline" onClick={onPrev} disabled={isSubmitting}>Back</Button>
        <Button onClick={onActualSubmit} disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit"}
        </Button>
      </div>
    </div>
  );
}
