
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Steps } from "@/components/ui/steps";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check, ArrowUp, ContactIcon, Clock, Users, FileUp } from "lucide-react";

// Step components
import { SelectContactsStep } from "@/components/rel8t/wizard/SelectContactsStep";
import { SelectTriggersStep } from "@/components/rel8t/wizard/SelectTriggersStep";
import { ReviewSubmitStep } from "@/components/rel8t/wizard/ReviewSubmitStep";
import { ImportContactsStep } from "@/components/rel8t/wizard/ImportContactsStep";

const steps = ["Select Contacts", "Set Reminders", "Review & Submit"];

const RelationshipWizard = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [importMethod, setImportMethod] = useState<string | null>(null);
  const [showImport, setShowImport] = useState(false);
  
  // State to store the selected data throughout the wizard
  const [selectedData, setSelectedData] = useState({
    contacts: [],
    triggers: [],
    notes: ""
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
    try {
      // In a real app, you would submit the data to your API
      console.log("Submitting relationship data:", {
        ...selectedData,
        ...finalData
      });
      
      // Navigate to relationships page after successful submission
      navigate("/rel8t/relationships");
    } catch (error) {
      console.error("Error submitting relationship:", error);
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
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RelationshipWizard;
