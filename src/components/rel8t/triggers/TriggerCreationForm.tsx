
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import { createTrigger, TRIGGER_ACTIONS, TIME_TRIGGER_TYPES } from "@/services/rel8t/triggerService";
import { Check, Loader } from "lucide-react";

const FormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  description: z.string().optional(),
  condition: z.string({
    required_error: "Please select a trigger condition.",
  }),
  action: z.string({
    required_error: "Please select an action.",
  }),
  executionDate: z.date().optional(),
});

interface TriggerCreationFormProps {
  onSuccess: () => void;
}

export function TriggerCreationForm({ onSuccess }: TriggerCreationFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      description: "",
      condition: TIME_TRIGGER_TYPES.DAILY,
      action: TRIGGER_ACTIONS.SEND_EMAIL,
    },
  });

  async function onSubmit(values: z.infer<typeof FormSchema>) {
    setIsSubmitting(true);
    
    try {
      const triggerData = {
        name: values.name,
        description: values.description || "",
        condition: values.condition,
        action: values.action,
        is_active: true,
        execution_time: values.executionDate ? values.executionDate.toISOString() : new Date().toISOString(),
        recurrence_pattern: {
          type: values.condition,
          startDate: new Date().toISOString(),
        },
      };
      
      await createTrigger(triggerData);
      onSuccess();
    } catch (error) {
      console.error("Error creating trigger:", error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <h3 className="text-lg font-medium mb-4">Create Automation Trigger</h3>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Daily Check-in" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Send a daily reminder to check messages" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="condition"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Trigger Condition</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a condition" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value={TIME_TRIGGER_TYPES.HOURLY}>Hourly</SelectItem>
                  <SelectItem value={TIME_TRIGGER_TYPES.DAILY}>Daily</SelectItem>
                  <SelectItem value={TIME_TRIGGER_TYPES.WEEKLY}>Weekly</SelectItem>
                  <SelectItem value={TIME_TRIGGER_TYPES.MONTHLY}>Monthly</SelectItem>
                  <SelectItem value={TIME_TRIGGER_TYPES.QUARTERLY}>Quarterly</SelectItem>
                  <SelectItem value={TIME_TRIGGER_TYPES.YEARLY}>Yearly</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="action"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Action</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an action" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value={TRIGGER_ACTIONS.SEND_EMAIL}>Send Email</SelectItem>
                  <SelectItem value={TRIGGER_ACTIONS.CREATE_TASK}>Create Task</SelectItem>
                  <SelectItem value={TRIGGER_ACTIONS.ADD_REMINDER}>Add Reminder</SelectItem>
                  <SelectItem value={TRIGGER_ACTIONS.SEND_NOTIFICATION}>Send Notification</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="executionDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Start Date (Optional)</FormLabel>
              <DatePicker
                value={field.value}
                onChange={field.onChange}
              />
              <FormDescription>
                When should this trigger first execute?
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex justify-end pt-2">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Check className="mr-2 h-4 w-4" />
                Create Trigger
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
