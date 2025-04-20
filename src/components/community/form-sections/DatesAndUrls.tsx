
import { UseFormReturn } from "react-hook-form";
import { CommunityFormData } from "@/schemas/communitySchema";
import { FormField, FormItem, FormControl, FormMessage, FormLabel, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface DatesAndUrlsProps {
  form: UseFormReturn<CommunityFormData>;
}

export function DatesAndUrls({ form }: DatesAndUrlsProps) {
  return (
    <div className="space-y-6">
      <FormField
        control={form.control}
        name="startDate"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Start Date * (YYYY-MM-DD)</FormLabel>
            <FormControl>
              <Input 
                type="text" 
                placeholder="YYYY-MM-DD" 
                {...field} 
              />
            </FormControl>
            <FormDescription>Enter date in YYYY-MM-DD format</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="website"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Website URL</FormLabel>
            <FormControl>
              <Input 
                type="url" 
                placeholder="https://yourcommunity.com"
                {...field} 
              />
            </FormControl>
            <FormDescription>Your community's main website (optional)</FormDescription>
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
