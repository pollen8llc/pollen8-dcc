
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
import { supabase } from "@/integrations/supabase/client";

export function CreateCommunityForm() {
  const { createCommunity, isSubmitting } = useCreateCommunity();
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const { currentUser, isLoading } = useUser();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Check if user is authenticated at the form level
  const [checkingAuth, setCheckingAuth] = useState(true);
  
  useState(() => {
    const checkAuth = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) {
          console.error("Auth check error:", error);
          setSubmissionError("Authentication error. Please log in again.");
        }
        setCheckingAuth(false);
      } catch (err) {
        console.error("Error checking auth:", err);
        setCheckingAuth(false);
      }
    };
    
    checkAuth();
  });
  
  const form = useForm<CommunityFormData>({
    resolver: zodResolver(communityFormSchema),
    defaultValues: {
      name: "",
      description: "",
      communityType: "tech",
      location: "",
      startDate: new Date().toISOString().split('T')[0],
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
    mode: "onSubmit",
  });

  const onSubmit = async (data: CommunityFormData) => {
    try {
      setSubmissionError(null);
      
      if (!currentUser) {
        setSubmissionError("You must be logged in to create a community.");
        
        toast({
          variant: "destructive",
          title: "Authentication required",
          description: "You need to be logged in to create a community",
        });
        
        navigate("/auth");
        return;
      }

      console.log("Form submitted with data:", data);
      
      // Validate date format
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(data.startDate)) {
        setSubmissionError("Invalid date format. Please use YYYY-MM-DD format.");
        toast({
          variant: "destructive",
          title: "Validation Error",
          description: "Invalid date format. Please use YYYY-MM-DD format.",
        });
        return;
      }
      
      const result = await createCommunity(data);
      
      console.log("Community created successfully:", result);
      
      toast({
        title: "Success!",
        description: "Your community has been created.",
      });

    } catch (error) {
      console.error("Error in form submission:", error);
      setSubmissionError(
        error instanceof Error ? error.message : "Failed to create community"
      );
    }
  };

  // Debug logs to help diagnose form issues
  console.log("Form state:", {
    isValid: form.formState.isValid,
    errors: form.formState.errors,
    dirtyFields: form.formState.dirtyFields,
    values: form.getValues(),
    isSubmitting: isSubmitting,
    currentUser: currentUser
  });

  const handleValidationFailed = (errors: any) => {
    console.error("Form validation errors:", errors);
    
    // Get the first error message for the toast
    const firstError = Object.entries(errors)[0];
    const fieldName = firstError[0];
    const errorMessage = (firstError[1] as { message?: string })?.message || 'Invalid field';
    
    toast({
      variant: "destructive",
      title: "Validation Error",
      description: `${fieldName}: ${errorMessage}`,
    });
  };

  if (isLoading || checkingAuth) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading...</span>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Authentication Required</AlertTitle>
          <AlertDescription>
            You need to be logged in to create a community.
          </AlertDescription>
        </Alert>
        <Button onClick={() => navigate("/auth")}>Go to Login</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Create Your Community</h1>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit, handleValidationFailed)} className="space-y-8">
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
