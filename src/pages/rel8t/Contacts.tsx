
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import Navbar from "@/components/Navbar";
import ContactList from "@/components/rel8t/ContactList";
import Rel8Navigation from "@/components/rel8t/Rel8Navigation";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription 
} from "@/components/ui/dialog";
import { useMutation } from "@tanstack/react-query";
import ContactGroupsManager from "@/components/rel8t/ContactGroupsManager";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { 
  Plus, 
  Users,
  Import
} from "lucide-react";
import { createContact } from "@/services/rel8t/contactService";
import { toast } from "@/hooks/use-toast";
import { getContactGroups } from "@/services/rel8t/contactService";

const Contacts = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [contactDialogOpen, setContactDialogOpen] = useState(false);
  const [contactGroupsDialogOpen, setContactGroupsDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  
  // Fetch contact groups for the group tab
  const { data: groups = [] } = useQuery({
    queryKey: ["contact-groups"],
    queryFn: getContactGroups,
  });

  // Create contact mutation for the dialog
  const createMutation = useMutation({
    mutationFn: createContact,
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

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ["contacts"] });
  };

  const handleImport = () => {
    navigate('/rel8t/import');
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <Rel8Navigation />
        
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
            <Button 
              onClick={handleImport}
              variant="outline"
              className="gap-2"
            >
              <Import className="h-4 w-4" />
              <span className="hidden sm:inline">Import</span>
            </Button>
            <Button onClick={() => navigate("/rel8t/contacts/new")} className="gap-2">
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
          <div className="flex items-center justify-between overflow-x-auto">
            <TabsList className="mb-4">
              <TabsTrigger value="all">All Contacts</TabsTrigger>
              <TabsTrigger value="groups">Groups</TabsTrigger>
              <TabsTrigger value="recent">Recent</TabsTrigger>
              <TabsTrigger value="favorites">Favorites</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="all" className="mt-0">
            <ContactList
              onEdit={handleEditContact}
              onAddContact={() => navigate("/rel8t/contacts/new")}
              onRefresh={handleRefresh}
            />
          </TabsContent>
          
          <TabsContent value="groups" className="mt-0">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Contact Groups</h3>
                <Button onClick={() => setContactGroupsDialogOpen(true)} variant="outline" size="sm">
                  <Plus className="h-3.5 w-3.5 mr-1" />
                  Manage Groups
                </Button>
              </div>
              
              {groups.length === 0 ? (
                <div className="text-center py-12 border border-dashed rounded-lg">
                  <Users className="h-12 w-12 text-muted-foreground/50 mx-auto" />
                  <h3 className="mt-2 font-semibold">No contact groups</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Create groups to organize your contacts
                  </p>
                  <Button onClick={() => setContactGroupsDialogOpen(true)} className="mt-4">
                    <Plus className="mr-2 h-4 w-4" />
                    Create Group
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {groups.map((group: any) => (
                    <div 
                      key={group.id} 
                      className="border rounded-lg p-4 hover:bg-muted/30 transition-colors cursor-pointer"
                      onClick={() => {
                        // Set a group filter and switch back to all contacts tab
                        // Implementation would need state modification for group filtering
                        setActiveTab("all");
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: group.color || '#6366f1' }} 
                        />
                        <h4 className="font-medium">{group.name}</h4>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {group.contact_count || 0} contacts
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
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
