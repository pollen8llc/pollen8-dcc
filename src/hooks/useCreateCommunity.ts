
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { CommunityFormData } from "@/schemas/communitySchema";
import { useNavigate } from "react-router-dom";

export const useCreateCommunity = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const validateFormData = (data: CommunityFormData): boolean => {
    if (!data.name || data.name.length < 3) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Community name is required and must be at least 3 characters.",
      });
      return false;
    }
    
    if (!data.description || data.description.length < 10) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Description is required and must be at least 10 characters.",
      });
      return false;
    }
    
    if (!data.targetAudience) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Target audience is required.",
      });
      return false;
    }
    
    // Validate format is one of the allowed values
    if (data.format && !["online", "IRL", "hybrid"].includes(data.format)) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Format must be one of: online, IRL, hybrid",
      });
      return false;
    }
    
    return true;
  };

  const createCommunity = async (data: CommunityFormData) => {
    try {
      setIsSubmitting(true);
      console.log("Creating community with data:", data);
      
      if (!validateFormData(data)) {
        throw new Error("Form validation failed");
      }
      
      // Check for user session first
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error("Session error:", sessionError);
        throw new Error(`Authentication error: ${sessionError.message}`);
      }
      
      if (!session?.user) {
        console.error("No user session found");
        throw new Error("You must be logged in to create a community");
      }

      // Prepare the data for insertion
      const targetAudienceArray = typeof data.targetAudience === 'string' 
        ? data.targetAudience.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0) 
        : data.targetAudience;

      const socialMediaObject = data.socialMediaHandles || {};

      const communicationPlatformsObject = data.platforms?.reduce((acc, platform) => {
        acc[platform] = { enabled: true };
        return acc;
      }, {} as Record<string, any>) || {};

      // Make sure format is exactly one of the allowed values
      const format = data.format;
      console.log("Using format:", format);

      // Create the community with the owner_id explicitly set
      const { data: community, error: insertError } = await supabase
        .from('communities')
        .insert({
          name: data.name,
          description: data.description,
          type: data.type,
          location: data.location || "Remote",
          owner_id: session.user.id, // Explicitly set the current user as owner
          format: format,
          target_audience: targetAudienceArray,
          communication_platforms: communicationPlatformsObject,
          website: data.website || "",
          newsletter_url: data.newsletterUrl || "",
          social_media: socialMediaObject,
          member_count: "1" // Initialize with 1 (the owner) as a string
        })
        .select()
        .single();

      if (insertError) {
        console.error("Supabase error:", insertError);
        throw new Error(`Failed to create community: ${insertError.message}`);
      }

      if (!community) {
        console.error("No community data returned after creation");
        throw new Error("Failed to create community: No data returned");
      }

      console.log("Community created successfully:", community);
      
      toast({
        title: "Success!",
        description: "Community created successfully!",
      });

      // Navigate to the newly created community page
      navigate(`/community/${community.id}`);
      
      return community;
    } catch (error: any) {
      console.error("Error creating community:", error);
      
      // Improved error handling with more specific messages
      let errorMessage = "Failed to create community";
      
      if (error.message.includes("auth/unauthorized")) {
        errorMessage = "You must be logged in to create a community";
      } else if (error.message.includes("violates row level security")) {
        errorMessage = "Permission denied: You don't have permission to create a community";
      } else if (error.message.includes("duplicate key")) {
        errorMessage = "A community with this name already exists";
      } else if (error.message.includes("communities_format_check")) {
        errorMessage = "Invalid format value. Format must be 'online', 'IRL', or 'hybrid'";
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast({
        variant: "destructive",
        title: "Error",
        description: errorMessage,
      });
      
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  return { createCommunity, isSubmitting };
};
