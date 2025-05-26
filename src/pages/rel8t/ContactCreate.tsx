import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Navbar from "@/components/Navbar";
import ContactForm from "@/components/rel8t/ContactForm";
import { createContact, addContactToGroup } from "@/services/rel8t/contactService";
import { toast } from "@/hooks/use-toast";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Rel8OnlyNavigation } from "@/components/rel8t/Rel8OnlyNavigation";

const ContactCreate = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Create contact mutation
  const createMutation = useMutation({
    mutationFn: async (values: any) => {
      // Extract selectedGroups from values before creating contact
      const { selectedGroups, ...contactData } = values;
      const newContact = await createContact(contactData);
      
      // If groups are selected, add the contact to groups
      if (selectedGroups && selectedGroups.length > 0) {
        await Promise.all(
          selectedGroups.map((groupId: string) => 
            addContactToGroup(newContact.id, groupId)
          )
        );
      }
      
      return newContact;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contacts"] });
      toast({
        title: "Contact created",
        description: "New contact has been successfully created.",
      });
      navigate("/rel8/contacts");
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create contact.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (values: any) => {
    createMutation.mutate(values);
  };

  const handleCancel = () => {
    navigate("/rel8/contacts");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <Rel8OnlyNavigation />

        <div className="flex items-center justify-between mb-8 mt-6">
          <div>
            <h1 className="text-3xl font-bold">Create New Contact</h1>
            <p className="text-muted-foreground mt-1">Add a new contact to your network</p>
          </div>
        </div>

        <div className="bg-card rounded-lg border border-border/20 p-6">
          <ContactForm
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isSubmitting={createMutation.isPending}
          />
        </div>
      </div>

      {/* Powered by Footer */}
      <footer className="w-full text-center py-4 text-muted-foreground text-sm">
        <p>Powered by POLLEN8 LABS</p>
      </footer>
    </div>
  );
};

export default ContactCreate;
