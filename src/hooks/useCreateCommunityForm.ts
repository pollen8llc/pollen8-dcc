
import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { communityFormSchema, type CommunityFormData } from "@/schemas/communitySchema";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useDebugLogger } from "@/utils/debugLogger";
import { useFormProgress } from "@/hooks/useFormProgress";
import { submitCommunity } from "@/services/community/communitySubmissionService";

export const useCreateCommunityForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const isSubmittingRef = useRef(false);
  const { debugLogs, addDebugLog, clearDebugLogs } = useDebugLogger();
  const { activeTab, progress, updateProgress } = useFormProgress();

  const form = useForm<CommunityFormData>({
    resolver: zodResolver(communityFormSchema),
    defaultValues: {
      name: "",
      description: "",
      type: "tech",
      format: "hybrid",
      location: "",
      targetAudience: "",
      platforms: [],
      website: "",
      newsletterUrl: "",
      socialMediaHandles: {
        twitter: "",
        instagram: "",
        linkedin: "",
        facebook: "",
      },
    },
  });

  const onSubmit = async (data: CommunityFormData) => {
    if (isSubmittingRef.current) return;
    
    isSubmittingRef.current = true;
    setIsSubmitting(true);
    clearDebugLogs();
    
    try {
      addDebugLog('info', 'Submitting community creation form...');
      const community = await submitCommunity(data, addDebugLog);

      toast({
        title: "Success!",
        description: "Your community has been created.",
      });

      // Navigate after a short delay
      setTimeout(() => {
        navigate(`/community/${community.id}`);
      }, 1000);

    } catch (error: any) {
      addDebugLog('error', `Error: ${error.message || "Unknown error"}`);
      
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to create community",
      });
    } finally {
      setIsSubmitting(false);
      isSubmittingRef.current = false;
    }
  };

  return {
    form,
    isSubmitting,
    activeTab,
    progress,
    updateProgress,
    onSubmit,
    debugLogs,
    addDebugLog,
    clearDebugLogs
  };
};
