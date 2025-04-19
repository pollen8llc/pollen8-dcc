
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { UseFormReturn } from "react-hook-form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface CommunitySnapshotFormProps {
  form: UseFormReturn<any>
}

export function CommunitySnapshotForm({ form }: CommunitySnapshotFormProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">📊 Community Snapshot</h3>
        <p className="text-sm text-muted-foreground">Information about your community's current state</p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <FormField
          control={form.control}
          name="founder_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Founder Name</FormLabel>
              <FormControl>
                <Input placeholder="Your name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="role_title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Your Role</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Community Lead" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="size"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Community Size</FormLabel>
            <FormControl>
              <Input 
                type="number" 
                placeholder="Current member count"
                {...field} 
                onChange={(e) => field.onChange(e.target.value)}
              />
            </FormControl>
            <FormDescription>Approximate number of active members</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="personal_background"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Personal Background</FormLabel>
            <FormControl>
              <Input placeholder="Your background" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="community_structure"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Community Structure</FormLabel>
            <FormControl>
              <Input placeholder="How is your community organized?" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="vision"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Vision & Mission</FormLabel>
            <FormControl>
              <Input placeholder="The vision for your community" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}
