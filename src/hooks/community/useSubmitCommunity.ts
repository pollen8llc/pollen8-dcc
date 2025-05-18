
import { useState } from 'react';
import { useToast } from "@/hooks/use-toast"
import { useNavigate } from "react-router-dom"
import * as communityService from "@/services/community/communityMutationService"
import { CommunityFormSchema } from "./schemas/communityFormSchema"
import { useUser } from "@/contexts/UserContext"
import { supabase } from "@/integrations/supabase/client"
import { COMMUNITY_FORMATS } from "@/constants/communityConstants";

export const useSubmitCommunity = (onSuccess?: (communityId: string) => void) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { currentUser } = useUser();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [createdCommunityId, setCreatedCommunityId] = useState<string | null>(null);

  const submitCommunity = async (values: CommunityFormSchema) => {
    if (isSubmitting) return;
    
    try {
      console.log("Starting community submission with values:", JSON.stringify(values, null, 2));
      setIsSubmitting(true);
      setSubmissionError(null);
      
      // Verify session
      const { data: session, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !session.session) {
        throw new Error("You must be logged in to create a community");
      }
      
      if (!currentUser || !currentUser.id) {
        throw new Error("You must be logged in to create a community");
      }

      // Process tags from targetAudience
      const tags = Array.isArray(values.targetAudience) 
        ? values.targetAudience 
        : (typeof values.targetAudience === 'string' 
            ? values.targetAudience.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)
            : []);
      
      // Handle social media
      const socialMediaObject = {
        twitter: values.twitter || "",
        instagram: values.instagram || "",
        linkedin: values.linkedin || "",
        facebook: values.facebook || "",
      };

      // Handle communication platforms
      const communicationPlatformsObject = values.primaryPlatforms?.reduce((acc, platform) => {
        acc[platform] = { enabled: true };
        return acc;
      }, {} as Record<string, any>) || {};

      // Validate format
      const format = values.format;
      if (format && !Object.values(COMMUNITY_FORMATS).includes(format as any)) {
        throw new Error(`Invalid format: ${format}. Must be one of: ${Object.values(COMMUNITY_FORMATS).join(", ")}`);
      }

      console.log("Creating community with processed data:", {
        name: values.name,
        description: values.description,
        communityType: values.communityType,
        format: format,
        tags,
        socialMedia: socialMediaObject,
        platforms: communicationPlatformsObject
      });

      // Set a default size value since we removed the size field from the form
      const defaultSize = "1-100";

      const communityData = {
        name: values.name,
        description: values.description,
        location: values.location || "Remote",
        type: values.communityType,
        format: format as any,
        targetAudience: tags,
        size: defaultSize, // Use default size
        platforms: values.primaryPlatforms,
        website: values.website || "",
        newsletterUrl: values.newsletterUrl || "",
        socialMediaHandles: socialMediaObject,
      };

      const community = await communityService.createCommunity(communityData);
      
      console.log("Community created successfully:", community);
      
      if (!community || !community.id) {
        throw new Error("Failed to create community - no community ID returned");
      }
      
      setCreatedCommunityId(community.id);
      
      toast({
        title: "Success!",
        description: "Community created successfully!",
        variant: "default",
      });

      // If onSuccess callback is provided, call it
      if (onSuccess && community?.id) {
        onSuccess(community.id);
      }
      
      return community.id;
    } catch (error: any) {
      console.error('Error in community creation:', error);
      
      // Format the error message based on common issues
      let errorMessage = error?.message || "Unknown error occurred";
      
      if (errorMessage.includes("violates row level security")) {
        errorMessage = "Permission denied: You don't have permission to create a community. Make sure your account has the correct role (Administrator or Organizer).";
      } else if (errorMessage.includes("not found")) {
        errorMessage = "The community could not be created due to a database configuration issue. Please contact an administrator.";
      } else if (errorMessage.includes("format")) {
        errorMessage = `Invalid format. Must be one of: ${Object.values(COMMUNITY_FORMATS).join(", ")}`;
      }
      
      setSubmissionError(errorMessage);
      
      toast({
        variant: "destructive",
        title: "Error",
        description: errorMessage || "Failed to create community. Please try again.",
      });
      
      return null;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    submitCommunity,
    isSubmitting,
    submissionError,
    createdCommunityId,
  };
};
