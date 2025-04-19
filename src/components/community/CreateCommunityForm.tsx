
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { communityFormSchema, type CommunityFormData } from "@/schemas/communitySchema";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Card } from "@/components/ui/card";
import { useCreateCommunity } from "@/hooks/useCreateCommunity";
import { useUser } from "@/contexts/UserContext";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { BasicInfoForm } from "./BasicInfoForm";
import { PlatformsForm } from "./PlatformsForm";
import { SocialMediaForm } from "./SocialMediaForm";

export function CreateCommunityForm() {
  const { createCommunity, isSubmitting } = useCreateCommunity();
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const { currentUser } = useUser();
  
  const form = useForm<CommunityFormData>({
    resolver: zodResolver(communityFormSchema),
    defaultValues: {
      name: "",
      description: "",
      communityType: "tech",
      location: "",
      startDate: new Date().toISOString(),
      targetAudience: "",
      format: "hybrid",
      size: "1-100",
      eventFrequency: "monthly",
      website: "",
      newsletterUrl: "",
      socialMediaHandles: {
        twitter: "",
        instagram: "",
        linkedin: "",
        facebook: "",
      },
      platforms: [],
    },
  });

  const onSubmit = async (data: CommunityFormData) => {
    console.log("Form submitted with data:", data);
    setSubmissionError(null);
    
    if (!currentUser) {
      setSubmissionError("You must be logged in to create a community.");
      return;
    }
    
    try {
      await createCommunity(data);
    } catch (error) {
      console.error("Error in form submission:", error);
      setSubmissionError(
        error instanceof Error ? error.message : "Failed to create community"
      );
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {submissionError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{submissionError}</AlertDescription>
          </Alert>
        )}
        
        <Card className="p-6">
          <div className="space-y-6">
            <BasicInfoForm form={form} />
            <PlatformsForm form={form} />
            
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Social Media</h3>
              <SocialMediaForm form={form} />
            </div>
          </div>

          <Button
            type="submit"
            className="mt-6 w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating..." : "Create Community"}
          </Button>
        </Card>
      </form>
    </Form>
  );
}
