
import React from "react";
import { SocialMediaForm } from "@/components/community/SocialMediaForm";
import { Button } from "@/components/ui/button";

export function SocialMediaStep({ form, onNext, onPrev }) {
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
