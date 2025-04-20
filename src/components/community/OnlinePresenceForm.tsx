
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { UseFormReturn } from "react-hook-form"
import { Checkbox } from "@/components/ui/checkbox"

const PLATFORM_OPTIONS = [
  { id: "discord", label: "Discord" },
  { id: "slack", label: "Slack" },
  { id: "whatsapp", label: "WhatsApp" },
  { id: "luma", label: "Luma" },
  { id: "eventbrite", label: "Eventbrite" },
  { id: "meetup", label: "Meetup" },
  { id: "circle", label: "Circle" },
  { id: "hivebrite", label: "Hivebrite" },
  { id: "skool", label: "Skool" },
]

interface OnlinePresenceFormProps {
  form: UseFormReturn<any>
}

export function OnlinePresenceForm({ form }: OnlinePresenceFormProps) {
  const platformsValue = form.watch("primaryPlatforms") || [];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">🌐 Online Presence</h3>
        <p className="text-sm text-muted-foreground">Share your community's online platforms and digital footprint</p>
      </div>

      <FormField
        control={form.control}
        name="website"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Website URL</FormLabel>
            <FormControl>
              <Input placeholder="https://yourcommunity.com" {...field} />
            </FormControl>
            <FormDescription>Your community's main website</FormDescription>
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
            <FormDescription>Link to subscribe to your newsletter</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <div>
        <FormLabel className="text-base">Communication Platforms</FormLabel>
        <FormDescription className="mb-4">Select the platforms your community uses</FormDescription>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {PLATFORM_OPTIONS.map((platform) => (
            <FormField
              key={platform.id}
              control={form.control}
              name="primaryPlatforms"
              render={({ field }) => {
                return (
                  <FormItem
                    key={platform.id}
                    className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-3"
                  >
                    <FormControl>
                      <Checkbox
                        checked={field.value?.includes(platform.id)}
                        onCheckedChange={(checked) => {
                          return checked
                            ? field.onChange([...field.value || [], platform.id])
                            : field.onChange(field.value?.filter((value: string) => value !== platform.id))
                        }}
                      />
                    </FormControl>
                    <FormLabel className="font-normal cursor-pointer">
                      {platform.label}
                    </FormLabel>
                  </FormItem>
                )
              }}
            />
          ))}
        </div>
        <FormMessage />
      </div>

      <FormField
        control={form.control}
        name="twitter"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Twitter</FormLabel>
            <FormControl>
              <Input placeholder="@communityhandle" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="instagram"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Instagram</FormLabel>
            <FormControl>
              <Input placeholder="@communityhandle" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="linkedin"
          render={({ field }) => (
            <FormItem>
              <FormLabel>LinkedIn</FormLabel>
              <FormControl>
                <Input placeholder="LinkedIn page or group" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="facebook"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Facebook</FormLabel>
              <FormControl>
                <Input placeholder="Facebook page or group" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  )
}
