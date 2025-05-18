
import React from "react";
import { useFormContext } from "react-hook-form";
import { CommunityFormData } from "@/schemas/communitySchema";
import { Input } from "@/components/ui/input";
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";

export function OnlinePresenceSection() {
  const { control } = useFormContext<CommunityFormData>();

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-medium">Online Presence</h2>
      
      <FormField
        control={control}
        name="website"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Website</FormLabel>
            <FormControl>
              <Input {...field} placeholder="https://yourcommunity.com" />
            </FormControl>
            <FormDescription>
              The official website for your community (if available)
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="newsletter_url"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Newsletter URL</FormLabel>
            <FormControl>
              <Input {...field} placeholder="https://newsletter.example.com/subscribe" />
            </FormControl>
            <FormDescription>
              Link to subscribe to your community's newsletter
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <h3 className="text-base font-medium pt-2">Social Media</h3>
      
      <FormField
        control={control}
        name="social_media.twitter"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Twitter</FormLabel>
            <FormControl>
              <Input {...field} placeholder="@communityhandle" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={control}
        name="social_media.instagram"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Instagram</FormLabel>
            <FormControl>
              <Input {...field} placeholder="@communityhandle" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={control}
        name="social_media.linkedin"
        render={({ field }) => (
          <FormItem>
            <FormLabel>LinkedIn</FormLabel>
            <FormControl>
              <Input {...field} placeholder="URL or company name" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={control}
        name="social_media.facebook"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Facebook</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Group or page URL" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
