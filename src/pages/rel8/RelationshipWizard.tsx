import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SelectContactsStep } from "@/components/rel8t/wizard/SelectContactsStep";
import { SelectTriggersStep } from "@/components/rel8t/wizard/SelectTriggersStep";
import { ReviewSubmitStep } from "@/components/rel8t/wizard/ReviewSubmitStep";
import { Contact } from "@/services/rel8t/contactService";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Rel8Header } from "@/components/rel8t/Rel8Header";
import { Trigger } from "@/services/rel8t/triggerService";
import { useRelationshipWizard } from "@/contexts/RelationshipWizardContext";
import { TriggerCreatedDialog } from "@/components/rel8t/TriggerCreatedDialog";

type WizardStep = 
  | "select-contacts" 
  | "select-triggers" 
  | "review";

type WizardData = {
  contacts: Contact[];
  triggers: Trigger[];
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
  const { selectedTrigger, preSelectedContacts, clearWizardData } = useRelationshipWizard();
  
  const [step, setStep] = useState<WizardStep>("select-contacts");
  const [data, setData] = useState<WizardData>(initialData);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [createdTrigger, setCreatedTrigger] = useState<Trigger | null>(null);
  const [icsContent, setIcsContent] = useState<string | null>(null);
  const [cameFromPreSelection, setCameFromPreSelection] = useState(false);

  // Initialize wizard with pre-selected contacts from Contacts page
  useEffect(() => {
    if (preSelectedContacts.length > 0) {
      setData(prev => ({ ...prev, contacts: preSelectedContacts }));
      setStep("select-triggers");
      setCameFromPreSelection(true);
    }
  }, [preSelectedContacts]);

  // Initialize wizard data with selected trigger from context
  useEffect(() => {
    if (selectedTrigger) {
      setData(prev => ({ 
        ...prev, 
        triggers: [selectedTrigger],
        priority: selectedTrigger.recurrence_pattern?.priority || 'medium'
      }));
      // Skip trigger selection step and go to contacts first
      setStep("select-contacts");
    }
  }, [selectedTrigger]);

  // Auto-advance to review step when we have a selected trigger
  useEffect(() => {
    if (step === "select-triggers" && selectedTrigger) {
      const timer = setTimeout(() => setStep("review"), 100);
      return () => clearTimeout(timer);
    }
  }, [step, selectedTrigger]);

  const handleSelectContactsNext = (stepData: { contacts: Contact[] }) => {
    setData(prev => ({ ...prev, contacts: stepData.contacts }));
    // If we have a selected trigger, skip triggers step and go to review
    if (selectedTrigger) {
      setStep("review");
    } else {
      setStep("select-triggers");
    }
  };

  const handleSelectTriggersNext = (stepData: { triggers: Trigger[], priority: 'low' | 'medium' | 'high' }) => {
    setData(prev => ({ 
      ...prev, 
      triggers: stepData.triggers,
      priority: stepData.priority
    }));
    setStep("review");
  };

  const handleReviewSubmit = (trigger?: Trigger, ics?: string) => {
    // If trigger was just created, show success dialog
    if (trigger && ics) {
      setCreatedTrigger(trigger);
      setIcsContent(ics);
      setShowSuccessDialog(true);
    } else {
      // Clear wizard data and redirect to the main rel8 dashboard
      clearWizardData();
      navigate("/rel8");
    }
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
      <Rel8Header showProfileBanner={false} />
      
      <div className="container mx-auto max-w-6xl px-4 py-8">
        <div className="flex items-center mb-4">
          <Button 
            variant="ghost" 
            size="sm" 
            className="mr-2" 
            onClick={() => {
              clearWizardData();
              navigate(cameFromPreSelection ? "/rel8/contacts" : selectedTrigger ? "/rel8/build-rapport" : "/rel8");
            }}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to {cameFromPreSelection ? "Contacts" : selectedTrigger ? "Build Rapport" : "Dashboard"}
          </Button>
        </div>
        
        <div className="flex flex-col md:flex-row gap-4 md:items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">{getStepTitle()}</h1>
            <p className="text-muted-foreground">
              {selectedTrigger ? "Complete your relationship plan" : "Create a plan to build relationships with contacts"}
            </p>
          </div>
          
          {/* Display trigger info if we have a selected trigger */}
          {selectedTrigger && (
            <div className="ml-auto">
              <Badge variant="outline" className="px-3 py-1 bg-primary/5">
                Using selected trigger: {selectedTrigger.name}
              </Badge>
            </div>
          )}
          
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
              <SelectContactsStep
                selectedContacts={data.contacts}
                onNext={handleSelectContactsNext}
              />
            )}

            {step === "select-triggers" && !selectedTrigger && (
              <SelectTriggersStep
                onNext={handleSelectTriggersNext}
                onPrevious={() => cameFromPreSelection ? navigate("/rel8/contacts") : setStep("select-contacts")}
                selectedContacts={data.contacts}
              />
            )}
            
            {/* Skip trigger selection if we already have a selected trigger */}
            {step === "select-triggers" && selectedTrigger && (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">
                  Trigger already selected. Proceeding to review...
                </p>
              </div>
            )}
            
            {step === "review" && (
              <ReviewSubmitStep
                wizardData={data}
                onSubmit={handleReviewSubmit}
                onPrevious={() => cameFromPreSelection ? setStep("select-triggers") : setStep(selectedTrigger ? "select-contacts" : "select-triggers")}
              />
            )}
          </CardContent>
        </Card>
        <TriggerCreatedDialog 
          open={showSuccessDialog}
          onOpenChange={(open) => {
            setShowSuccessDialog(open);
            if (!open) {
              clearWizardData();
              navigate("/rel8");
            }
          }}
          trigger={createdTrigger}
          icsContent={icsContent}
        />
      </div>
    </div>
  );
};

export default RelationshipWizard;