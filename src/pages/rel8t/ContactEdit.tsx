import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import ContactForm from "@/components/rel8t/ContactForm";
import { 
  getContactById, 
  updateContact, 
  deleteContact, 
  addContactToGroup,
  removeContactFromGroup
} from "@/services/rel8t/contactService";
import { toast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Rel8OnlyNavigation } from "@/components/rel8t/Rel8OnlyNavigation";

const ContactEdit = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Fetch contact details
  const { data: contact, isLoading } = useQuery({
    queryKey: ["contact", id],
    queryFn: () => getContactById(id as string),
    enabled: !!id,
  });

  // Update contact mutation
  const updateMutation = useMutation({
    mutationFn: async (values: any) => {
      if (!id) throw new Error("Contact ID is required");
      
      // Extract selectedGroups from values before updating contact
      const { selectedGroups, ...contactData } = values;
      
      // Update basic contact data
      const updatedContact = await updateContact(id, contactData);
      
      // Handle group membership changes
      if (selectedGroups && contact?.groups) {
        // Find groups to add and remove
        const currentGroupIds = contact.groups.map(g => g.id);
        const groupsToAdd = selectedGroups.filter((g: string) => !currentGroupIds.includes(g));
        const groupsToRemove = currentGroupIds.filter(g => !selectedGroups.includes(g));
        
        // Add contact to new groups
        for (const groupId of groupsToAdd) {
          await addContactToGroup(id, groupId);
        }
        
        // Remove contact from old groups
        for (const groupId of groupsToRemove) {
          await removeContactFromGroup(id, groupId);
        }
      }
      
      return updatedContact;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contacts"] });
      queryClient.invalidateQueries({ queryKey: ["contact", id] });
      toast({
        title: "Contact updated",
        description: "Contact has been successfully updated.",
      });
      navigate("/rel8/contacts");
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update contact.",
        variant: "destructive",
      });
    },
  });

  // Delete contact mutation
  const deleteMutation = useMutation({
    mutationFn: () => {
      if (!id) throw new Error("Contact ID is required");
      return deleteContact(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contacts"] });
      toast({
        title: "Contact deleted",
        description: "Contact has been successfully deleted.",
      });
      navigate("/rel8/contacts");
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete contact.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (values: any) => {
    updateMutation.mutate(values);
  };

  const handleCancel = () => {
    navigate("/rel8/contacts");
  };

  const handleDelete = () => {
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    deleteMutation.mutate();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <Rel8OnlyNavigation />
          
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <Loader2 className="animate-spin h-8 w-8 mx-auto text-[#00eada]" />
              <p className="mt-4">Loading contact details...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!contact && !isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <Rel8OnlyNavigation />
          
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Contact not found</h2>
            <Button onClick={() => navigate("/rel8/contacts")}>
              Back to Contacts
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <Rel8OnlyNavigation />
        
        <div className="flex items-center mb-6 mt-6">
          <Button
            variant="ghost"
            onClick={() => navigate("/rel8/contacts")}
            className="mr-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" /> Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Edit Contact</h1>
            <p className="text-muted-foreground">Update contact information</p>
          </div>
          <Button
            variant="destructive"
            onClick={handleDelete}
            className="ml-auto"
            disabled={updateMutation.isPending || deleteMutation.isPending}
          >
            Delete Contact
          </Button>
        </div>

        <div className="bg-card rounded-lg border border-border/20 p-6">
          {contact && (
            <ContactForm
              initialValues={{
                name: contact.name,
                email: contact.email,
                phone: contact.phone,
                organization: contact.organization,
                role: contact.role,
                notes: contact.notes,
                tags: contact.tags || [],
                category_id: contact.category_id,
                location: contact.location,
                groups: contact.groups || [],
                affiliations: contact.affiliations || []
              }}
              onSubmit={handleSubmit}
              onCancel={handleCancel}
              isSubmitting={updateMutation.isPending}
            />
          )}
        </div>
      </div>

      {/* Powered by Footer */}
      <footer className="w-full text-center py-4 text-muted-foreground text-sm">
        <p>Powered by POLLEN8 LABS</p>
      </footer>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the contact
              and remove all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ContactEdit;
