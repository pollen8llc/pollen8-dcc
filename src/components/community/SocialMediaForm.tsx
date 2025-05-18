
import { FormField, FormItem, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { CommunityFormData } from "@/schemas/communitySchema";

interface SocialMediaFormProps {
  form: UseFormReturn<CommunityFormData>;
}

export function SocialMediaForm({ form }: SocialMediaFormProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <FormField
          control={form.control}
          name="social_media.twitter"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="Twitter handle" {...field} value={field.value || ""} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="social_media.instagram"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="Instagram handle" {...field} value={field.value || ""} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="social_media.linkedin"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="LinkedIn URL" {...field} value={field.value || ""} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="social_media.facebook"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="Facebook URL" {...field} value={field.value || ""} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
