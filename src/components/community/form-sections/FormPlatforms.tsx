
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { CommunityFormData } from "@/schemas/communitySchema";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

interface FormPlatformsProps {
  form: UseFormReturn<CommunityFormData>;
}

export function FormPlatforms({ form }: FormPlatformsProps) {
  const availablePlatforms = [
    { name: "Discord", value: "discord" },
    { name: "WhatsApp", value: "whatsapp" },
    { name: "Slack", value: "slack" },
    { name: "Telegram", value: "telegram" },
    { name: "Twitch", value: "twitch" },
    { name: "Instagram", value: "instagram" },
    { name: "Facebook", value: "facebook" },
    { name: "LinkedIn", value: "linkedin" },
    { name: "Patreon", value: "patreon" },
    { name: "Skool", value: "skool" },
    { name: "Circle", value: "circle" },
    { name: "Mighty Networks", value: "mighty-networks" },
    { name: "Band", value: "band" },
    { name: "WeChat", value: "wechat" }
  ];

  return (
    <div className="space-y-8">
      <div>
        <FormLabel className="text-base">Communication Platforms</FormLabel>
        <p className="text-sm text-muted-foreground mb-4">
          Select the platforms your community uses to communicate
        </p>
        
        <FormField
          control={form.control}
          name="platforms"
          render={() => (
            <FormItem>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {availablePlatforms.map((platform) => (
                  <FormField
                    key={platform.value}
                    control={form.control}
                    name="platforms"
                    render={({ field }) => {
                      return (
                        <FormItem
                          key={platform.value}
                          className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-3"
                        >
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(platform.value)}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([...field.value || [], platform.value])
                                  : field.onChange(
                                      field.value?.filter(
                                        (value) => value !== platform.value
                                      )
                                    );
                              }}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">
                            {platform.name}
                          </FormLabel>
                        </FormItem>
                      );
                    }}
                  />
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-1 gap-6">
        <FormField
          control={form.control}
          name="website"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Website URL</FormLabel>
              <FormControl>
                <Input placeholder="https://yourcommunity.com" {...field} />
              </FormControl>
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
                <Input placeholder="https://newsletter.yourcommunity.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {form.watch('platforms') && form.watch('platforms').length > 0 && (
        <div className="pt-4">
          <p className="text-sm font-medium mb-2">Selected platforms:</p>
          <div className="flex flex-wrap gap-2">
            {form.watch('platforms').map((platform) => (
              <Badge key={platform} variant="default">
                {availablePlatforms.find(p => p.value === platform)?.name || platform}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
