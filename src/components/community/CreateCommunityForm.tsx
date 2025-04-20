
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
import { AlertCircle, Loader2 } from "lucide-react";
import { BasicInfoForm } from "./BasicInfoForm";
import { PlatformsForm } from "./PlatformsForm";
import { SocialMediaForm } from "./SocialMediaForm";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

export function CreateCommunityForm() {
  const { createCommunity, isSubmitting } = useCreateCommunity();
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const { currentUser } = useUser();
  const navigate = useNavigate();
  const { toast } = useToast();
  
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
    try {
      setSubmissionError(null);
      
      if (!currentUser) {
        setSubmissionError("You must be logged in to create a community.");
        return;
      }

      console.log("Form submitted with data:", data);
      await createCommunity(data);
      
      toast({
        title: "Success!",
        description: "Your community has been created.",
      });

      navigate("/");
    } catch (error) {
      console.error("Error in form submission:", error);
      setSubmissionError(
        error instanceof Error ? error.message : "Failed to create community"
      );
      
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create community. Please try again.",
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Create Your Community</h1>
      
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
              <SocialMediaForm form={form} />
            </div>

            <Button
              type="submit"
              className="mt-6 w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Community"
              )}
            </Button>
          </Card>
        </form>
      </Form>
    </div>
  );
}
