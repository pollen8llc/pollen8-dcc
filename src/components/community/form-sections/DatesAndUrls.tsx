
import { UseFormReturn } from "react-hook-form";
import { CommunityFormData } from "@/schemas/communitySchema";
import { FormField, FormItem, FormControl, FormMessage, FormLabel, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface DatesAndUrlsProps {
  form: UseFormReturn<CommunityFormData>;
}

export function DatesAndUrls({ form }: DatesAndUrlsProps) {
  return (
    <div className="space-y-6 backdrop-blur-sm p-4 rounded-lg border border-white/10 bg-black/5">
      <h4 className="text-lg font-medium mb-4">Web Presence</h4>

      <FormField
        control={form.control}
        name="website"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Website URL *</FormLabel>
            <FormControl>
              <Input 
                type="url" 
                placeholder="https://yourcommunity.com"
                {...field} 
                className="bg-black/10 backdrop-blur-sm border-white/20"
                required
              />
            </FormControl>
            <FormDescription>Your community's main website</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="newsletterUrl"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Newsletter URL</FormLabel>
            <FormControl>
              <Input 
                type="url" 
                placeholder="https://newsletter.yourcommunity.com"
                {...field}
                className="bg-black/10 backdrop-blur-sm border-white/20"
              />
            </FormControl>
            <FormDescription>Link to subscribe to your newsletter (optional)</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
