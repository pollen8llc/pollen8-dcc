
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { CommunityFormData } from "@/schemas/communitySchema";

export const useCreateCommunity = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const createCommunity = async (data: CommunityFormData) => {
    try {
      setIsSubmitting(true);
      console.log("Creating community with data:", data);
      
      const { data: session, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error("Session error:", sessionError);
        throw new Error("Failed to get user session");
      }
      
      if (!session?.session?.user) {
        console.error("No authenticated user found");
        throw new Error("You must be logged in to create a community");
      }

      // Convert targetAudience string to array if it's not already
      const targetAudienceArray = typeof data.targetAudience === 'string' 
        ? data.targetAudience.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0) 
        : data.targetAudience;

      // Prepare social media handles as a JSON object
      const socialMediaObject = data.socialMediaHandles || {};

      // Ensure the start date is a valid ISO string
      const startDateISO = new Date(data.startDate).toISOString();

      // Prepare communication platforms as a JSON object
      const communicationPlatformsObject = data.platforms?.reduce((acc, platform) => {
        acc[platform] = { enabled: true };
        return acc;
      }, {} as Record<string, any>);

      // Debug information
      console.log("Creating community with processed data:", {
        name: data.name,
        description: data.description,
        community_type: data.communityType,
        location: data.location,
        owner_id: session.session.user.id,
        start_date: startDateISO,
        target_audience: targetAudienceArray,
        format: data.format,
        size_demographics: data.size, 
        event_frequency: data.eventFrequency,
        communication_platforms: communicationPlatformsObject,
        website: data.website,
        newsletter_url: data.newsletterUrl,
        social_media: socialMediaObject
      });

      const { data: community, error } = await supabase
        .from('communities')
        .insert({
          name: data.name,
          description: data.description,
          community_type: data.communityType,
          location: data.location,
          owner_id: session.session.user.id,
          format: data.format || "hybrid",
          start_date: startDateISO,
          target_audience: targetAudienceArray,
          size_demographics: data.size,
          event_frequency: data.eventFrequency || "monthly",
          communication_platforms: communicationPlatformsObject,
          website: data.website || "",
          newsletter_url: data.newsletterUrl || "",
          social_media: socialMediaObject
        })
        .select()
        .single();

      if (error) {
        console.error("Supabase error:", error);
        throw new Error(`Failed to create community: ${error.message}`);
      }

      if (!community) {
        console.error("No community data returned after creation");
        throw new Error("Failed to create community: No data returned");
      }

      console.log("Community created successfully:", community);
      return community;
    } catch (error) {
      console.error("Error creating community:", error);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  return { createCommunity, isSubmitting };
};
