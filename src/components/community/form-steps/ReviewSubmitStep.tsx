
import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { UseFormReturn } from "react-hook-form";
import { CommunityFormData } from "@/schemas/communitySchema";

interface ReviewSubmitStepProps {
  form: UseFormReturn<CommunityFormData>;
  onPrev: () => void;
  isSubmitting: boolean;
  setIsSubmitting: React.Dispatch<React.SetStateAction<boolean>>;
}

export function ReviewSubmitStep({ 
  form, 
  onPrev, 
  isSubmitting, 
  setIsSubmitting 
}: ReviewSubmitStepProps) {
  const navigate = useNavigate();
  const values = form.getValues();

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await form.handleSubmit(async (data) => {
        // Pop a toast or do submission here. For demo, redirect home:
        // (Replace with your real submission logic)
        // If using an async hook or service, insert here.
        // For now, just show a toast and reset.
        // Optionally: redirect to a thank you/page
        window.alert("Submitted! Here is your data: " + JSON.stringify(data, null, 2));
        navigate("/");
      })();
    } finally {
      setIsSubmitting(false);
    }
  };

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
        <Button onClick={handleSubmit} disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit"}
        </Button>
      </div>
    </div>
  );
}
