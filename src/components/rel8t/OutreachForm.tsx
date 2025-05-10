import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CalendarIcon, Check, ChevronsUpDown } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { getContacts, Contact } from "@/services/rel8t/contactService";

const outreachFormSchema = z.object({
  title: z.string().min(2, { message: "Title must be at least 2 characters." }),
  description: z.string().optional(),
  priority: z.enum(["low", "medium", "high"], {
    required_error: "Please select a priority level.",
  }),
  due_date: z.date({
    required_error: "Please select a due date.",
  }),
  contactIds: z.array(z.string()).min(1, {
    message: "Please select at least one contact.",
  }),
});

type OutreachFormValues = z.infer<typeof outreachFormSchema>;

interface OutreachFormProps {
  onSubmit: (values: OutreachFormValues) => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

const OutreachForm: React.FC<OutreachFormProps> = ({
  onSubmit,
  onCancel,
  isSubmitting,
}) => {
  const [openContactSelect, setOpenContactSelect] = useState(false);
  
  // Query to get contacts for the multi-select
  const { data: contactsData = [], isLoading: contactsLoading } = useQuery({
    queryKey: ["contacts"],
    queryFn: getContacts,
  });

  const form = useForm<OutreachFormValues>({
    resolver: zodResolver(outreachFormSchema),
    defaultValues: {
      title: "",
      description: "",
      priority: "medium",
      contactIds: [],
    },
  });

  const selectedContactIds = form.watch("contactIds");
  
  const selectedContacts = contactsData && Array.isArray(contactsData) ? 
    contactsData.filter(contact => 
      selectedContactIds.includes(contact.id)
    ) : [];

  const handleSubmit = (values: OutreachFormValues) => {
    onSubmit(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title *</FormLabel>
              <FormControl>
                <Input placeholder="Enter outreach title" {...field} />
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
                <Textarea
                  placeholder="Add details about this outreach"
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="priority"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Priority *</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="due_date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Due Date *</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
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
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="contactIds"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Contacts *</FormLabel>
              <Popover open={openContactSelect} onOpenChange={setOpenContactSelect}>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        "justify-between",
                        !field.value.length && "text-muted-foreground"
                      )}
                    >
                      {field.value.length > 0
                        ? `${field.value.length} contact${field.value.length > 1 ? "s" : ""} selected`
                        : "Select contacts"}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-[400px] p-0">
                  <Command>
                    <CommandInput placeholder="Search contacts..." />
                    <CommandEmpty>No contacts found.</CommandEmpty>
                    <CommandGroup className="max-h-64 overflow-auto">
                      {contactsLoading ? (
                        <div className="flex items-center justify-center p-4">
                          <div className="animate-spin h-5 w-5 border-2 border-primary border-t-transparent rounded-full"></div>
                        </div>
                      ) : (
                        contactsData && Array.isArray(contactsData) && contactsData.map((contact) => (
                          <CommandItem
                            key={contact.id}
                            value={contact.id}
                            onSelect={() => {
                              const currentSelection = [...field.value];
                              const index = currentSelection.indexOf(contact.id);
                              
                              if (index === -1) {
                                currentSelection.push(contact.id);
                              } else {
                                currentSelection.splice(index, 1);
                              }
                              
                              field.onChange(currentSelection);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                field.value.includes(contact.id) ? "opacity-100" : "opacity-0"
                              )}
                            />
                            <div className="flex flex-col">
                              <span>{contact.name}</span>
                              {contact.email && (
                                <span className="text-xs text-muted-foreground">{contact.email}</span>
                              )}
                            </div>
                          </CommandItem>
                        ))
                      )}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
              
              {/* Show selected contacts as badges */}
              {selectedContacts.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-1.5">
                  {selectedContacts.map(contact => (
                    <Badge
                      key={contact.id}
                      variant="secondary"
                      className="font-normal flex items-center gap-1 pr-1"
                    >
                      {contact.name}
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-4 w-4 p-0 ml-1 text-muted-foreground hover:text-foreground"
                        onClick={() => {
                          form.setValue(
                            "contactIds",
                            selectedContactIds.filter(id => id !== contact.id),
                            { shouldValidate: true }
                          );
                        }}
                      >
                        <span className="sr-only">Remove</span>
                        <span>×</span>
                      </Button>
                    </Badge>
                  ))}
                </div>
              )}
              
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create Outreach"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default OutreachForm;
