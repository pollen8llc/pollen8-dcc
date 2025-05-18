
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { communitySchema, type CommunityFormData } from "@/schemas/communitySchema";
import { createCommunity, updateCommunity, CommunityError, PermissionError } from "@/services/communityService";

type UseCommunityFormProps = {
  mode: 'create' | 'edit';
  communityId?: string;
  defaultValues?: Partial<CommunityFormData>;
};

export const useCommunityForm = ({ mode, communityId, defaultValues = {} }: UseCommunityFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Merge provided default values with required empty values
  const formDefaultValues = {
    name: "",
    description: "",
    type: "tech",
    format: "hybrid",
    location: "Remote",
    target_audience: [],
    website: "",
    newsletter_url: "",
    social_media: {
      twitter: "",
      instagram: "",
      linkedin: "",
      facebook: ""
    },
    is_public: true,
    ...defaultValues
  };

  const form = useForm<CommunityFormData>({
    resolver: zodResolver(communitySchema),
    defaultValues: formDefaultValues,
    mode: "onChange"
  });

  const onSubmit = async (data: CommunityFormData) => {
    setIsSubmitting(true);
    
    try {
      let result;
      
      if (mode === 'create') {
        // Create new community
        result = await createCommunity(data);
        toast({
          title: "Success!",
          description: "Your community has been created successfully.",
        });
      } else if (mode === 'edit' && communityId) {
        // Update existing community
        result = await updateCommunity(communityId, data);
        toast({
          title: "Success!",
          description: "Community updated successfully.",
        });
      }

      // Navigate after successful operation
      setTimeout(() => {
        if (result?.id) {
          navigate(`/community/${result.id}`);
        }
      }, 500);

    } catch (error) {
      console.error("Form submission error:", error);
      
      if (error instanceof PermissionError) {
        toast({
          variant: "destructive",
          title: "Permission Error",
          description: error.message
        });
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: error instanceof CommunityError 
            ? error.message 
            : "Failed to process community. Please try again."
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    form,
    isSubmitting,
    onSubmit,
  };
};
