
import { UseFormReturn } from "react-hook-form";
import { CommunityFormData } from "@/schemas/communitySchema";
import { FormField, FormItem, FormControl, FormMessage, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface CommunityBasicDetailsProps {
  form: UseFormReturn<CommunityFormData>;
}

export function CommunityBasicDetails({ form }: CommunityBasicDetailsProps) {
  return (
    <div className="space-y-6 backdrop-blur-sm p-4 rounded-lg border border-white/10 bg-black/5">
      <h4 className="text-lg font-medium mb-4">Community Details</h4>
      
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-foreground/90">Community Name *</FormLabel>
            <FormControl>
              <Input 
                placeholder="Enter community name" 
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
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-foreground/90">Description *</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Describe your community"
                className="min-h-[100px] bg-black/10 backdrop-blur-sm border-white/20"
                {...field} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="type"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-foreground/90">Community Type *</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger className="bg-black/10 backdrop-blur-sm border-white/20">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="tech">Technology</SelectItem>
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
            <FormLabel className="text-foreground/90">Format *</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger className="bg-black/10 backdrop-blur-sm border-white/20">
                  <SelectValue placeholder="Select format" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="online">Online</SelectItem>
                <SelectItem value="in-person">In Person</SelectItem>
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
