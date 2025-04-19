
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

      // Debug information
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
        communication_platforms: data.platforms, // Using existing communication_platforms column
        website: data.website,
        newsletter_url: data.newsletterUrl,
        social_media: socialMediaObject
      });

      // Insert into communities table with correct column names
      const { data: community, error } = await supabase
        .from('communities')
        .insert({
          name: data.name,
          description: data.description,
          community_type: data.communityType,
          location: data.location,
          owner_id: session.session.user.id,
          format: data.format || "hybrid",
          start_date: new Date(data.startDate).toISOString(), // Make sure date is in ISO format
          target_audience: targetAudienceArray,
          member_count: data.size || 0,
          event_frequency: data.eventFrequency || "monthly",
          communication_platforms: data.platforms, // Using existing communication_platforms column
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
