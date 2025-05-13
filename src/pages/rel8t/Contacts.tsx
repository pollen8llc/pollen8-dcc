
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import Navbar from "@/components/Navbar";
import ContactList from "@/components/rel8t/ContactList";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import ContactForm from "@/components/rel8t/ContactForm";
import { createContact, addContactToGroup } from "@/services/rel8t/contactService";
import { toast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import ContactGroupsManager from "@/components/rel8t/ContactGroupsManager";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus, Users, FolderPlus } from "lucide-react";

const Contacts = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [contactDialogOpen, setContactDialogOpen] = useState(false);
  const [contactGroupsDialogOpen, setContactGroupsDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("all");

  // Create contact mutation for the dialog
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
    navigate(`/rel8t/contacts/${contact.id}/edit`);
  };

  const handleCreateContact = (values: any) => {
    createMutation.mutate(values);
  };

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ["contacts"] });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold">Contacts</h1>
            <p className="text-muted-foreground">Manage your professional network</p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => setContactGroupsDialogOpen(true)}
              variant="outline"
              className="gap-2"
            >
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Groups</span>
            </Button>
            <Button onClick={() => setContactDialogOpen(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Add Contact</span>
            </Button>
          </div>
        </div>

        <Tabs
          defaultValue={activeTab}
          onValueChange={setActiveTab}
          className="space-y-4"
        >
          <div className="flex items-center justify-between">
            <TabsList>
              <TabsTrigger value="all">All Contacts</TabsTrigger>
              <TabsTrigger value="recent">Recent</TabsTrigger>
              <TabsTrigger value="favorites">Favorites</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="all" className="mt-0">
            <ContactList
              onEdit={handleEditContact}
              onAddContact={() => setContactDialogOpen(true)}
              onRefresh={handleRefresh}
            />
          </TabsContent>
          
          <TabsContent value="recent" className="mt-0">
            <div className="text-center py-12">
              <h3 className="text-lg font-medium">Recent contacts feature coming soon</h3>
              <p className="text-muted-foreground mt-2">
                We're still working on this feature. Check back later!
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="favorites" className="mt-0">
            <div className="text-center py-12">
              <h3 className="text-lg font-medium">Favorites feature coming soon</h3>
              <p className="text-muted-foreground mt-2">
                We're still working on this feature. Check back later!
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Dialog for adding a new contact */}
      <Dialog open={contactDialogOpen} onOpenChange={setContactDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add New Contact</DialogTitle>
          </DialogHeader>
          <ContactForm
            onSubmit={handleCreateContact}
            onCancel={() => setContactDialogOpen(false)}
            isSubmitting={createMutation.isPending}
          />
        </DialogContent>
      </Dialog>

      {/* Dialog for managing contact groups */}
      <Dialog open={contactGroupsDialogOpen} onOpenChange={setContactGroupsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Contact Groups</DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            <ContactGroupsManager />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Contacts;
