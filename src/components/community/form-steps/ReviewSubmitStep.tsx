
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { UseFormReturn } from "react-hook-form";
import { CommunityFormData } from "@/schemas/communitySchema";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import CommunityCardPreview from "./CommunityCardPreview";

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
  const { toast } = useToast();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      // Format values for database insertion
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !sessionData?.session?.user?.id) {
        setError("You must be logged in to create a community.");
        toast({
          variant: "destructive",
          title: "Error",
          description: "You must be logged in to create a community.",
        });
        setIsSubmitting(false);
        return;
      }

      // Transform data
      const targetAudienceArray = values.targetAudience
        ? values.targetAudience.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)
        : [];

      const communicationPlatforms = (values.platforms || []).reduce((acc, platform) => {
        acc[platform] = { enabled: true };
        return acc;
      }, {} as Record<string, any>);

      // Convert Date to ISO string for Supabase
      const startDateString = values.startDate ? values.startDate.toISOString() : null;

      // Compose insert object
      const insertObj = {
        name: values.name,
        description: values.description,
        type: values.type,
        format: values.format,
        location: values.location || "Remote",
        target_audience: targetAudienceArray,
        communication_platforms: communicationPlatforms,
        website: values.website || null,
        newsletter_url: values.newsletterUrl || null,
        social_media: values.socialMediaHandles || {},
        owner_id: sessionData.session.user.id,
        is_public: true,
        member_count: 1, // start with owner
        start_date: startDateString,
        community_size: values.communitySize || null, // use string range - not mapped to member_count!
        event_frequency: values.eventFrequency || null
      };

      // Do the insertion
      const { data: community, error: insertError } = await supabase
        .from("communities")
        .insert(insertObj)
        .select()
        .single();

      if (insertError || !community) {
        setError(insertError?.message || "Failed to create community.");
        toast({
          variant: "destructive",
          title: "Error",
          description: insertError?.message || "Failed to create community.",
        });
        setIsSubmitting(false);
        return;
      }

      toast({
        title: "Success",
        description: "Community created successfully!",
      });

      // Redirect to community profile after a short delay so toast can show
      setTimeout(() => {
        navigate(`/community/${community.id}`);
      }, 700);
    } catch (err: any) {
      setError(err?.message || "Unknown error occurred.");
      toast({
        variant: "destructive",
        title: "Error",
        description: err?.message || "Unknown error occurred.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-5 text-center">Preview & Submit</h2>
      <div className="flex justify-center mb-4">
        <CommunityCardPreview formValues={values} />
      </div>
      {error && (
        <div className="mt-4 text-sm text-red-600 bg-red-100 px-3 py-2 rounded">
          {error}
        </div>
      )}
      <div className="mt-8 flex justify-between items-center">
        <Button variant="outline" onClick={onPrev} disabled={isSubmitting}>
          Back
        </Button>
        <Button onClick={handleSubmit} disabled={isSubmitting}>
          {isSubmitting ? (
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
              Submitting...
            </span>
          ) : (
            "Submit"
          )}
        </Button>
      </div>
    </div>
  );
}

