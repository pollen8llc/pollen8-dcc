
import { UseFormReturn } from "react-hook-form";
import { CommunityFormData } from "@/schemas/communitySchema";
import { FormField, FormItem, FormControl, FormMessage, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface LocationAndAudienceProps {
  form: UseFormReturn<CommunityFormData>;
}

export function LocationAndAudience({ form }: LocationAndAudienceProps) {
  return (
    <div className="space-y-6 backdrop-blur-sm p-4 rounded-lg border border-white/10 bg-black/5">
      <h4 className="text-lg font-medium mb-4">Location & Audience</h4>
      
      <FormField
        control={form.control}
        name="location"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-foreground/90">Location *</FormLabel>
            <FormControl>
              <Input 
                placeholder="City, Region, or Global" 
                {...field} 
                className="bg-black/10 backdrop-blur-sm border-white/20"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="targetAudience"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-foreground/90">Target Audience *</FormLabel>
            <FormControl>
              <Input 
                placeholder="e.g., developers, designers, entrepreneurs" 
                {...field} 
                className="bg-black/10 backdrop-blur-sm border-white/20"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
