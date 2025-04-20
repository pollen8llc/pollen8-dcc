
import React from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useCreateCommunityForm } from "@/hooks/forms/useCreateCommunityForm";
import { FormBasicInfo } from "@/components/community/form-sections/FormBasicInfo";
import { FormPlatforms } from "@/components/community/form-sections/FormPlatforms";
import { FormSocialMedia } from "@/components/community/form-sections/FormSocialMedia";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Toaster } from "@/components/ui/toaster";

export default function CreateCommunityProfile() {
  const { 
    form, 
    isSubmitting, 
    activeTab, 
    progress, 
    updateProgress, 
    onSubmit 
  } = useCreateCommunityForm();

  const goToNextStep = () => {
    if (activeTab === "basic-info") {
      // Validate the current form step before proceeding
      form.trigger(["name", "description", "type", "format", "location", "targetAudience"]);
      
      const basicInfoErrors = [
        form.formState.errors.name,
        form.formState.errors.description,
        form.formState.errors.type,
        form.formState.errors.format,
        form.formState.errors.location,
        form.formState.errors.targetAudience
      ];

      if (!basicInfoErrors.some(error => error)) {
        updateProgress("platforms");
      }
    } else if (activeTab === "platforms") {
      updateProgress("social-media");
    }
  };

  const goToPrevStep = () => {
    if (activeTab === "platforms") {
      updateProgress("basic-info");
    } else if (activeTab === "social-media") {
      updateProgress("platforms");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-background to-background/90 py-12 px-4">
      <div className="w-full max-w-2xl">
        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm mb-2">
            <span>Step {activeTab === "basic-info" ? "1" : activeTab === "platforms" ? "2" : "3"} of 3</span>
            <span>{progress}% complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Main content area with animation */}
        <div className="bg-card rounded-xl shadow-lg border border-primary/10 overflow-hidden">
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="p-6 md:p-8">
              <AnimatePresence mode="wait">
                {activeTab === "basic-info" && (
                  <motion.div
                    key="basic-info"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h2 className="text-2xl font-bold mb-6">Basic Community Information</h2>
                    <FormBasicInfo form={form} />
                  </motion.div>
                )}

                {activeTab === "platforms" && (
                  <motion.div
                    key="platforms"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h2 className="text-2xl font-bold mb-6">Communication Platforms</h2>
                    <FormPlatforms form={form} />
                  </motion.div>
                )}

                {activeTab === "social-media" && (
                  <motion.div
                    key="social-media"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h2 className="text-2xl font-bold mb-6">Online Presence</h2>
                    <FormSocialMedia form={form} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Navigation buttons */}
            <div className="flex justify-between items-center p-6 bg-muted/30 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={goToPrevStep}
                disabled={activeTab === "basic-info" || isSubmitting}
                className="gap-2"
              >
                <ChevronLeft className="h-4 w-4" /> Previous
              </Button>

              {activeTab !== "social-media" ? (
                <Button
                  type="button"
                  onClick={goToNextStep}
                  disabled={isSubmitting}
                  className="gap-2"
                >
                  Next <ChevronRight className="h-4 w-4" />
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Creating..." : "Create Community"}
                </Button>
              )}
            </div>
          </form>
        </div>
      </div>
      <Toaster />
    </div>
  );
}
