
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { UseFormReturn } from "react-hook-form";
import { CommunityFormData } from "@/schemas/communitySchema";
import { useNavigate } from "react-router-dom";
import { submitCommunity } from "@/services/community/communitySubmissionService";
import { useSubmitCommunityStatus } from "@/hooks/community/useSubmitCommunityStatus";
import CommunityCardPreview from "./CommunityCardPreview";
import { useToast } from "@/hooks/use-toast";
import { COMMUNITY_FORMATS } from "@/constants/communityConstants";

interface ReviewSubmitStepProps {
  form: UseFormReturn<CommunityFormData>;
  onPrev: () => void;
  isSubmitting: boolean;
}

export function ReviewSubmitStep({ 
  form, 
  onPrev, 
  isSubmitting: propIsSubmitting 
}: ReviewSubmitStepProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [localIsSubmitting, setLocalIsSubmitting] = useState(false);
  const [distributionId, setDistributionId] = useState<string | null>(null);
  const { status, communityId, isProcessing } = useSubmitCommunityStatus(distributionId);
  
  // Combined submitting state
  const isSubmitting = propIsSubmitting || localIsSubmitting;

  // Navigate when community is created
  React.useEffect(() => {
    if (communityId) {
      toast({
        title: "Success!",
        description: "Community created successfully!",
      });
      
      navigate(`/community/${communityId}`);
    }
  }, [communityId, navigate, toast]);

  const handleSubmit = async () => {
    try {
      setLocalIsSubmitting(true);
      
      // Get the form values
      const formValues = form.getValues();
      
      // Validate format is one of the allowed values
      if (!Object.values(COMMUNITY_FORMATS).includes(formValues.format as any)) {
        toast({
          variant: "destructive",
          title: "Validation Error",
          description: `Format must be one of: ${Object.values(COMMUNITY_FORMATS).join(", ")}`,
        });
        setLocalIsSubmitting(false);
        return;
      }
      
      // Create logger function for internal tracking
      const addDebugLog = (type: 'info' | 'error' | 'success', message: string) => {
        console.log(`[${type}] ${message}`);
      };
      
      // Submit the form - errors will be logged to submission_errors table
      const result = await submitCommunity(formValues, addDebugLog);
      setDistributionId(result.id);
      
      // If we get a community_id back immediately, navigate
      if (result.community_id) {
        navigate(`/community/${result.community_id}`);
      }
    } catch (err: any) {
      console.error('Submission error:', err);
      setLocalIsSubmitting(false);
      
      // Show a more specific error message if it's related to the format constraint
      if (err.message && err.message.includes('format')) {
        toast({
          variant: "destructive",
          title: "Format Error",
          description: `Invalid format. Must be one of: ${Object.values(COMMUNITY_FORMATS).join(", ")}`,
        });
        return;
      }
      
      // Only show a generic error message to the user
      toast({
        title: "Submission in Progress",
        description: "Your community is being created. You'll be redirected once it's ready.",
      });
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-5 text-center">Preview & Submit</h2>
      
      <div className="flex justify-center mb-4">
        <CommunityCardPreview formValues={form.getValues()} />
      </div>
      
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
