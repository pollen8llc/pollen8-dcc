
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { UseFormReturn } from "react-hook-form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

interface CommunitySnapshotFormProps {
  form: UseFormReturn<any>
}

export function CommunitySnapshotForm({ form }: CommunitySnapshotFormProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">📊 Community Snapshot</h3>
        <p className="text-sm text-muted-foreground">Details about your community's status and operations</p>
      </div>

      <FormField
        control={form.control}
        name="launchDate"
        render={({ field }) => (
          <FormItem className="flex flex-col">
            <FormLabel>Launch Date</FormLabel>
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full pl-3 text-left font-normal",
                      !field.value && "text-muted-foreground"
                    )}
                  >
                    {field.value ? (
                      format(new Date(field.value), "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={field.value ? new Date(field.value) : undefined}
                  onSelect={(date) => field.onChange(date ? date.toISOString() : "")}
                  initialFocus
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <FormField
          control={form.control}
          name="memberCount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Current Member Count</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  min="0" 
                  placeholder="0"
                  {...field}
                  onChange={(e) => field.onChange(parseInt(e.target.value) || 0)} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="memberCapacity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Member Capacity</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  min="0" 
                  placeholder="0 (unlimited)" 
                  {...field}
                  onChange={(e) => field.onChange(parseInt(e.target.value) || 0)} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="eventFrequency"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Event Frequency</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="biweekly">Bi-weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="quarterly">Quarterly</SelectItem>
                <SelectItem value="adhoc">Ad-hoc</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}
