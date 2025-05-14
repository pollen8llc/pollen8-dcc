
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { ContactForm } from "@/components/rel8t/ContactForm";
import { ImportContactsStep } from "@/components/rel8t/wizard/ImportContactsStep";
import { createContact, addContactToGroup } from "@/services/rel8t/contactService";
import { toast } from "@/hooks/use-toast";
import { Steps, Step } from "@/components/ui/steps";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ChevronLeft, 
  ArrowRight,
  Check,
  FileSpreadsheet,
  UserPlus
} from "lucide-react";

interface ContactWizardProps {
  onClose: () => void;
  initialStep?: number;
}

const ContactWizard = ({ onClose, initialStep = 1 }: ContactWizardProps) => {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<"manual" | "import">("manual");
  const [wizardStep, setWizardStep] = useState(initialStep);
  const [wizardData, setWizardData] = useState<any>({});

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
        description: "New contact has been successfully created."
      });
      onClose();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create contact",
        variant: "destructive"
      });
    }
  });

  const handleImportComplete = async (importedContacts: any[]) => {
    let successCount = 0;
    let errorCount = 0;

    for (const contact of importedContacts) {
      try {
        await createContact(contact);
        successCount++;
      } catch (error) {
        errorCount++;
      }
    }

    toast({
      title: "Contacts imported",
      description: `Successfully imported ${successCount} contacts.${errorCount ? ` ${errorCount} failed.` : ""}`
    });
    queryClient.invalidateQueries({ queryKey: ["contacts"] });
    onClose();
  };

  const handleContactSubmit = (values: any) => {
    createMutation.mutate(values);
  };

  const WIZARD_STEPS_MANUAL = ["Contact Info", "Details", "Review"];
  const WIZARD_STEPS_IMPORT = ["Upload File", "Map Fields", "Review"];
  
  const currentSteps = activeTab === "manual" ? WIZARD_STEPS_MANUAL : WIZARD_STEPS_IMPORT;

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={(val) => setActiveTab(val as "manual" | "import")}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="manual" className="flex items-center gap-2">
            <UserPlus className="h-4 w-4" />
            Add Manually
          </TabsTrigger>
          <TabsTrigger value="import" className="flex items-center gap-2">
            <FileSpreadsheet className="h-4 w-4" />
            Import
          </TabsTrigger>
        </TabsList>
        
        <div className="my-4">
          <Steps currentStep={wizardStep} steps={currentSteps} />
        </div>
        
        <TabsContent value="manual">
          <ContactForm 
            onSubmit={handleContactSubmit}
            onCancel={onClose}
            isSubmitting={createMutation.isPending}
          />
        </TabsContent>
        
        <TabsContent value="import">
          <ImportContactsStep
            onNext={(data) => handleImportComplete(data.importedContacts)}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ContactWizard;
