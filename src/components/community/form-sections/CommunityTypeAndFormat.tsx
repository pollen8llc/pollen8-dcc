
import { UseFormReturn } from "react-hook-form";
import { CommunityFormData } from "@/schemas/communitySchema";
import { FormField, FormItem, FormControl, FormMessage, FormLabel } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface CommunityTypeAndFormatProps {
  form: UseFormReturn<CommunityFormData>;
}

export function CommunityTypeAndFormat({ form }: CommunityTypeAndFormatProps) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      <FormField
        control={form.control}
        name="type"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Community Type *</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="tech">Tech</SelectItem>
                <SelectItem value="creative">Creative</SelectItem>
                <SelectItem value="wellness">Wellness</SelectItem>
                <SelectItem value="professional">Professional</SelectItem>
                <SelectItem value="social-impact">Social Impact</SelectItem>
                <SelectItem value="education">Education</SelectItem>
                <SelectItem value="social">Social</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="format"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Format *</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select format" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="online">Online</SelectItem>
                <SelectItem value="IRL">IRL</SelectItem>
                <SelectItem value="hybrid">Hybrid</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
