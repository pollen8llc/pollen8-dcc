import React, { useState } from "react";
import { Progress } from "@/components/ui/progress";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { communityFormSchema, CommunityFormData } from "@/schemas/communitySchema";
import { Toaster } from "@/components/ui/toaster";
import { AnimatePresence, motion } from "framer-motion";
import { FormDebugger } from "@/components/debug/FormDebugger";
import { useDebugLogger } from "@/utils/debugLogger";
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
  const { debugLogs, addDebugLog, clearDebugLogs } = useDebugLogger();

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
      startDateMonth: "",
      startDateDay: "",
      startDateYear: "",
    },
    mode: "onTouched",
  });

  const totalSteps = FORM_STEPS.length;
  const progress = Math.round((stepIdx + 1) / totalSteps * 100);

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

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-background to-background/90 py-10 px-2">
      <div className="w-full max-w-4xl mb-6">
        <FormDebugger logs={debugLogs} />
      </div>
      
      <div className="w-full max-w-xl">
        <div className="mb-6">
          <div className="flex justify-between text-xs mb-2">
            <span>Step {stepIdx + 1} of {totalSteps}</span>
            <span>{progress}% complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <div className="bg-card rounded-xl shadow-lg border border-primary/10 overflow-hidden">
          <FormProvider {...methods}>
            <form
              onSubmit={methods.handleSubmit(() => {
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
            </form>
          </FormProvider>
        </div>
      </div>
      <Toaster />
    </div>
  );

  function renderStepComponent() {
    switch (currentStepKey) {
      case "welcome":
        return <WelcomeStep onNext={handleNext} />;
      case "name":
        return <CommunityNameStep form={methods} onNext={handleNext} onPrev={handlePrev} />;
      case "description":
        return <DescriptionStep form={methods} onNext={handleNext} onPrev={handlePrev} />;
      case "type":
        return <TypeStep form={methods} onNext={handleNext} onPrev={handlePrev} />;
      case "location":
        return <LocationStep form={methods} onNext={handleNext} onPrev={handlePrev} />;
      case "startDate":
        return <StartDateStep form={methods} onNext={handleNext} onPrev={handlePrev} />;
      case "size":
        return <SizeStep form={methods} onNext={handleNext} onPrev={handlePrev} />;
      case "format":
        return <FormatStep form={methods} onNext={handleNext} onPrev={handlePrev} />;
      case "eventFrequency":
        return <EventFrequencyStep form={methods} onNext={handleNext} onPrev={handlePrev} />;
      case "website":
        return <WebsiteStep form={methods} onNext={handleNext} onPrev={handlePrev} />;
      case "platforms":
        return <PlatformsStep form={methods} onNext={handleNext} onPrev={handlePrev} />;
      case "socialMedia":
        return <SocialMediaStep form={methods} onNext={handleNext} onPrev={handlePrev} />;
      case "tags":
        return <TagsStep form={methods} onNext={handleNext} onPrev={handlePrev} />;
      case "review":
        return (
          <ReviewSubmitStep
            form={methods}
            onPrev={handlePrev}
            isSubmitting={isSubmitting}
            setIsSubmitting={setIsSubmitting}
          />
        );
      default:
        return null;
    }
  }
}
