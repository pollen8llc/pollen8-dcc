
import React from "react";
import { useFormContext } from "react-hook-form";
import { CommunityFormData } from "@/schemas/communitySchema";
import { COMMUNITY_FORMATS, COMMUNITY_SIZES } from "@/constants/communityConstants";
import { Input } from "@/components/ui/input";
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

export function LocationFormatSection() {
  const { control, setValue, watch } = useFormContext<CommunityFormData>();
  const targetAudience = watch("target_audience") || [];
  const [tagInput, setTagInput] = React.useState("");

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      
      const newTag = tagInput.trim();
      if (newTag && !targetAudience.includes(newTag)) {
        setValue("target_audience", [...targetAudience, newTag]);
      }
      
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setValue(
      "target_audience",
      targetAudience.filter(tag => tag !== tagToRemove)
    );
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-medium">Location & Format</h2>
      
      <FormField
        control={control}
        name="location"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Location</FormLabel>
            <FormControl>
              <Input {...field} placeholder="e.g., Remote, San Francisco, London" />
            </FormControl>
            <FormDescription>
              Where is your community primarily based? Enter "Remote" for online-only.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={control}
        name="format"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Community Format</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select community format" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {Object.entries(COMMUNITY_FORMATS).map(([key, value]) => (
                  <SelectItem key={key} value={value}>
                    {key === "IRL" ? "In-Person" : key.charAt(0) + key.slice(1).toLowerCase()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormDescription>
              How do members primarily interact in your community?
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={control}
        name="community_size"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Community Size</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select community size" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {COMMUNITY_SIZES.map((size) => (
                  <SelectItem key={size} value={size}>
                    {size} members
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormDescription>
              Approximate number of members in your community
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormItem>
        <FormLabel>Target Audience</FormLabel>
        <FormControl>
          <div className="flex flex-col space-y-3">
            <Input
              placeholder="Enter tags and press Enter (e.g., developers, designers)"
              value={tagInput}
              onChange={e => setTagInput(e.target.value)}
              onKeyDown={handleAddTag}
            />
            
            <div className="flex flex-wrap gap-2 mt-2">
              {targetAudience.map(tag => (
                <Badge key={tag} variant="secondary" className="px-2 py-1">
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="ml-2 text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
              {targetAudience.length === 0 && (
                <span className="text-sm text-muted-foreground">No tags added yet</span>
              )}
            </div>
          </div>
        </FormControl>
        <FormDescription>
          Add tags to help people find your community
        </FormDescription>
        <FormMessage />
      </FormItem>
    </div>
  );
}
