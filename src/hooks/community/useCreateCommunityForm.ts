
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
      console.log("Submitting form with data:", JSON.stringify(data, null, 2));
      
      // Check for authentication
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.user) {
        throw new Error("You must be logged in to create a community");
      }
      
      // Process target audience as an array
      const targetAudienceArray = data.targetAudience
        .split(',')
        .map(item => item.trim())
        .filter(item => item.length > 0);
      
      // Process platforms as an object for the database
      const communicationPlatforms = data.platforms.reduce((acc, platform) => {
        acc[platform] = { enabled: true };
        return acc;
      }, {} as Record<string, any>);
      
      // Format social media data
      const socialMedia = data.socialMediaHandles || {};
      
      console.log("Transformed data ready for Supabase:", {
        name: data.name,
        description: data.description,
        type: data.type,
        format: data.format,
        location: data.location,
        target_audience: targetAudienceArray,
        communication_platforms: communicationPlatforms,
        website: data.website || null,
        newsletter_url: data.newsletterUrl || null,
        social_media: socialMedia,
        owner_id: session.session.user.id
      });

      // Insert into communities table
      const { data: community, error } = await supabase
        .from('communities')
        .insert({
          name: data.name,
          description: data.description,
          type: data.type,
          format: data.format,
          location: data.location,
          target_audience: targetAudienceArray,
          communication_platforms: communicationPlatforms,
          website: data.website || null,
          newsletter_url: data.newsletterUrl || null,
          social_media: socialMedia,
          owner_id: session.session.user.id,
          is_public: true,
          member_count: 1 // Start with 1 member (the owner)
        })
        .select()
        .single();

      if (error) {
        console.error("Error creating community:", error);
        throw error;
      }
      
      console.log("Community created successfully:", community);

      toast({
        title: "Success!",
        description: "Your community has been created.",
      });

      // Navigate to the community page after a short delay
      setTimeout(() => {
        navigate(`/community/${community.id}`);
      }, 1500);

    } catch (error: any) {
      console.error("Error creating community:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to create community",
      });
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
