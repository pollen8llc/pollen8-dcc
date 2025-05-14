
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Navbar from "@/components/Navbar";
import { ContactForm } from "@/components/rel8t/ContactForm";
import { createContact, addContactToGroup } from "@/services/rel8t/contactService";
import { toast } from "@/hooks/use-toast";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
} from "@/components/ui/breadcrumb";

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
      navigate("/rel8t/contacts");
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create contact",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (values: any) => {
    createMutation.mutate(values);
  };

  const handleCancel = () => {
    navigate("/rel8t/contacts");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-6">
        {/* Sleek translucent breadcrumb */}
        <Breadcrumb className="mb-4 p-2 rounded-md bg-cyan-500/10 backdrop-blur-sm border border-cyan-200/20 shadow-sm">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/rel8t" className="text-cyan-700 hover:text-cyan-900">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbLink href="/rel8t/contacts" className="text-cyan-700 hover:text-cyan-900">Contacts</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbLink className="text-cyan-700">New Contact</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        
        <div className="flex items-center mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate("/rel8t/contacts")}
            className="mr-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" /> Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Create New Contact</h1>
            <p className="text-sm text-muted-foreground">Add a new contact to your network</p>
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
    </div>
  );
};

export default ContactCreate;
