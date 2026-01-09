import React, { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Loc8Dialog } from "@/components/ui/loc8-dialog";
import { Loc8DialogTrigger } from "@/components/ui/loc8-dialog-trigger";
import { User, Mail, Phone, MapPin, Loader2 } from "lucide-react";
import { createContact } from "@/services/rel8t/contactService";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";

const contactSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100, "Name must be less than 100 characters"),
  email: z.string().trim().email("Invalid email address").max(255).optional().or(z.literal('')),
  phone: z.string().trim().max(30, "Phone number too long").optional().or(z.literal('')),
  location: z.string().optional(),
});

type ContactFormValues = z.infer<typeof contactSchema>;

interface QuickContactWizardProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: (contactId: string) => void;
  defaultCategoryId?: string;
}

export const QuickContactWizard = ({
  open,
  onOpenChange,
  onSuccess,
  defaultCategoryId,
}: QuickContactWizardProps) => {
  const [isLocationDialogOpen, setIsLocationDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      location: '',
    },
  });

  const handleSubmit = async (values: ContactFormValues) => {
    setIsSubmitting(true);
    try {
      const contact = await createContact({
        name: values.name,
        email: values.email || undefined,
        phone: values.phone || undefined,
        location: values.location || undefined,
        category_id: defaultCategoryId || undefined,
      });

      toast({
        title: "Contact created",
        description: `${values.name} has been added to your contacts.`,
      });

      queryClient.invalidateQueries({ queryKey: ["contacts"] });
      queryClient.invalidateQueries({ queryKey: ["setup-contact-count"] });
      
      form.reset();
      onOpenChange(false);
      onSuccess?.(contact.id);
    } catch (error: any) {
      console.error('Error creating contact:', error);
      toast({
        title: "Failed to create contact",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    form.reset();
    onOpenChange(false);
  };

  return (
    <>
      <Dialog open={open && !isLocationDialogOpen} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              Add Contact
            </DialogTitle>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
              {/* Name Field */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      Name *
                    </FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter contact name" 
                        {...field}
                        className="bg-background/50 border-primary/20 focus:border-primary/50"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Email Field */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      Email
                    </FormLabel>
                    <FormControl>
                      <Input 
                        type="email"
                        placeholder="email@example.com" 
                        {...field}
                        className="bg-background/50 border-primary/20 focus:border-primary/50"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Phone Field */}
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      Phone Number
                    </FormLabel>
                    <FormControl>
                      <Input 
                        type="tel"
                        placeholder="+1 (555) 123-4567" 
                        {...field}
                        className="bg-background/50 border-primary/20 focus:border-primary/50"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Location Field */}
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      Location
                    </FormLabel>
                    <FormControl>
                      <Loc8DialogTrigger
                        value={field.value ? [field.value] : []}
                        placeholder="Select location on globe"
                        onClick={() => setIsLocationDialogOpen(true)}
                        className="w-full"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter className="gap-2 sm:gap-0 pt-4">
                <Button type="button" variant="outline" onClick={handleClose}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    'Create Contact'
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Location Globe Dialog */}
      <Loc8Dialog
        open={isLocationDialogOpen}
        onOpenChange={setIsLocationDialogOpen}
        value={form.watch('location') ? [form.watch('location')!] : []}
        mode="single"
        title="Select Location"
        description="Choose the contact's city from the globe"
        onConfirm={(cities) => {
          form.setValue('location', cities[0] || '');
          setIsLocationDialogOpen(false);
        }}
      />
    </>
  );
};
