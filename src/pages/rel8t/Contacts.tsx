
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ContactList } from "@/components/rel8t/ContactList";
import ContactForm from "@/components/rel8t/ContactForm";
import { toast } from "@/hooks/use-toast";
import { 
  getContacts, 
  createContact, 
  updateContact, 
  deleteContact,
  Contact 
} from "@/services/rel8t/contactService";
import { Plus, Search, UserPlus, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Contacts = () => {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const navigate = useNavigate();

  // Fetch contacts with search filter
  const { data: contacts = [], isLoading } = useQuery({
    queryKey: ["contacts", search],
    queryFn: () => getContacts(search),
  });

  // Create contact mutation
  const createContactMutation = useMutation({
    mutationFn: createContact,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contacts"] });
      setIsAddDialogOpen(false);
      toast({
        title: "Contact created",
        description: "The contact has been created successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error creating contact",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Update contact mutation
  const updateContactMutation = useMutation({
    mutationFn: ({ id, contact }: { id: string; contact: Partial<Contact> }) =>
      updateContact(id, contact),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contacts"] });
      setIsEditDialogOpen(false);
      toast({
        title: "Contact updated",
        description: "The contact has been updated successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error updating contact",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Delete contact mutation
  const deleteContactMutation = useMutation({
    mutationFn: (id: string) => deleteContact(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contacts"] });
      toast({
        title: "Contact deleted",
        description: "The contact has been deleted successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error deleting contact",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Handle form submission for creating a new contact
  const handleAddContact = async (values: any) => {
    createContactMutation.mutate(values);
  };

  // Handle form submission for updating a contact
  const handleUpdateContact = async (values: any) => {
    if (!editingContact) return;
    updateContactMutation.mutate({ id: editingContact.id, contact: values });
  };

  // Handle contact deletion
  const handleDeleteContact = (id: string) => {
    if (confirm("Are you sure you want to delete this contact?")) {
      deleteContactMutation.mutate(id);
    }
  };

  // Open the edit dialog with the selected contact's data
  const handleEditContact = (contact: Contact) => {
    setEditingContact(contact);
    setIsEditDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold">Contacts</h1>
            <p className="text-muted-foreground mt-1">
              Manage your network of contacts
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => navigate("/rel8t/wizard")}
            >
              <UserPlus className="mr-2 h-4 w-4" />
              Build Relationship
            </Button>
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Contact
            </Button>
          </div>
        </div>
        
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search contacts by name, email, organization..."
              className="pl-10"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
        
        <ContactList 
          contacts={contacts} 
          isLoading={isLoading} 
          onEdit={handleEditContact} 
          onDelete={handleDeleteContact}
        />
      </div>
      
      {/* Add Contact Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Add New Contact
            </DialogTitle>
          </DialogHeader>
          <ContactForm
            onSubmit={handleAddContact}
            onCancel={() => setIsAddDialogOpen(false)}
            isSubmitting={createContactMutation.isPending}
          />
        </DialogContent>
      </Dialog>
      
      {/* Edit Contact Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Edit Contact
            </DialogTitle>
          </DialogHeader>
          {editingContact && (
            <ContactForm
              initialValues={{
                name: editingContact.name,
                email: editingContact.email || "",
                phone: editingContact.phone || "",
                organization: editingContact.organization || "",
                role: editingContact.role || "",
                notes: editingContact.notes || "",
                tags: editingContact.tags || [],
                category: editingContact.category || "",
              }}
              onSubmit={handleUpdateContact}
              onCancel={() => setIsEditDialogOpen(false)}
              isSubmitting={updateContactMutation.isPending}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Contacts;
