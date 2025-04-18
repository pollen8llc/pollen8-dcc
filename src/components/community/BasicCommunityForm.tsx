
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { UseFormReturn } from "react-hook-form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

interface BasicCommunityFormProps {
  form: UseFormReturn<any>
}

export function BasicCommunityForm({ form }: BasicCommunityFormProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">🏡 Community Overview</h3>
        <p className="text-sm text-muted-foreground">Basic information about your community</p>
      </div>

      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Community Name</FormLabel>
            <FormControl>
              <Input placeholder="Enter community name" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <FormField
          control={form.control}
          name="communityType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select community type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="tech">Tech</SelectItem>
                  <SelectItem value="wellness">Wellness</SelectItem>
                  <SelectItem value="creative">Creative</SelectItem>
                  <SelectItem value="professional">Professional</SelectItem>
                  <SelectItem value="education">Education</SelectItem>
                  <SelectItem value="social">Social</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="format"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Format</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select format" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="irl">IRL (In-person)</SelectItem>
                  <SelectItem value="url">URL (Online)</SelectItem>
                  <SelectItem value="hybrid">Hybrid</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="location"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Location(s)</FormLabel>
            <FormControl>
              <Input placeholder="City, Region, Global" {...field} />
            </FormControl>
            <FormDescription>Specify your community's geographical scope</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="targetAudience"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Target Audience</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Describe your target audience (comma-separated tags)" 
                {...field} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="tone"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Tone / Vibe</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select tone" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="casual">Casual</SelectItem>
                <SelectItem value="professional">Professional</SelectItem>
                <SelectItem value="experimental">Experimental</SelectItem>
                <SelectItem value="reflective">Reflective</SelectItem>
                <SelectItem value="playful">Playful</SelectItem>
                <SelectItem value="serious">Serious</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Community Bio</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Describe your community's purpose, values, and norms" 
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
