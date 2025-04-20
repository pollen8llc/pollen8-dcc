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
    
    if (!data.startDate) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Start date is required.",
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
    
    return true;
  };

  const createCommunity = async (data: CommunityFormData) => {
    try {
      setIsSubmitting(true);
      console.log("Creating community with data:", data);
      
      if (!validateFormData(data)) {
        throw new Error("Form validation failed");
      }
      
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !session?.user) {
        console.error("Session error:", sessionError);
        throw new Error("You must be logged in to create a community");
      }

      const targetAudienceArray = typeof data.targetAudience === 'string' 
        ? data.targetAudience.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0) 
        : data.targetAudience;

      const socialMediaObject = data.socialMediaHandles || {};

      const startDateISO = data.startDate ? new Date(data.startDate).toISOString() : new Date().toISOString();

      const communicationPlatformsObject = data.platforms?.reduce((acc, platform) => {
        acc[platform] = { enabled: true };
        return acc;
      }, {} as Record<string, any>);

      const { data: community, error: insertError } = await supabase
        .from('communities')
        .insert({
          name: data.name,
          description: data.description,
          community_type: data.communityType,
          location: data.location,
          owner_id: session.user.id,
          format: data.format,
          start_date: startDateISO,
          target_audience: targetAudienceArray,
          size_demographics: data.size,
          event_frequency: data.eventFrequency,
          communication_platforms: communicationPlatformsObject,
          website: data.website || "",
          newsletter_url: data.newsletterUrl || "",
          social_media: socialMediaObject
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

      navigate(`/community/${community.id}`);
      
      return community;
    } catch (error: any) {
      console.error("Error creating community:", error);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  return { createCommunity, isSubmitting };
};
