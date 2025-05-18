
import React from "react";
import { useFormContext } from "react-hook-form";
import { CommunityFormData } from "@/schemas/communitySchema";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { EVENT_FREQUENCIES } from "@/constants/communityConstants";
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function AdditionalDetailsSection() {
  const { control } = useFormContext<CommunityFormData>();

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-medium">Additional Details</h2>
      
      <FormField
        control={control}
        name="founder_name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Founder Name</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Name of community founder" />
            </FormControl>
            <FormDescription>
              The name(s) of the person/people who founded this community
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={control}
        name="role_title"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Your Role</FormLabel>
            <FormControl>
              <Input {...field} placeholder="e.g., Founder, Organizer, Admin" />
            </FormControl>
            <FormDescription>
              Your role in this community
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="event_frequency"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Event Frequency</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="How often does the community meet?" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {Object.entries(EVENT_FREQUENCIES).map(([key, value]) => (
                  <SelectItem key={key} value={value}>
                    {key.charAt(0) + key.slice(1).toLowerCase()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormDescription>
              How frequently does your community host events?
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={control}
        name="vision"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Vision Statement</FormLabel>
            <FormControl>
              <Textarea {...field} placeholder="Our vision is to..." rows={3} />
            </FormControl>
            <FormDescription>
              The long-term vision or mission for your community
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={control}
        name="community_values"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Community Values</FormLabel>
            <FormControl>
              <Textarea 
                {...field} 
                placeholder="Our community values include..." 
                rows={3}
              />
            </FormControl>
            <FormDescription>
              The core values that define your community
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={control}
        name="community_structure"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Community Structure</FormLabel>
            <FormControl>
              <Textarea 
                {...field} 
                placeholder="Our community is structured as..." 
                rows={3}
              />
            </FormControl>
            <FormDescription>
              How your community is organized (leadership, roles, etc.)
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
