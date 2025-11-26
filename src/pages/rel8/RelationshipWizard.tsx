import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SelectContactsStep } from "@/components/rel8t/wizard/SelectContactsStep";
import { SelectTriggersStep } from "@/components/rel8t/wizard/SelectTriggersStep";
import { ReviewSubmitStep } from "@/components/rel8t/wizard/ReviewSubmitStep";
import { EditDetailsStep } from "@/components/rel8t/wizard/EditDetailsStep";
import { EditChannelStep } from "@/components/rel8t/wizard/EditChannelStep";
import { ReviewEditStep } from "@/components/rel8t/wizard/ReviewEditStep";
import { Contact } from "@/services/rel8t/contactService";
import { Rel8Header } from "@/components/rel8t/Rel8Header";
import { Trigger } from "@/services/rel8t/triggerService";
import { useRelationshipWizard } from "@/contexts/RelationshipWizardContext";
import { TriggerCreatedDialog } from "@/components/rel8t/TriggerCreatedDialog";
import { getOutreachById, Outreach } from "@/services/rel8t/outreachService";
import { useQuery } from "@tanstack/react-query";

type WizardStep = 
  | "select-contacts" 
  | "select-triggers" 
  | "review";

type EditWizardStep = 
  | "edit-details" 
  | "edit-channel" 
  | "review-edit";

type WizardData = {
  contacts: Contact[];
  triggers: Trigger[];
  importedContacts: any[];
  priority: 'low' | 'medium' | 'high';
};

type EditWizardData = {
  title: string;
  description: string;
  dueDate: string;
  priority: 'low' | 'medium' | 'high';
  outreachChannel: string | null;
  channelDetails: Record<string, any> | null;
};

const initialData: WizardData = {
  contacts: [],
  triggers: [],
  importedContacts: [],
  priority: 'medium',
};

const RelationshipWizard = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const mode = searchParams.get('mode');
  const outreachId = searchParams.get('id');
  const isEditMode = mode === 'edit' && outreachId;

  const { 
    selectedTrigger, 
    preSelectedContacts, 
    wizardStep,
    workingContacts,
    setWizardStep,
    setWorkingContacts,
    clearWizardData 
  } = useRelationshipWizard();
  
  const [step, setStep] = useState<WizardStep | EditWizardStep>(
    isEditMode ? "edit-details" : "select-contacts"
  );
  const [data, setData] = useState<WizardData>(initialData);
  const [editData, setEditData] = useState<EditWizardData | null>(null);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [createdTrigger, setCreatedTrigger] = useState<Trigger | null>(null);
  const [icsContent, setIcsContent] = useState<string | null>(null);

  // Fetch existing outreach data when in edit mode
  const { data: existingOutreach, isLoading: isLoadingOutreach } = useQuery({
    queryKey: ['outreach', outreachId],
    queryFn: () => getOutreachById(outreachId!),
    enabled: !!isEditMode,
  });

  // Initialize wizard with persisted state when returning from trigger creation
  // or with pre-selected contacts from Contacts page
  useEffect(() => {
    if (wizardStep && workingContacts.length > 0) {
      // Restore persisted state from context
      setData(prev => ({ ...prev, contacts: workingContacts }));
      setStep(wizardStep);
      // Clear persisted state after restoring
      setWizardStep(null);
      setWorkingContacts([]);
    } else if (preSelectedContacts.length > 0) {
      // Initial load from Contacts page
      setData(prev => ({ ...prev, contacts: preSelectedContacts }));
    }
  }, [wizardStep, workingContacts, preSelectedContacts, setWizardStep, setWorkingContacts]);

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

  const handleEditDetailsNext = (stepData: EditWizardData) => {
    setEditData(prev => ({ ...prev, ...stepData } as EditWizardData));
    setStep("edit-channel");
  };

  const handleEditChannelNext = (stepData: { outreachChannel: string | null; channelDetails: Record<string, any> | null }) => {
    setEditData(prev => ({ ...prev, ...stepData } as EditWizardData));
    setStep("review-edit");
  };

  const getStepTitle = () => {
    switch (step) {
      case "select-contacts":
        return "Select Contacts";
      case "select-triggers":
        return "Set Reminders";
      case "review":
        return "Review & Submit";
      case "edit-details":
        return "Edit Details";
      case "edit-channel":
        return "Edit Follow-up Channel";
      case "review-edit":
        return "Review Changes";
      default:
        return isEditMode ? "Edit Outreach" : "Build Relationship";
    }
  };

  if (isEditMode && isLoadingOutreach) {
    return (
      <div className="min-h-screen bg-background">
        <Rel8Header showProfileBanner={false} />
        <div className="container mx-auto max-w-6xl px-4 py-8 flex justify-center items-center">
          <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full"></div>
        </div>
      </div>
    );
  }

  if (isEditMode && !existingOutreach) {
    return (
      <div className="min-h-screen bg-background">
        <Rel8Header showProfileBanner={false} />
        <div className="container mx-auto max-w-6xl px-4 py-8">
          <div className="text-center">
            <h2 className="text-xl font-semibold">Outreach task not found</h2>
            <p className="text-muted-foreground mt-2">The outreach task you're trying to edit doesn't exist.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Rel8Header showProfileBanner={false} />
      
      <div className="container mx-auto max-w-6xl px-4 py-8">
        <div className="flex flex-col md:flex-row gap-4 md:items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">{getStepTitle()}</h1>
            <p className="text-muted-foreground">
              {isEditMode 
                ? "Update your outreach task details" 
                : selectedTrigger 
                  ? "Complete your relationship plan" 
                  : "Create a plan to build relationships with contacts"}
            </p>
          </div>
          
          {/* Display trigger info if we have a selected trigger */}
          {selectedTrigger && (
            <div className="ml-auto">
              <Badge variant="outline" className="px-3 py-1 bg-primary/5 border-[#00eada] border-2">
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
            {!isEditMode && step === "select-contacts" && (
              <SelectContactsStep
                selectedContacts={data.contacts}
                onNext={handleSelectContactsNext}
              />
            )}

            {!isEditMode && step === "select-triggers" && (
              <SelectTriggersStep
                onNext={handleSelectTriggersNext}
                onPrevious={() => setStep("select-contacts")}
                selectedContacts={data.contacts}
                initialSelectedTrigger={selectedTrigger}
              />
            )}
            
            {!isEditMode && step === "review" && (
              <ReviewSubmitStep
                wizardData={data}
                onSubmit={handleReviewSubmit}
                onPrevious={() => setStep(selectedTrigger ? "select-contacts" : "select-triggers")}
                onRemoveTrigger={() => {
                  setData(prev => ({ ...prev, triggers: [] }));
                  setStep("select-triggers");
                }}
              />
            )}

            {isEditMode && existingOutreach && step === "edit-details" && (
              <EditDetailsStep
                outreach={existingOutreach}
                onNext={handleEditDetailsNext}
              />
            )}

            {isEditMode && existingOutreach && step === "edit-channel" && (
              <EditChannelStep
                outreach={existingOutreach}
                onNext={handleEditChannelNext}
                onPrevious={() => setStep("edit-details")}
              />
            )}

            {isEditMode && existingOutreach && editData && step === "review-edit" && (
              <ReviewEditStep
                outreach={existingOutreach}
                updatedData={editData}
                onPrevious={() => setStep("edit-channel")}
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