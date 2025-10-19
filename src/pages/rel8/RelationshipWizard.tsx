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
  const { selectedTrigger, clearWizardData } = useRelationshipWizard();
  
  const [step, setStep] = useState<WizardStep>("select-contacts");
  const [data, setData] = useState<WizardData>(initialData);

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

  const handleReviewSubmit = () => {
    // Clear wizard data and redirect to the main rel8 dashboard
    clearWizardData();
    navigate("/rel8");
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
              navigate(selectedTrigger ? "/rel8/build-rapport" : "/rel8");
            }}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to {selectedTrigger ? "Build Rapport" : "Dashboard"}
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
                onPrevious={() => setStep("select-contacts")}
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
                onPrevious={() => setStep(selectedTrigger ? "select-contacts" : "select-triggers")}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RelationshipWizard;