
import { useState } from 'react';
import { useToast } from "@/hooks/use-toast"
import { useNavigate } from "react-router-dom"
import * as communityService from "@/services/community/communityMutationService"
import { CommunityFormSchema } from "./schemas/communityFormSchema"
import { useUser } from "@/contexts/UserContext"
import { supabase } from "@/integrations/supabase/client"

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

      // Process tags from targetAudience if it exists
      const tags = values.targetAudience 
        ? values.targetAudience.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)
        : [];
      
      // Handle social media - ensure we access properties that exist in the schema
      const socialMediaObject = {
        twitter: values.twitter || "",
        instagram: values.instagram || "",
        linkedin: values.linkedin || "",
        facebook: values.facebook || "",
      };

      // Handle platforms - ensure values.primaryPlatforms exists in the schema
      const communicationPlatformsObject = values.primaryPlatforms?.reduce((acc, platform) => {
        acc[platform] = { enabled: true };
        return acc;
      }, {} as Record<string, any>) || {};
      
      // Get the properly transformed size value from the schema
      // The transform function in the schema will handle the conversion
      const communitySize = typeof values.size !== 'undefined' ? values.size : 0;
      
      const communityData = {
        name: values.name,
        description: values.description,
        location: values.location,
        website: values.website || "",
        isPublic: true,
        tags,
        communityType: values.communityType,
        format: values.format,
        tone: values.tone,
        imageUrl: "https://images.unsplash.com/photo-1577962917302-cd874c4e31d2?q=80&w=1742&auto=format&fit=crop&ixlib=rb-4.0.3",
        communitySize,
        organizerIds: [session.session.user.id], // Explicitly set current user as organizer
        memberIds: [],
        role_title: values.role_title || "",
        community_structure: values.community_structure || "",
        vision: values.vision || "",
        socialMedia: socialMediaObject,
        communication_platforms: communicationPlatformsObject,
        newsletterUrl: values.newsletterUrl || "",
      };

      console.log("Creating community with data:", communityData);
      
      const community = await communityService.createCommunity(communityData);
      
      if (!community || !community.id) {
        throw new Error("Failed to create community - no community ID returned");
      }
      
      setCreatedCommunityId(community.id);
      
      toast({
        title: "Success!",
        description: "Community created successfully!",
        variant: "default",
      });

      setTimeout(() => {
        if (onSuccess && community?.id) {
          onSuccess(community.id);
        } else if (community?.id) {
          navigate(`/community/${community.id}`, { replace: true });
        }
      }, 1500);
      
    } catch (error: any) {
      console.error('Error in community creation:', error);
      
      // Format the error message based on common issues
      let errorMessage = error?.message || "Unknown error occurred";
      
      if (errorMessage.includes("violates row level security")) {
        errorMessage = "Permission denied: You don't have permission to create a community. Make sure your account has the correct role (Administrator or Organizer).";
      } else if (errorMessage.includes("not found")) {
        errorMessage = "The community could not be created due to a database configuration issue. Please contact an administrator.";
      }
      
      setSubmissionError(errorMessage);
      
      toast({
        variant: "destructive",
        title: "Error",
        description: errorMessage || "Failed to create community. Please try again.",
      });
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
