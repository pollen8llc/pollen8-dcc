
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { communityFormSchema, type CommunityFormData } from "@/schemas/communitySchema";
import { useSubmitCommunity } from "@/hooks/community/useSubmitCommunity";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { CommunityFormSchema } from "@/hooks/community/schemas/communityFormSchema";

export const useCreateCommunityForm = () => {
  const { submitCommunity, isSubmitting } = useSubmitCommunity();
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [hasSession, setHasSession] = useState(false);

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

  useEffect(() => {
    const checkAuthState = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) {
          console.error("Auth check error:", error);
          setSubmissionError("Authentication error. Please try logging in again.");
          setHasSession(false);
        } else {
          console.log("Auth check - session:", data.session ? "Present" : "None");
          setHasSession(!!data.session);
        }
      } catch (err) {
        console.error("Error checking auth:", err);
        setHasSession(false);
      } finally {
        setIsCheckingAuth(false);
      }
    };
    
    checkAuthState();
  }, []);

  const onSubmit = async (data: CommunityFormData) => {
    try {
      setSubmissionError(null);
      
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !sessionData.session) {
        const errorMsg = "You must be logged in to create a community.";
        setSubmissionError(errorMsg);
        
        toast({
          variant: "destructive",
          title: "Authentication required",
          description: errorMsg,
        });
        
        navigate("/auth");
        return;
      }

      console.log("Form submitted with data:", JSON.stringify(data, null, 2));
      
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
      
      const communityData: CommunityFormSchema = {
        name: data.name,
        description: data.description,
        communityType: data.communityType,
        location: data.location,
        format: data.format,
        targetAudience: data.targetAudience,
        tone: "",
        website: data.website || "",
        primaryPlatforms: data.platforms,
        newsletterUrl: data.newsletterUrl || "",
        twitter: data.socialMediaHandles?.twitter || "",
        instagram: data.socialMediaHandles?.instagram || "",
        linkedin: data.socialMediaHandles?.linkedin || "",
        facebook: data.socialMediaHandles?.facebook || "",
        size: data.size,
      };
      
      await submitCommunity(communityData);
      
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

  const handleValidationFailed = (errors: any) => {
    console.error("Form validation errors:", JSON.stringify(errors, null, 2));
    
    const firstError = Object.entries(errors)[0];
    const fieldName = firstError[0];
    const errorMessage = (firstError[1] as { message?: string })?.message || 'Invalid field';
    
    toast({
      variant: "destructive",
      title: "Validation Error",
      description: `${fieldName}: ${errorMessage}`,
    });
  };

  return {
    form,
    isSubmitting,
    submissionError,
    isCheckingAuth,
    hasSession,
    onSubmit,
    handleValidationFailed
  };
};
