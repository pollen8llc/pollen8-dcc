
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { UseFormReturn } from "react-hook-form"
import { Checkbox } from "@/components/ui/checkbox"

interface OnlinePresenceFormProps {
  form: UseFormReturn<any>
}

const platformOptions = [
  { id: "discord", label: "Discord" },
  { id: "slack", label: "Slack" },
  { id: "facebook", label: "Facebook Groups" },
  { id: "meetup", label: "Meetup" },
  { id: "circle", label: "Circle" },
  { id: "linkedin", label: "LinkedIn" },
  { id: "other", label: "Other" },
]

export function OnlinePresenceForm({ form }: OnlinePresenceFormProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">🌐 Online Presence</h3>
        <p className="text-sm text-muted-foreground">Information about your community's online platforms</p>
      </div>

      <FormField
        control={form.control}
        name="website"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Website / Landing Page</FormLabel>
            <FormControl>
              <Input placeholder="https://" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="primaryPlatforms"
        render={() => (
          <FormItem>
            <div className="mb-4">
              <FormLabel className="text-base">Primary Platform(s)</FormLabel>
              <FormDescription>
                Select the main platforms where your community exists
              </FormDescription>
            </div>
            <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
              {platformOptions.map((platform) => (
                <FormField
                  key={platform.id}
                  control={form.control}
                  name="primaryPlatforms"
                  render={({ field }) => {
                    return (
                      <FormItem
                        key={platform.id}
                        className="flex flex-row items-start space-x-3 space-y-0"
                      >
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(platform.id)}
                            onCheckedChange={(checked) => {
                              const current = field.value || [];
                              return checked
                                ? field.onChange([...current, platform.id])
                                : field.onChange(
                                    current.filter((value: string) => value !== platform.id)
                                  );
                            }}
                          />
                        </FormControl>
                        <FormLabel className="font-normal">
                          {platform.label}
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

      <FormField
        control={form.control}
        name="newsletterUrl"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Newsletter / Communication Link</FormLabel>
            <FormControl>
              <Input placeholder="https://" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="space-y-4">
        <FormLabel>Social Media Handles</FormLabel>
        <div className="space-y-2">
          <FormField
            control={form.control}
            name="socialMedia.0.url"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center space-x-2">
                  <FormField
                    control={form.control}
                    name="socialMedia.0.platform"
                    render={({ field: platformField }) => (
                      <FormItem className="flex-1">
                        <FormControl>
                          <Input placeholder="Platform (e.g., Twitter)" {...platformField} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormControl className="flex-1">
                    <Input placeholder="URL or @handle" {...field} />
                  </FormControl>
                </div>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="socialMedia.1.url"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center space-x-2">
                  <FormField
                    control={form.control}
                    name="socialMedia.1.platform"
                    render={({ field: platformField }) => (
                      <FormItem className="flex-1">
                        <FormControl>
                          <Input placeholder="Platform" {...platformField} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormControl className="flex-1">
                    <Input placeholder="URL or @handle" {...field} />
                  </FormControl>
                </div>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="socialMedia.2.url"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center space-x-2">
                  <FormField
                    control={form.control}
                    name="socialMedia.2.platform"
                    render={({ field: platformField }) => (
                      <FormItem className="flex-1">
                        <FormControl>
                          <Input placeholder="Platform" {...platformField} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormControl className="flex-1">
                    <Input placeholder="URL or @handle" {...field} />
                  </FormControl>
                </div>
              </FormItem>
            )}
          />
        </div>
      </div>
    </div>
  )
}
