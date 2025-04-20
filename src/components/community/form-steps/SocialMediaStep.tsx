
import React from "react";
import { SocialMediaForm } from "@/components/community/SocialMediaForm";
import { Button } from "@/components/ui/button";
import { UseFormReturn } from "react-hook-form";
import { CommunityFormData } from "@/schemas/communitySchema";

interface SocialMediaStepProps {
  form: UseFormReturn<CommunityFormData>;
  onNext: () => void;
  onPrev: () => void;
}

export function SocialMediaStep({ form, onNext, onPrev }: SocialMediaStepProps) {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-5">Social Media Links</h2>
      <SocialMediaForm form={form} />
      <div className="mt-8 flex justify-between">
        <Button variant="outline" onClick={onPrev}>Back</Button>
        <Button onClick={onNext}>Next</Button>
      </div>
    </div>
  );
}
