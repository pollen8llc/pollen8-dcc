
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
      console.log("Submitting form with values:", values);
      
      if (!currentUser || !currentUser.id) {
        throw new Error("You must be logged in to create a community");
      }

      console.log("Current user attempting to create community:", currentUser);
      
      // Filter out empty social media entries
      const filteredSocialMedia = values.socialMedia
        ?.filter(sm => sm.platform || sm.url)
        .map(sm => ({
          platform: sm.platform || "",
          url: sm.url || ""
        }));
      
      // Convert tags from comma-separated string to array
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
        organizerIds: [currentUser.id],
        memberIds: [currentUser.id],
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
        imageUrl: "https://images.unsplash.com/photo-1577962917302-cd874c4e31d2?q=80&w=1742&auto=format&fit=crop&ixlib=rb-4.0.3"
      };

      console.log("Creating community with data:", communityData);
      
      // Create the community first
      let community;
      try {
        community = await communityService.createCommunity(communityData);
        console.log("Community created successfully:", community);
        
        if (!community || !community.id) {
          throw new Error("Failed to create community - no community ID returned");
        }
        
        // Store the community ID in case we need it for retry logic
        setCreatedCommunityId(community.id);
        
        // Next, create the organizer profile
        try {
          const organizerProfile = {
            community_id: community.id,
            founder_name: values.founder_name,
            role_title: values.role_title || "",
            personal_background: values.personal_background || "",
            size_demographics: values.size_demographics || "",
            community_structure: values.community_structure || "",
            team_structure: values.team_structure || "",
            tech_stack: values.tech_stack || "",
            event_formats: values.event_formats || "",
            business_model: values.business_model || "",
            community_values: values.community_values || "",
            challenges: values.challenges || "",
            vision: values.vision || "",
            special_notes: values.special_notes || "",
          };
  
          console.log("Creating organizer profile with data:", organizerProfile);
          await communityService.createOrganizerProfile(organizerProfile);
          console.log("Organizer profile created successfully");
          
          toast({
            title: "Success!",
            description: "Community created successfully!",
            variant: "default",
          });
  
          // Allow some time for database operations to complete
          setTimeout(() => {
            if (onSuccess && community?.id) {
              console.log(`Calling onSuccess handler with community ID: ${community.id}`);
              onSuccess(community.id);
            } else if (community?.id) {
              console.log(`Navigating to community page: /community/${community.id}`);
              navigate(`/community/${community.id}`, { replace: true });
            }
          }, 800);
          
        } catch (profileError) {
          console.error('Error creating organizer profile:', profileError);
          
          // Continue even if organizer profile creation fails - the community was already created
          toast({
            title: "Partial Success",
            description: "Community created but organizer profile failed. Some details may be missing.",
            variant: "default",
          });
          
          if (onSuccess && community.id) {
            onSuccess(community.id);
          } else {
            navigate(`/community/${community.id}`, { replace: true });
          }
        }
      } catch (communityError: any) {
        console.error('Error in community creation:', communityError);
        
        // Show a specific error message if available, otherwise show a generic one
        const errorMessage = communityError?.message || "Unknown error occurred";
        setSubmissionError(errorMessage);
        
        toast({
          variant: "destructive",
          title: "Error",
          description: `Failed to create community: ${errorMessage}`,
        });
      }
      
    } catch (error: any) {
      console.error('Error in overall submission process:', error);
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
