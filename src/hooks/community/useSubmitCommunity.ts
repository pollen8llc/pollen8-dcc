
import { useState } from 'react';
import { useToast } from "@/hooks/use-toast"
import { useNavigate } from "react-router-dom"
import * as communityService from "@/services/communityService"
import { CommunityFormSchema } from "./schemas/communityFormSchema"
import { useUser } from "@/contexts/UserContext"

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
      
      if (!currentUser || !currentUser.id) {
        throw new Error("You must be logged in to create a community");
      }

      const tags = values.targetAudience 
        ? values.targetAudience.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)
        : [];
      
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
        communitySize: values.size ? parseInt(values.size.toString()) : 0, // Changed from memberCount to communitySize
        organizerIds: [],
        memberIds: [],
        visionStatement: values.vision || "",
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
      const errorMessage = error?.message || "Unknown error occurred";
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
