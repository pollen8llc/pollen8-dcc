
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
          name="socialMediaHandles.twitter"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="Twitter handle" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="socialMediaHandles.instagram"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="Instagram handle" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="socialMediaHandles.linkedin"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="LinkedIn URL" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="socialMediaHandles.facebook"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="Facebook URL" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
