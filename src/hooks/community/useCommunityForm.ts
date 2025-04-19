
import { useState } from 'react';
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useUser } from "@/contexts/UserContext"
import { communityFormSchema, type CommunityFormSchema } from "./schemas/communityFormSchema"
import { useSubmitCommunity } from "./useSubmitCommunity"

export const useCommunityForm = (onSuccess?: (communityId: string) => void) => {
  const { currentUser } = useUser();
  const [activeTab, setActiveTab] = useState("overview");
  const { submitCommunity, isSubmitting, submissionError, createdCommunityId } = useSubmitCommunity(onSuccess);

  const form = useForm<CommunityFormSchema>({
    resolver: zodResolver(communityFormSchema),
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
    form.handleSubmit(submitCommunity)(e);
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
