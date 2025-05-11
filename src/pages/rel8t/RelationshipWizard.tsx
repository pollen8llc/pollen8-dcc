
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Steps } from "@/components/ui/steps";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";
import { ContactIcon, Clock, Users, FileUp } from "lucide-react";

// Step components
import { SelectContactsStep } from "@/components/rel8t/wizard/SelectContactsStep";
import { SelectTriggersStep } from "@/components/rel8t/wizard/SelectTriggersStep";
import { ReviewSubmitStep } from "@/components/rel8t/wizard/ReviewSubmitStep";
import { ImportContactsStep } from "@/components/rel8t/wizard/ImportContactsStep";
import { createOutreach } from "@/services/rel8t/outreachService";
import { Contact } from "@/services/rel8t/contactService";

const steps = ["Select Contacts", "Set Reminders", "Review & Submit"];

const RelationshipWizard = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [currentStep, setCurrentStep] = useState(0);
  const [importMethod, setImportMethod] = useState<string | null>(null);
  const [showImport, setShowImport] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // State to store the selected data throughout the wizard
  const [selectedData, setSelectedData] = useState({
    contacts: [] as Contact[],
    triggers: [] as any[],
    notes: ""
  });

  // Create outreach mutation
  const createOutreachMutation = useMutation({
    mutationFn: async (data: any) => {
      // Create the outreach
      const outreach = await createOutreach(
        {
          title: `Outreach for ${data.contacts.map((c: Contact) => c.name).join(", ")}`,
          description: data.notes || `Relationship plan created on ${new Date().toLocaleDateString()}`,
          priority: "medium",
          due_date: data.triggers.length > 0 
            ? new Date(data.triggers[0].dateTime).toISOString()
            : new Date().toISOString(),
          status: "pending"
        },
        data.contacts.map((c: Contact) => c.id)
      );
      return outreach;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["outreach"] });
      toast({
        title: "Relationship plan created",
        description: "Your outreach plan has been successfully created."
      });
      navigate("/rel8t/relationships");
    },
    onError: (error: any) => {
      console.error("Error creating relationship plan:", error);
      toast({
        title: "Error creating relationship plan",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  // Handler for moving to the next step
  const handleNext = (stepData: any) => {
    // Save the data from current step
    setSelectedData({
      ...selectedData,
      ...stepData
    });
    
    // Move to next step
    setCurrentStep(currentStep + 1);
    window.scrollTo(0, 0);
  };

  // Handler for moving to the previous step
  const handlePrevious = () => {
    setCurrentStep(currentStep - 1);
    window.scrollTo(0, 0);
  };

  // Handler for form submission on final step
  const handleSubmit = async (finalData: any) => {
    setIsSubmitting(true);
    try {
      const completeData = {
        ...selectedData,
        ...finalData
      };
      
      await createOutreachMutation.mutateAsync(completeData);
    } catch (error) {
      console.error("Error submitting relationship:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handler for toggling between direct selection and import
  const toggleImportView = () => {
    setShowImport(!showImport);
    // Reset import method when toggling
    if (!showImport) {
      setImportMethod(null);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Build a Relationship</h1>
          <p className="text-muted-foreground mt-1">
            Create outreach plans and set reminders for your contacts
          </p>
        </div>
        
        {/* Progress indicator */}
        <div className="mb-8">
          <Steps 
            steps={steps} 
            currentStep={currentStep}
          />
        </div>
        
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>
              {currentStep === 0 && (showImport ? "Import Contacts" : "Select Contacts")}
              {currentStep === 1 && "Set Outreach Reminders"}
              {currentStep === 2 && "Review & Submit"}
            </CardTitle>
          </CardHeader>
          
          <CardContent>
            {/* Step 1: Select or Import Contacts */}
            {currentStep === 0 && (
              <div>
                <div className="mb-4">
                  <Button 
                    variant={showImport ? "outline" : "default"}
                    onClick={toggleImportView}
                    className="mr-2"
                  >
                    <ContactIcon className="mr-2 h-4 w-4" />
                    Select Existing Contacts
                  </Button>
                  <Button 
                    variant={showImport ? "default" : "outline"}
                    onClick={toggleImportView}
                  >
                    <FileUp className="mr-2 h-4 w-4" />
                    Import New Contacts
                  </Button>
                </div>
                
                <Separator className="my-4" />
                
                {showImport ? (
                  <ImportContactsStep 
                    onImportComplete={(importedContacts) => {
                      // Add newly imported contacts to selection
                      handleNext({ contacts: importedContacts });
                    }}
                  />
                ) : (
                  <SelectContactsStep 
                    selectedContacts={selectedData.contacts}
                    onNext={handleNext}
                  />
                )}
              </div>
            )}
            
            {/* Step 2: Set Outreach Triggers/Reminders */}
            {currentStep === 1 && (
              <SelectTriggersStep 
                selectedContacts={selectedData.contacts}
                selectedTriggers={selectedData.triggers}
                onNext={handleNext}
                onPrevious={handlePrevious}
              />
            )}
            
            {/* Step 3: Review and Submit */}
            {currentStep === 2 && (
              <ReviewSubmitStep 
                selectedData={selectedData}
                onSubmit={handleSubmit}
                onPrevious={handlePrevious}
                isSubmitting={isSubmitting}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RelationshipWizard;
