
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { CommunityFormData } from "@/schemas/communitySchema";

export const useCreateCommunity = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const createCommunity = async (data: CommunityFormData) => {
    try {
      setIsSubmitting(true);
      
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.user) {
        throw new Error("You must be logged in to create a community");
      }

      // Convert targetAudience string to array if it's not already
      const targetAudienceArray = typeof data.targetAudience === 'string' 
        ? data.targetAudience.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0) 
        : data.targetAudience;

      // Prepare social media handles as a JSON object
      const socialMediaObject = data.socialMediaHandles || {};

      console.log("Creating community with data:", {
        name: data.name,
        description: data.description,
        community_type: data.communityType,
        location: data.location,
        owner_id: session.session.user.id,
        start_date: data.startDate,
        target_audience: targetAudienceArray,
        format: data.format,
        member_count: data.size,
        event_frequency: data.eventFrequency,
        platforms: data.platforms,
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
          owner_id: session.session.user.id, // Explicitly set the owner_id to the current user
          start_date: data.startDate,
          target_audience: targetAudienceArray,
          format: data.format,
          member_count: data.size,
          event_frequency: data.eventFrequency,
          primary_platforms: data.platforms, // Use platforms array
          website: data.website || "",
          newsletter_url: data.newsletterUrl || "",
          social_media: socialMediaObject
        })
        .select()
        .single();

      if (error) {
        console.error("Supabase error:", error);
        throw error;
      }

      toast({
        title: "Success!",
        description: "Your community has been created.",
      });

      navigate(`/community/${community.id}`);
    } catch (error) {
      console.error("Error creating community:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create community",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return { createCommunity, isSubmitting };
};
