
import { useState } from "react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import ContactList from "@/components/rel8t/ContactList";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import ContactForm from "@/components/rel8t/ContactForm";
import { Contact, createContact, updateContact } from "@/services/rel8t/contactService";
import { useQueryClient } from "@tanstack/react-query";

const Contacts = () => {
  const queryClient = useQueryClient();
  const [contactDialogOpen, setContactDialogOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddContact = () => {
    setEditingContact(null);
    setContactDialogOpen(true);
  };

  const handleEditContact = (contact: Contact) => {
    setEditingContact(contact);
    setContactDialogOpen(true);
  };

  const handleSubmitContact = async (values: any) => {
    setIsSubmitting(true);
    try {
      if (editingContact) {
        await updateContact(editingContact.id, values);
      } else {
        await createContact(values);
      }
      
      queryClient.invalidateQueries({ queryKey: ["contacts"] });
      setContactDialogOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Contacts</h1>
            <p className="text-muted-foreground mt-1">
              Manage your professional network
            </p>
          </div>
        </div>

        <ContactList 
          onAddContact={handleAddContact} 
          onEditContact={handleEditContact}
        />

        {/* Dialog */}
        <Dialog 
          open={contactDialogOpen} 
          onOpenChange={(open) => {
            setContactDialogOpen(open);
            if (!open) setEditingContact(null);
          }}
        >
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>
                {editingContact ? "Edit Contact" : "Add New Contact"}
              </DialogTitle>
            </DialogHeader>
            <ContactForm
              contact={editingContact || undefined}
              onSubmit={handleSubmitContact}
              onCancel={() => setContactDialogOpen(false)}
              isSubmitting={isSubmitting}
            />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Contacts;
