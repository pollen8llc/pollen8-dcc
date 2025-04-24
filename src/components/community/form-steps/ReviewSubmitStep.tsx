
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { UseFormReturn } from "react-hook-form";
import { CommunityFormData } from "@/schemas/communitySchema";
import { useNavigate } from "react-router-dom";
import { submitCommunity } from "@/services/community/communitySubmissionService";
import { useSubmitCommunityStatus } from "@/hooks/community/useSubmitCommunityStatus";
import CommunityCardPreview from "./CommunityCardPreview";

interface ReviewSubmitStepProps {
  form: UseFormReturn<CommunityFormData>;
  onPrev: () => void;
  isSubmitting: boolean;
}

export function ReviewSubmitStep({ 
  form, 
  onPrev, 
  isSubmitting 
}: ReviewSubmitStepProps) {
  const navigate = useNavigate();
  const [distributionId, setDistributionId] = useState<string | null>(null);
  const { status, error, communityId, isProcessing } = useSubmitCommunityStatus(distributionId);
  
  // Navigate when community is created
  React.useEffect(() => {
    if (communityId) {
      setTimeout(() => {
        navigate(`/community/${communityId}`);
      }, 1000);
    }
  }, [communityId, navigate]);

  const handleSubmit = async () => {
    try {
      // Use empty function for debug logs as we're using the status hook
      const result = await submitCommunity(form.getValues(), () => {});
      setDistributionId(result.id);
    } catch (err) {
      console.error('Submission error:', err);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-5 text-center">Preview & Submit</h2>
      
      <div className="flex justify-center mb-4">
        <CommunityCardPreview formValues={form.getValues()} />
      </div>
      
      {error && (
        <div className="mt-4 text-sm text-red-600 bg-red-100 px-3 py-2 rounded">
          {error}
        </div>
      )}
      
      {status && status !== 'failed' && (
        <div className="mt-4 text-sm bg-blue-100 px-3 py-2 rounded">
          Status: {status}
        </div>
      )}
      
      <div className="mt-8 flex justify-between items-center">
        <Button variant="outline" onClick={onPrev} disabled={isSubmitting || isProcessing}>
          Back
        </Button>
        
        <Button 
          onClick={handleSubmit} 
          disabled={isSubmitting || isProcessing}
        >
          {isSubmitting || isProcessing ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8z"
                />
              </svg>
              {status || 'Submitting...'}
            </span>
          ) : (
            "Submit"
          )}
        </Button>
      </div>
    </div>
  );
}
