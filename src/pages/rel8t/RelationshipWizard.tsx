
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Steps, Step } from "@/components/ui/steps";
import { SelectContactsStep } from "@/components/rel8t/wizard/SelectContactsStep";
import { SelectTriggersStep } from "@/components/rel8t/wizard/SelectTriggersStep";
import { ReviewSubmitStep } from "@/components/rel8t/wizard/ReviewSubmitStep";
import { Contact } from "@/services/rel8t/contactService";
import { Trigger } from "@/services/rel8t/triggerService";
import { createOutreach } from "@/services/rel8t/outreachService";
import { toast } from "@/hooks/use-toast";
import { ArrowLeft } from "lucide-react";

const RelationshipWizard = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [selectedData, setSelectedData] = useState<{
    contacts: Contact[];
    triggers: Trigger[];
    notes?: string;
  }>({
    contacts: [],
    triggers: [],
    notes: "",
  });

  const createOutreachMutation = useMutation({
    mutationFn: (data: {
      contact_id: string;
      triggers: string[];
      notes?: string;
      is_active: boolean;
    }) => createOutreach(
      {
        title: `Outreach for ${selectedData.contacts.find(c => c.id === data.contact_id)?.name || "Contact"}`,
        description: data.notes,
        priority: "medium",
        due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 1 week from now
      }, 
      [data.contact_id]
    ),
    onSuccess: () => {
      toast({
        title: "Relationship plan created",
        description: "Your relationship plan has been created successfully!",
      });
      navigate("/rel8t");
    },
    onError: (error) => {
      toast({
        title: "Error creating relationship plan",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleNext = (data: Partial<typeof selectedData> = {}) => {
    setSelectedData((prev) => ({ ...prev, ...data }));
    setStep((prev) => prev + 1);
  };

  const handlePrevious = () => {
    setStep((prev) => prev - 1);
  };

  const handleSubmit = async (data: Partial<typeof selectedData> = {}) => {
    const finalData = { ...selectedData, ...data };
    
    // Create outreach plans for each contact
    for (const contact of finalData.contacts) {
      await createOutreachMutation.mutateAsync({
        contact_id: contact.id,
        triggers: finalData.triggers.map(trigger => trigger.id),
        notes: finalData.notes,
        is_active: true
      });
    }
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <SelectContactsStep
            selectedContacts={selectedData.contacts}
            onNext={handleNext}
          />
        );
      case 2:
        return (
          <SelectTriggersStep
            selectedTriggers={selectedData.triggers}
            onNext={handleNext}
            onPrevious={handlePrevious}
          />
        );
      case 3:
        return (
          <ReviewSubmitStep
            selectedData={selectedData}
            onSubmit={handleSubmit}
            onPrevious={handlePrevious}
            isSubmitting={createOutreachMutation.isPending}
          />
        );
      default:
        return null;
    }
  };

  const handleCancel = () => {
    if (confirm("Are you sure you want to cancel? All progress will be lost.")) {
      navigate("/rel8t");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button 
            variant="ghost" 
            className="mb-4" 
            onClick={handleCancel}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
          
          <h1 className="text-3xl font-bold">Build Relationships</h1>
          <p className="text-muted-foreground mt-1">
            Create a plan to nurture and strengthen your network connections
          </p>
        </div>
        
        <div className="mb-8">
          <Steps currentStep={step} className="max-w-xl mx-auto">
            <Step title="Select Contacts" />
            <Step title="Schedule Reminders" />
            <Step title="Review & Submit" />
          </Steps>
        </div>
        
        <Card>
          <CardContent className="pt-6">
            {renderStepContent()}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RelationshipWizard;
