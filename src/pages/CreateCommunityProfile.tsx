
import React, { useState } from "react";
import { Progress } from "@/components/ui/progress";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { communityFormSchema, CommunityFormData } from "@/schemas/communitySchema";
import { Toaster } from "@/components/ui/toaster";
import { AnimatePresence, motion } from "framer-motion";
import {
  WelcomeStep,
  CommunityNameStep,
  DescriptionStep,
  TypeStep,
  LocationStep,
  StartDateStep,
  SizeStep,
  FormatStep,
  EventFrequencyStep,
  WebsiteStep,
  PlatformsStep,
  SocialMediaStep,
  TagsStep,
  ReviewSubmitStep,
} from "@/components/community/form-steps";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const FORM_STEPS = [
  "welcome",
  "name",
  "description",
  "type",
  "location",
  "startDate",
  "size",
  "format",
  "eventFrequency",
  "website",
  "platforms",
  "socialMedia",
  "tags",
  "review",
];

export default function CreateCommunityProfile() {
  const [stepIdx, setStepIdx] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const methods = useForm<CommunityFormData>({
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
      // For steps that are not in the main schema, handle with generic form context.
      // startDate, eventFrequency, communitySize, tags may need to be added or mapped
    },
    mode: "onTouched",
  });

  const totalSteps = FORM_STEPS.length;
  const progress = Math.round((stepIdx + 1) / totalSteps * 100);

  const navigate = useNavigate();
  const { toast } = useToast();

  // SUBMIT: Insert data and redirect to new profile
  const handleActualSubmit = async () => {
    setIsSubmitting(true);
    try {
      const values = methods.getValues();
      // Map data for DB as in your community creation logic
      const targetAudienceArray = values.targetAudience
        ? values.targetAudience.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)
        : [];

      const communicationPlatforms = (values.platforms || []).reduce((acc, platform) => {
        acc[platform] = { enabled: true };
        return acc;
      }, {} as Record<string, any>);

      const { data: session, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !session?.session?.user) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "You must be logged in to create a community.",
        });
        return;
      }

      const { data: community, error: insertError } = await supabase
        .from("communities")
        .insert({
          name: values.name,
          description: values.description,
          type: values.type,
          format: values.format,
          location: values.location || "Remote",
          target_audience: targetAudienceArray,
          communication_platforms: communicationPlatforms,
          website: values.website || null,
          newsletter_url: values.newsletterUrl || null,
          social_media: values.socialMediaHandles || {},
          owner_id: session.session.user.id,
          is_public: true,
          member_count: 1,
          community_size: values.communitySize || null, // use string value, not number!
          event_frequency: values.eventFrequency || null
        })
        .select()
        .single();

      if (insertError || !community) {
        toast({
          variant: "destructive",
          title: "Error",
          description: insertError?.message || "Failed to create community.",
        });
        setIsSubmitting(false);
        return;
      }

      toast({
        title: "Success",
        description: "Community created successfully!",
      });
      setTimeout(() => {
        navigate(`/community/${community.id}`);
      }, 200);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to create community.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNext = async () => {
    if (stepIdx < FORM_STEPS.length - 1) {
      setStepIdx((idx) => idx + 1);
    }
  };

  const handlePrev = () => {
    if (stepIdx > 0) {
      setStepIdx((idx) => idx - 1);
    }
  };

  const currentStepKey = FORM_STEPS[stepIdx];

  const renderStepComponent = () => {
    switch (currentStepKey) {
      case "welcome":
        return (
          <WelcomeStep onNext={handleNext} />
        );
      case "name":
        return (
          <CommunityNameStep form={methods} onNext={handleNext} onPrev={handlePrev} />
        );
      case "description":
        return (
          <DescriptionStep form={methods} onNext={handleNext} onPrev={handlePrev} />
        );
      case "type":
        return (
          <TypeStep form={methods} onNext={handleNext} onPrev={handlePrev} />
        );
      case "location":
        return (
          <LocationStep form={methods} onNext={handleNext} onPrev={handlePrev} />
        );
      case "startDate":
        return (
          <StartDateStep form={methods} onNext={handleNext} onPrev={handlePrev} />
        );
      case "size":
        return (
          <SizeStep form={methods} onNext={handleNext} onPrev={handlePrev} />
        );
      case "format":
        return (
          <FormatStep form={methods} onNext={handleNext} onPrev={handlePrev} />
        );
      case "eventFrequency":
        return (
          <EventFrequencyStep form={methods} onNext={handleNext} onPrev={handlePrev} />
        );
      case "website":
        return (
          <WebsiteStep form={methods} onNext={handleNext} onPrev={handlePrev} />
        );
      case "platforms":
        return (
          <PlatformsStep form={methods} onNext={handleNext} onPrev={handlePrev} />
        );
      case "socialMedia":
        return (
          <SocialMediaStep form={methods} onNext={handleNext} onPrev={handlePrev} />
        );
      case "tags":
        return (
          <TagsStep form={methods} onNext={handleNext} onPrev={handlePrev} />
        );
      case "review":
        return (
          <ReviewSubmitStep
            form={methods}
            onPrev={handlePrev}
            isSubmitting={isSubmitting}
            setIsSubmitting={setIsSubmitting}
            onActualSubmit={handleActualSubmit}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-background to-background/90 py-10 px-2">
      <div className="w-full max-w-xl">
        {/* Progress bar */}
        <div className="mb-6">
          <div className="flex justify-between text-xs mb-2">
            <span>
              Step {stepIdx + 1} of {totalSteps}
            </span>
            <span>{progress}% complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Form Step Container */}
        <div className="bg-card rounded-xl shadow-lg border border-primary/10 overflow-hidden">
          <FormProvider {...methods}>
            <form
              onSubmit={methods.handleSubmit((data) => {
                // The real submit logic is inside ReviewSubmitStep
              })}
            >
              <div className="p-6 min-h-[300px] flex flex-col">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentStepKey}
                    initial={{ opacity: 0, x: 24 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -24 }}
                    transition={{ duration: 0.28 }}
                  >
                    {renderStepComponent()}
                  </motion.div>
                </AnimatePresence>
              </div>
              {/* Navigation is handled in each step, show nothing here */}
            </form>
          </FormProvider>
        </div>
      </div>
      <Toaster />
    </div>
  );
}
