
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { UseFormReturn } from "react-hook-form"

interface OrganizerProfileFormProps {
  form: UseFormReturn<any>
}

export function OrganizerProfileForm({ form }: OrganizerProfileFormProps) {
  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="founder_name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Founder Name</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
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
              <Textarea placeholder="Share your background and experience" {...field} />
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
              <Textarea placeholder="How is your community organized?" {...field} />
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
            <FormLabel>Vision</FormLabel>
            <FormControl>
              <Textarea placeholder="What's your vision for this community?" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="community_values"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Community Values</FormLabel>
            <FormControl>
              <Textarea placeholder="What values drive your community?" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}
