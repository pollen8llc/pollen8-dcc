
import { UseFormReturn } from "react-hook-form";
import { CommunityFormData } from "@/schemas/communitySchema";
import { FormField, FormItem, FormControl, FormMessage, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";

interface BasicInfoFormProps {
  form: UseFormReturn<CommunityFormData>;
}

export function BasicInfoForm({ form }: BasicInfoFormProps) {
  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h3 className="text-xl font-semibold bg-gradient-to-r from-primary/80 to-primary/60 bg-clip-text text-transparent">
          Basic Information
        </h3>
        <p className="text-sm text-muted-foreground mt-1">
          Tell us about your community
        </p>
      </div>

      <div className="grid gap-8">
        <Card className="p-6 bg-black/5 backdrop-blur-sm border-white/10">
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground/90 font-medium">Community Name</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter your community name"
                      className="bg-black/10 border-white/20 focus:border-primary/50"
                      {...field}
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
                  <FormLabel className="text-foreground/90 font-medium">Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Describe your community's purpose and goals"
                      className="min-h-[120px] bg-black/10 border-white/20 focus:border-primary/50"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </Card>

        <Card className="p-6 bg-black/5 backdrop-blur-sm border-white/10">
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground/90 font-medium">Location</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="City, Region, or Global"
                      className="bg-black/10 border-white/20 focus:border-primary/50"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="target_audience"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-foreground/90 font-medium">Target Audience</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="e.g., developers, designers, entrepreneurs"
                      className="bg-black/10 border-white/20 focus:border-primary/50"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </Card>
      </div>
    </div>
  );
}
