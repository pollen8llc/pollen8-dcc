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
import { createContact, addContactToGroup } from "@/services/rel8t/contactService";
import { toast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import ContactGroupsManager from "@/components/rel8t/ContactGroupsManager";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Steps, Step } from "@/components/ui/steps";
import { 
  Plus, 
  Users, 
  FolderPlus, 
  ChevronLeft, 
  Import,
  ArrowRight,
  Check
} from "lucide-react";
import { ImportContactsStep } from "@/components/rel8t/wizard/ImportContactsStep";

// Define steps for the add contact wizard
const WIZARD_STEPS = ["Basic Info", "Details", "Review"];

const Contacts = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [contactDialogOpen, setContactDialogOpen] = useState(false);
  const [contactGroupsDialogOpen, setContactGroupsDialogOpen] = useState(false);
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [wizardStep, setWizardStep] = useState(1);
  const [wizardData, setWizardData] = useState<any>({});

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
      setWizardStep(1); // Reset wizard step
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

  const handleNextWizardStep = (data: any) => {
    setWizardData({...wizardData, ...data});
    if (wizardStep < WIZARD_STEPS.length) {
      setWizardStep(wizardStep + 1);
    } else {
      // Final step - submit the data
      createMutation.mutate(wizardData);
    }
  };

  const handlePreviousWizardStep = () => {
    if (wizardStep > 1) {
      setWizardStep(wizardStep - 1);
    }
  };

  const handleImportComplete = async (importedContacts: any[]) => {
    let successCount = 0;
    let errorCount = 0;

    for (const contact of importedContacts) {
      try {
        await createContact(contact);
        successCount++;
      } catch (error) {
        errorCount++;
        // Optionally, log or collect errors for user feedback
      }
    }

    toast({
      title: "Contacts imported",
      description: `Successfully imported ${successCount} contacts.${errorCount ? ` ${errorCount} failed.` : ""}`
    });
    setImportDialogOpen(false);
    queryClient.invalidateQueries({ queryKey: ["contacts"] });
  };

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ["contacts"] });
  };

  // Render the appropriate wizard step content
  const renderWizardStepContent = () => {
    switch(wizardStep) {
      case 1:
        return (
          <div className="space-y-4">
            <DialogHeader>
              <DialogTitle>Basic Contact Information</DialogTitle>
              <DialogDescription>Enter the essential contact details.</DialogDescription>
            </DialogHeader>
            {/* Basic info form would go here */}
            <div className="mt-6 space-y-4">
              <div className="flex justify-end">
                <Button onClick={() => handleNextWizardStep({})}>
                  Next
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        );
      
      case 2:
        return (
          <div className="space-y-4">
            <DialogHeader>
              <DialogTitle>Additional Details</DialogTitle>
              <DialogDescription>Add more information about the contact.</DialogDescription>
            </DialogHeader>
            {/* Additional details form would go here */}
            <div className="mt-6 space-y-4">
              <div className="flex justify-between">
                <Button 
                  variant="outline" 
                  onClick={handlePreviousWizardStep}
                >
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
                <Button onClick={() => handleNextWizardStep({})}>
                  Next
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        );
      
      case 3:
        return (
          <div className="space-y-4">
            <DialogHeader>
              <DialogTitle>Review & Submit</DialogTitle>
              <DialogDescription>Verify all information before creating the contact.</DialogDescription>
            </DialogHeader>
            {/* Review form would go here */}
            <div className="mt-6 space-y-4">
              <div className="flex justify-between">
                <Button 
                  variant="outline" 
                  onClick={handlePreviousWizardStep}
                >
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
                <Button 
                  onClick={() => handleNextWizardStep({})}
                  disabled={createMutation.isPending}
                >
                  {createMutation.isPending ? 'Creating...' : 'Create Contact'}
                  <Check className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        );
      
      default:
        return null;
    }
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
              onClick={() => setImportDialogOpen(true)}
              variant="outline"
              className="gap-2"
            >
              <Import className="h-4 w-4" />
              <span className="hidden sm:inline">Import</span>
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
          <div className="mb-6">
            <Steps currentStep={wizardStep} steps={WIZARD_STEPS} />
          </div>
          {renderWizardStepContent()}
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

      {/* Dialog for importing contacts */}
      <Dialog open={importDialogOpen} onOpenChange={setImportDialogOpen}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Import Contacts</DialogTitle>
            <DialogDescription>
              Import contacts from a CSV file or other sources.
            </DialogDescription>
          </DialogHeader>
          <ImportContactsStep 
            onNext={(data) => handleImportComplete(data.importedContacts)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Contacts;
