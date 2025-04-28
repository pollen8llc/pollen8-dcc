import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { communityFormSchema, type CommunityFormData } from "@/schemas/communitySchema";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

export const useCreateCommunityForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("basic-info");
  const { toast } = useToast();
  const navigate = useNavigate();
  const [progress, setProgress] = useState(33);

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

  const updateProgress = (tab: string) => {
    setActiveTab(tab);
    switch (tab) {
      case "basic-info":
        setProgress(33);
        break;
      case "platforms":
        setProgress(66);
        break;
      case "social-media":
        setProgress(100);
        break;
    }
  };

  const onSubmit = async (data: CommunityFormData) => {
    try {
      setIsSubmitting(true);
      
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.user) {
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
      }, {} as Record<string, any>);

      // Ensure format is one of the allowed values
      const format = data.format;
      
      // Make sure it's exactly one of the allowed values
      if (!["online", "IRL", "hybrid"].includes(format)) {
        throw new Error(`Invalid format: ${format}. Must be one of: online, IRL, hybrid`);
      }

      // Create the community with the owner_id explicitly set
      const { data: community, error: insertError } = await supabase
        .from('communities')
        .insert({
          name: data.name,
          description: data.description,
          type: data.type,
          location: data.location,
          owner_id: session.session.user.id, // Explicitly set the current user as owner
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

  return {
    form,
    isSubmitting,
    activeTab,
    progress,
    updateProgress,
    onSubmit,
  };
};
