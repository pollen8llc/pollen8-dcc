
import { FormField, FormItem, FormControl, FormMessage, FormLabel } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { UseFormReturn } from "react-hook-form";
import { CommunityFormData } from "@/schemas/communitySchema";

interface PlatformsFormProps {
  form: UseFormReturn<CommunityFormData>;
}

export function PlatformsForm({ form }: PlatformsFormProps) {
  const platformOptions = [
    { id: "discord", label: "Discord" },
    { id: "slack", label: "Slack" },
    { id: "whatsapp", label: "WhatsApp" },
    { id: "luma", label: "Luma" },
    { id: "eventbrite", label: "Eventbrite" },
    { id: "meetup", label: "Meetup" },
    { id: "circle", label: "Circle" },
    { id: "hivebrite", label: "Hivebrite" },
    { id: "skool", label: "Skool" },
  ] as const;

  return (
    <FormField
      control={form.control}
      name="platforms"
      render={() => (
        <FormItem>
          <FormLabel>Platforms</FormLabel>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-2">
            {platformOptions.map((platform) => (
              <FormField
                key={platform.id}
                control={form.control}
                name="platforms"
                render={({ field }) => (
                  <FormItem
                    key={platform.id}
                    className="flex flex-row items-start space-x-3 space-y-0"
                  >
                    <FormControl>
                      <Checkbox
                        checked={field.value?.includes(platform.id)}
                        onCheckedChange={(checked) => {
                          return checked
                            ? field.onChange([...field.value, platform.id])
                            : field.onChange(
                                field.value?.filter(
                                  (value) => value !== platform.id
                                )
                              )
                        }}
                      />
                    </FormControl>
                    <FormLabel className="font-normal">
                      {platform.label}
                    </FormLabel>
                  </FormItem>
                )}
              />
            ))}
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
