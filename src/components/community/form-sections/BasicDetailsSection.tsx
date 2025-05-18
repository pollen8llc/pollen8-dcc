
import React from "react";
import { useFormContext } from "react-hook-form";
import { CommunityFormData } from "@/schemas/communitySchema";
import { COMMUNITY_TYPES } from "@/constants/communityConstants";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

export function BasicDetailsSection() {
  const { control } = useFormContext<CommunityFormData>();

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-medium">Basic Community Details</h2>
      
      <FormField
        control={control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Community Name</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Enter community name" />
            </FormControl>
            <FormDescription>
              The name of your community as it will appear to others.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Description</FormLabel>
            <FormControl>
              <Textarea 
                {...field} 
                placeholder="Tell us about your community..." 
                rows={4}
              />
            </FormControl>
            <FormDescription>
              Provide a clear description of what your community is about.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={control}
        name="type"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Community Type</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select community type" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {Object.entries(COMMUNITY_TYPES).map(([key, value]) => (
                  <SelectItem key={key} value={value}>
                    {key.charAt(0) + key.slice(1).toLowerCase().replace('_', ' ')}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormDescription>
              The primary focus or category of your community.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={control}
        name="is_public"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <FormLabel className="text-base">Visibility</FormLabel>
              <FormDescription>
                Make this community public and discoverable by everyone?
              </FormDescription>
            </div>
            <FormControl>
              <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
