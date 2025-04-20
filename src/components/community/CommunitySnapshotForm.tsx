
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { UseFormReturn } from "react-hook-form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface CommunitySnapshotFormProps {
  form: UseFormReturn<any>
}

export function CommunitySnapshotForm({ form }: CommunitySnapshotFormProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">📸 Community Snapshot</h3>
        <p className="text-sm text-muted-foreground">Tell us more about your community's structure and goals</p>
      </div>

      <FormField
        control={form.control}
        name="size"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Community Size</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select size range" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="1-100">1-100 members</SelectItem>
                <SelectItem value="100-500">100-500 members</SelectItem>
                <SelectItem value="500-1000">500-1,000 members</SelectItem>
                <SelectItem value="1000-5000">1,000-5,000 members</SelectItem>
                <SelectItem value="5000-10000">5,000+ members</SelectItem>
              </SelectContent>
            </Select>
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
              <Textarea 
                placeholder="How is your community organized? (e.g., committees, teams, tiers)" 
                className="min-h-[100px]"
                {...field} 
              />
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
              <Textarea 
                placeholder="What is your role in the community? How are you involved?" 
                {...field} 
              />
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
            <FormLabel>Vision Statement</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="What is your vision for this community? What do you hope to achieve?" 
                className="min-h-[120px]"
                {...field} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}
