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
  
  launchDate: z.string().optional(),
  memberCount: z.number().default(1),
  memberCapacity: z.number().optional(),
  eventFrequency: z.string().optional(),
  
  website: z.string().url().optional().or(z.literal("")),
  primaryPlatforms: z.array(z.string()).default([]),
  newsletterUrl: z.string().url().optional().or(z.literal("")),
  socialMedia: z.array(z.object({
    platform: z.string().optional(),
    url: z.string().optional()
  })).optional().default([{}, {}, {}]),
  
  founder_name: z.string().min(2, "Founder name is required"),
  role_title: z.string().optional(),
  personal_background: z.string().optional(),
  community_structure: z.string().optional(),
  vision: z.string().optional(),
  community_values: z.string().optional(),

  size_demographics: z.string().optional(),
  team_structure: z.string().optional(),
  tech_stack: z.string().optional(),
  event_formats: z.string().optional(),
  business_model: z.string().optional(),
  challenges: z.string().optional(),
  special_notes: z.string().optional(),
}).refine((data) => {
  if (data.name.trim().length < 3) {
    throw new Error("Community name must be at least 3 characters long")
  }
  return true
}, {
  message: "Invalid form data"
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
      launchDate: "",
      memberCount: 1,
      memberCapacity: 0,
      eventFrequency: "",
      website: "",
      primaryPlatforms: [],
      newsletterUrl: "",
      socialMedia: [{}, {}, {}],
      founder_name: currentUser?.name || "",
      role_title: "",
      personal_background: "",
      community_structure: "",
      vision: "",
      community_values: "",
      size_demographics: "",
      team_structure: "",
      tech_stack: "",
      event_formats: "",
      business_model: "",
      challenges: "",
      special_notes: "",
    }
  });

  const handleSubmit = async (values: CommunityFormSchema) => {
    if (isSubmitting) return;
    
    try {
      setIsSubmitting(true);
      setSubmissionError(null);
      
      if (!currentUser || !currentUser.id) {
        throw new Error("You must be logged in to create a community");
      }

      const filteredSocialMedia = values.socialMedia
        ?.filter(sm => sm.platform || sm.url)
        .map(sm => ({
          platform: sm.platform || "",
          url: sm.url || ""
        }));
      
      const tags = values.targetAudience 
        ? values.targetAudience.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)
        : [];
      
      const communityData = {
        name: values.name,
        description: values.description,
        location: values.location,
        website: values.website || "",
        isPublic: true,
        memberCount: values.memberCount || 1,
        tags: tags,
        communityType: values.communityType,
        format: values.format,
        tone: values.tone,
        launchDate: values.launchDate,
        memberCapacity: values.memberCapacity,
        eventFrequency: values.eventFrequency,
        newsletterUrl: values.newsletterUrl || "",
        socialMedia: filteredSocialMedia,
        primaryPlatforms: values.primaryPlatforms.filter(p => p),
        imageUrl: "https://images.unsplash.com/photo-1577962917302-cd874c4e31d2?q=80&w=1742&auto=format&fit=crop&ixlib=rb-4.0.3",
        founder_name: values.founder_name,
        role_title: values.role_title,
        personal_background: values.personal_background,
        community_structure: values.community_structure,
        vision: values.vision,
        community_values: values.community_values,
        size_demographics: values.size_demographics,
        team_structure: values.team_structure,
        tech_stack: values.tech_stack,
        event_formats: values.event_formats,
        business_model: values.business_model,
        challenges: values.challenges,
        special_notes: values.special_notes,
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
      }, 800);
      
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
    form,
    activeTab,
    setActiveTab,
    isSubmitting,
    submissionError,
    handleSubmit: form.handleSubmit(handleSubmit),
    createdCommunityId,
  };
};
