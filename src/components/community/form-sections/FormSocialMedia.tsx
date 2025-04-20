
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { CommunityFormData } from "@/schemas/communitySchema";
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface FormSocialMediaProps {
  form: UseFormReturn<CommunityFormData>;
}

export function FormSocialMedia({ form }: FormSocialMediaProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">Social Media Presence</h3>
        <p className="text-sm text-muted-foreground mb-6">
          Add your community's social media accounts (optional)
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="socialMediaHandles.twitter"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Twitter</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="@communityhandle" 
                    {...field} 
                    value={field.value || ""}
                    onChange={(e) => {
                      field.onChange(e.target.value);
                      // Ensure socialMediaHandles object is initialized
                      const currentHandles = form.getValues("socialMediaHandles") || {};
                      form.setValue("socialMediaHandles", {
                        ...currentHandles,
                        twitter: e.target.value
                      });
                    }}
                  />
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
                <FormLabel>Instagram</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="@communityhandle" 
                    {...field} 
                    value={field.value || ""}
                    onChange={(e) => {
                      field.onChange(e.target.value);
                      const currentHandles = form.getValues("socialMediaHandles") || {};
                      form.setValue("socialMediaHandles", {
                        ...currentHandles,
                        instagram: e.target.value
                      });
                    }}
                  />
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
                <FormLabel>LinkedIn</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="LinkedIn URL or handle" 
                    {...field} 
                    value={field.value || ""}
                    onChange={(e) => {
                      field.onChange(e.target.value);
                      const currentHandles = form.getValues("socialMediaHandles") || {};
                      form.setValue("socialMediaHandles", {
                        ...currentHandles,
                        linkedin: e.target.value
                      });
                    }}
                  />
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
                <FormLabel>Facebook</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Facebook URL or page name" 
                    {...field} 
                    value={field.value || ""}
                    onChange={(e) => {
                      field.onChange(e.target.value);
                      const currentHandles = form.getValues("socialMediaHandles") || {};
                      form.setValue("socialMediaHandles", {
                        ...currentHandles,
                        facebook: e.target.value
                      });
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      <div className="pt-4">
        <p className="text-sm text-muted-foreground">
          This is the final step. Review your information before submitting.
        </p>
      </div>
    </div>
  );
}
