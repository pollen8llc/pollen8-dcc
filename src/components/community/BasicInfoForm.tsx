
import { UseFormReturn } from "react-hook-form";
import { CommunityFormData } from "@/schemas/communitySchema";
import { CommunityBasicDetails } from "./form-sections/CommunityBasicDetails";
import { CommunityTypeAndFormat } from "./form-sections/CommunityTypeAndFormat";
import { LocationAndAudience } from "./form-sections/LocationAndAudience";
import { DatesAndUrls } from "./form-sections/DatesAndUrls";

interface BasicInfoFormProps {
  form: UseFormReturn<CommunityFormData>;
}

export function BasicInfoForm({ form }: BasicInfoFormProps) {
  return (
    <div className="space-y-8">
      <h3 className="text-xl font-semibold text-center mb-6 text-primary">Basic Information</h3>
      
      <CommunityBasicDetails form={form} />
      <CommunityTypeAndFormat form={form} />
      <LocationAndAudience form={form} />
      <DatesAndUrls form={form} />
    </div>
  );
}
