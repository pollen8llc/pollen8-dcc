
import { UseFormReturn } from "react-hook-form";
import { CommunityFormData } from "@/schemas/communitySchema";
import { CommunityBasicDetails } from "./form-sections/CommunityBasicDetails";
import { CommunityTypeAndFormat } from "./form-sections/CommunityTypeAndFormat";
import { CommunityMetrics } from "./form-sections/CommunityMetrics";
import { LocationAndAudience } from "./form-sections/LocationAndAudience";
import { DatesAndUrls } from "./form-sections/DatesAndUrls";

interface BasicInfoFormProps {
  form: UseFormReturn<CommunityFormData>;
}

export function BasicInfoForm({ form }: BasicInfoFormProps) {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Basic Information</h3>
      
      <CommunityBasicDetails form={form} />
      <CommunityTypeAndFormat form={form} />
      <CommunityMetrics form={form} />
      <LocationAndAudience form={form} />
      <DatesAndUrls form={form} />
    </div>
  );
}
