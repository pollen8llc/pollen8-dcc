
import { useState } from 'react';
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useUser } from "@/contexts/UserContext"
import { useToast } from "@/hooks/use-toast"
import * as communityService from "@/services/communityService"
import { useNavigate } from "react-router-dom"

const formSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters long"),
  description: z.string().min(10, "Description must be at least 10 characters long"),
  location: z.string().min(2, "Location is required"),
  communityType: z.string().optional(),
  format: z.string().optional(),
  targetAudience: z.string().optional(),
  tone: z.string().optional(),
  website: z.string().url().optional().or(z.literal("")),
  primaryPlatforms: z.array(z.string()).default([]),
  newsletterUrl: z.string().url().optional().or(z.literal("")),
  founder_name: z.string().min(2, "Founder name is required"),
  role_title: z.string().optional(),
  personal_background: z.string().optional(),
  community_structure: z.string().optional(),
  vision: z.string().optional(),
  community_values: z.string().optional(),
});

export type CommunityFormSchema = z.infer<typeof formSchema>;

export const useCommunityForm = (onSuccess?: (communityId: string) => void) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { currentUser } = useUser();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [createdCommunityId, setCreatedCommunityId] = useState<string | null>(null);

  const form = useForm<CommunityFormSchema>({
    resolver: zodResolver(formSchema),
    mode: 'onSubmit',
    defaultValues: {
      name: "",
      description: "",
      location: "",
      communityType: "",
      format: "",
      targetAudience: "",
      tone: "",
      website: "",
      primaryPlatforms: [],
      newsletterUrl: "",
      founder_name: currentUser?.name || "",
      role_title: "",
      personal_background: "",
      community_structure: "",
      vision: "",
      community_values: "",
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSubmitting) return;
    
    form.handleSubmit(async (values: CommunityFormSchema) => {
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
          tags: tags,
          communityType: values.communityType,
          format: values.format,
          tone: values.tone,
          imageUrl: "https://images.unsplash.com/photo-1577962917302-cd874c4e31d2?q=80&w=1742&auto=format&fit=crop&ixlib=rb-4.0.3",
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
    })(e);
  };

  return {
    form,
    activeTab,
    setActiveTab,
    isSubmitting,
    submissionError,
    handleSubmit,
    createdCommunityId,
  };
};
