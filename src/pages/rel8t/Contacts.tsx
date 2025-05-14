
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import Navbar from "@/components/Navbar";
import ContactList from "@/components/rel8t/ContactList";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle
} from "@/components/ui/dialog";
import ContactWizard from "@/components/rel8t/ContactWizard";
import ContactGroupsManager from "@/components/rel8t/ContactGroupsManager";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus, Users, ChevronLeft } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
} from "@/components/ui/breadcrumb";

const Contacts = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [contactDialogOpen, setContactDialogOpen] = useState(false);
  const [contactGroupsDialogOpen, setContactGroupsDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("all");

  const handleEditContact = (contact: any) => {
    navigate(`/rel8t/contacts/${contact.id}`);
  };

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ["contacts"] });
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
              <BreadcrumbLink className="text-cyan-700">Contacts</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

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

        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold">Contacts</h1>
            <p className="text-sm text-muted-foreground">Manage your professional network</p>
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

      {/* Dialog for adding a new contact with wizard */}
      <Dialog open={contactDialogOpen} onOpenChange={setContactDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Manage Contacts</DialogTitle>
          </DialogHeader>
          <ContactWizard onClose={() => setContactDialogOpen(false)} />
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
