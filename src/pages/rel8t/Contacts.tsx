
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import Navbar from "@/components/Navbar";
import ContactList from "@/components/rel8t/ContactList";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription 
} from "@/components/ui/dialog";
import ContactForm from "@/components/rel8t/ContactForm";
import { createContact } from "@/services/rel8t/contactService";
import { toast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { 
  Plus, 
  ChevronLeft
} from "lucide-react";
import { Rel8TNavigation } from "@/components/rel8t/Rel8TNavigation";

const Contacts = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [contactDialogOpen, setContactDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Create contact mutation for the dialog
  const createMutation = useMutation({
    mutationFn: async (values: any) => {
      // Extract selectedGroups from values before creating contact
      const { selectedGroups, ...contactData } = values;
      const newContact = await createContact(contactData);
      return newContact;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contacts"] });
      toast({
        title: "Contact created",
        description: "New contact has been successfully created."
      });
      setContactDialogOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create contact",
        variant: "destructive"
      });
    }
  });

  const handleEditContact = (contact: any) => {
    navigate(`/rel8t/contacts/${contact.id}`);
  };

  const handleCreateContact = async (values: any) => {
    setIsSubmitting(true);
    try {
      await createMutation.mutateAsync(values);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ["contacts"] });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-4">
          <Button 
            variant="ghost" 
            size="sm" 
            className="mr-2" 
            onClick={() => navigate("/rel8t")}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Dashboard
          </Button>
        </div>

        <Rel8TNavigation />

        <div className="flex flex-wrap items-center justify-between gap-4 mb-6 mt-6">
          <div>
            <h1 className="text-3xl font-bold">Contacts</h1>
            <p className="text-muted-foreground">Manage your professional network</p>
          </div>
          <Button onClick={() => setContactDialogOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Add Contact</span>
          </Button>
        </div>

        <ContactList
          onEdit={handleEditContact}
          onAddContact={() => setContactDialogOpen(true)}
          onRefresh={handleRefresh}
        />
      </div>

      {/* Dialog for adding a new contact */}
      <Dialog open={contactDialogOpen} onOpenChange={setContactDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add New Contact</DialogTitle>
            <DialogDescription>Enter the details for your new contact.</DialogDescription>
          </DialogHeader>
          <ContactForm
            onSubmit={handleCreateContact}
            onCancel={() => setContactDialogOpen(false)}
            isSubmitting={isSubmitting}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Contacts;
