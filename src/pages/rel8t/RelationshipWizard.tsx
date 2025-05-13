
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { SelectContactsStep } from "@/components/rel8t/wizard/SelectContactsStep";
import { ImportContactsStep } from "@/components/rel8t/wizard/ImportContactsStep";
import { SelectTriggersStep } from "@/components/rel8t/wizard/SelectTriggersStep";
import { ReviewSubmitStep } from "@/components/rel8t/wizard/ReviewSubmitStep";
import { Contact } from "@/services/rel8t/contactService";

type WizardStep = 
  | "select-contacts" 
  | "select-triggers" 
  | "review";

type WizardData = {
  contacts: Contact[];
  triggers: any[];
  importedContacts: any[];
  priority: 'low' | 'medium' | 'high';
};

const initialData: WizardData = {
  contacts: [],
  triggers: [],
  importedContacts: [],
  priority: 'medium',
};

const RelationshipWizard = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<WizardStep>("select-contacts");
  const [data, setData] = useState<WizardData>(initialData);
  const [importTab, setImportTab] = useState<string>("select");

  const handleSelectContactsNext = (stepData: { contacts: Contact[] }) => {
    setData(prev => ({ ...prev, contacts: stepData.contacts }));
    setStep("select-triggers");
  };

  const handleImportContactsNext = (stepData: { importedContacts: any[] }) => {
    setData(prev => ({ ...prev, importedContacts: stepData.importedContacts }));
    setImportTab("select");
    // Don't advance to next step - let the user select the imported contacts
  };

  const handleSelectTriggersNext = (stepData: { triggers: any[], priority: 'low' | 'medium' | 'high' }) => {
    setData(prev => ({ 
      ...prev, 
      triggers: stepData.triggers,
      priority: stepData.priority
    }));
    setStep("review");
  };

  const handleReviewSubmit = () => {
    // In a real scenario, we would submit the data to the server here
    navigate("/rel8t/relationships");
  };

  const getStepTitle = () => {
    switch (step) {
      case "select-contacts":
        return "Select Contacts";
      case "select-triggers":
        return "Set Reminders";
      case "review":
        return "Review & Submit";
      default:
        return "Build Relationship";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-4 md:items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">{getStepTitle()}</h1>
            <p className="text-muted-foreground">
              Create a plan to build relationships with contacts
            </p>
          </div>
          
          <div className="flex gap-2 ml-auto">
            {step !== "select-contacts" && data.contacts.length > 0 && (
              <Badge variant="outline" className="px-3 py-1 bg-primary/5">
                {data.contacts.length} contacts selected
              </Badge>
            )}
            {step === "review" && data.triggers.length > 0 && (
              <Badge variant="outline" className="px-3 py-1 bg-primary/5">
                {data.triggers.length} reminders
              </Badge>
            )}
            {step !== "select-contacts" && (
              <Badge variant="outline" className={`px-3 py-1 ${
                data.priority === 'high' 
                  ? 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300' 
                  : data.priority === 'low'
                    ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300'
                    : 'bg-amber-100 dark:bg-amber-900/20 text-amber-800 dark:text-amber-300'
              }`}>
                {data.priority.charAt(0).toUpperCase() + data.priority.slice(1)} Priority
              </Badge>
            )}
          </div>
        </div>

        <Card className="border-border/20">
          <CardContent className="p-6">
            {step === "select-contacts" && (
              <Tabs defaultValue={importTab} onValueChange={setImportTab}>
                <TabsList className="mb-4">
                  <TabsTrigger value="select">Select Contacts</TabsTrigger>
                  <TabsTrigger value="import">Import Contacts</TabsTrigger>
                </TabsList>
                <TabsContent value="select">
                  <SelectContactsStep
                    selectedContacts={data.contacts}
                    onNext={handleSelectContactsNext}
                  />
                </TabsContent>
                <TabsContent value="import">
                  <ImportContactsStep onNext={handleImportContactsNext} />
                </TabsContent>
              </Tabs>
            )}

            {step === "select-triggers" && (
              <SelectTriggersStep
                onNext={handleSelectTriggersNext}
                onPrevious={() => setStep("select-contacts")}
                selectedContacts={data.contacts}
              />
            )}
            
            {step === "review" && (
              <ReviewSubmitStep
                wizardData={data}
                onSubmit={handleReviewSubmit}
                onPrevious={() => setStep("select-triggers")}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RelationshipWizard;
