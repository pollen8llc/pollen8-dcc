
import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Navbar from "@/components/Navbar";
import CommunityHeader from "@/components/community/CommunityHeader";
import CommunityMetaInfo from "@/components/community/CommunityMetaInfo";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import * as communityService from "@/services/communityService";
import NotFoundState from "@/components/community/NotFoundState";
import { useState, useEffect } from "react";
import UnifiedCommunityForm from "@/components/community/form/UnifiedCommunityForm";

// Define schema for community form
const communityFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  is_public: z.boolean().default(true),
  location: z.string().optional(),
  format: z.enum(["online", "IRL", "hybrid"]).optional(),
  type: z.string().optional(),
  target_audience: z.string().optional(),
  website: z.string().url().optional().or(z.literal('')),
  newsletterUrl: z.string().url().optional().or(z.literal('')),
  social_media: z.object({
    twitter: z.string().url().optional().or(z.literal('')),
    linkedin: z.string().url().optional().or(z.literal('')),
    instagram: z.string().url().optional().or(z.literal('')),
    facebook: z.string().url().optional().or(z.literal(''))
  }).optional().default({
    twitter: "",
    linkedin: "",
    instagram: "",
    facebook: ""
  }),
  founder_name: z.string().optional(),
  role_title: z.string().optional(),
  vision: z.string().optional(),
  community_values: z.string().optional(),
  community_structure: z.string().optional()
});

type CommunityFormValues = z.infer<typeof communityFormSchema>;

const OrganizerDashboard = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isFormOpen, setIsFormOpen] = useState(false);

  const { data: community, isLoading, error } = useQuery({
    queryKey: ["community", id],
    queryFn: () => communityService.getCommunityById(id || ""),
    enabled: !!id,
  });

  // Create form with zod validation
  const form = useForm<CommunityFormValues>({
    resolver: zodResolver(communityFormSchema),
    defaultValues: {
      name: "",
      description: "",
      is_public: true,
      location: "",
      format: undefined,
      type: "",
      target_audience: "",
      website: "",
      newsletterUrl: "",
      social_media: {
        twitter: "",
        linkedin: "",
        instagram: "",
        facebook: ""
      },
      founder_name: "",
      role_title: "",
      vision: "",
      community_values: "",
      community_structure: ""
    }
  });

  // Update form values when community data is loaded
  useEffect(() => {
    if (community) {
      // Extract social media values with fallbacks to empty strings
      const socialMedia = community.social_media || {};
      const twitter = typeof socialMedia.twitter === 'string' ? socialMedia.twitter : '';
      const linkedin = typeof socialMedia.linkedin === 'string' ? socialMedia.linkedin : '';
      const instagram = typeof socialMedia.instagram === 'string' ? socialMedia.instagram : '';
      const facebook = typeof socialMedia.facebook === 'string' ? socialMedia.facebook : '';
      
      form.reset({
        name: community.name,
        description: community.description,
        is_public: community.is_public,
        location: community.location || "",
        format: (community.format as "online" | "IRL" | "hybrid") || undefined,
        type: community.type || "",
        target_audience: Array.isArray(community.target_audience) 
          ? community.target_audience.join(', ') 
          : (community.target_audience as string) || "",
        website: community.website || "",
        newsletterUrl: community.newsletter_url || community.newsletterUrl || "",
        social_media: {
          twitter,
          linkedin,
          instagram,
          facebook
        },
        founder_name: community.founder_name || "",
        role_title: community.role_title || "",
        vision: community.vision || "",
        community_values: community.community_values || "",
        community_structure: community.community_structure || ""
      });
    }
  }, [community, form]);

  const mutation = useMutation({
    mutationFn: async (updatedValues: CommunityFormValues) => {
      if (!community) throw new Error("No community loaded");
      
      // Convert target_audience from string to array if needed
      let targetAudienceArray = updatedValues.target_audience 
        ? updatedValues.target_audience.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)
        : [];
        
      return await communityService.updateCommunity({
        ...community,
        name: updatedValues.name,
        description: updatedValues.description,
        is_public: updatedValues.is_public,
        location: updatedValues.location,
        format: updatedValues.format,
        type: updatedValues.type,
        target_audience: targetAudienceArray,
        website: updatedValues.website,
        newsletter_url: updatedValues.newsletterUrl,
        social_media: updatedValues.social_media,
        founder_name: updatedValues.founder_name,
        role_title: updatedValues.role_title,
        vision: updatedValues.vision,
        community_values: updatedValues.community_values,
        community_structure: updatedValues.community_structure
      });
    },
    onSuccess() {
      toast({
        title: "Community updated",
        description: "Community details have been updated successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["community", id] });
      setIsFormOpen(false);
    },
    onError(error: any) {
      toast({
        title: "Update failed",
        description: error?.message || "Could not update the community.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (values: CommunityFormValues) => {
    console.log("Form submitted with values:", values);
    mutation.mutate(values);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container mx-auto py-20 text-center">
          <h1 className="text-2xl font-bold">Loading community...</h1>
        </div>
      </div>
    );
  }
  if (error || !community) {
    return <NotFoundState />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-10">
        <div className="mb-8">
          <CommunityHeader community={community} />
        </div>

        <div className="flex flex-col gap-8">
          <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <UnifiedCommunityForm
                mode="edit"
                community={community}
                onComplete={() => queryClient.invalidateQueries({ queryKey: ["community", id] })}
                onCancel={() => setIsFormOpen(false)}
              />
            </form>
          </FormProvider>

          <Card className="glass dark:glass-dark">
            <CardContent className="p-7">
              <h2 className="text-xl font-semibold mb-3">Meta Information</h2>
              <CommunityMetaInfo communityId={community.id} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default OrganizerDashboard;
