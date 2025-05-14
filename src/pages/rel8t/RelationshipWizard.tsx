import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Steps, Step } from "@/components/ui/steps";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import SelectContactsStep from "@/components/rel8t/wizard/SelectContactsStep";
import OutreachForm from "@/components/rel8t/OutreachForm";
import { createOutreach } from "@/services/rel8t/outreachService";
import { toast } from "@/hooks/use-toast";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
} from "@/components/ui/breadcrumb";

const RelationshipWizard = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalSteps = 3;

  const handleNext = () => {
    setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSelectContacts = (contacts: string[]) => {
    setSelectedContacts(contacts);
    handleNext();
  };

  const handleCreateOutreach = async (values: any) => {
    setIsSubmitting(true);
    try {
      await createOutreach(
        {
          title: values.title,
          description: values.description,
          priority: values.priority,
          due_date: values.due_date.toISOString(),
        },
        selectedContacts
      );
      toast({
        title: "Outreach Created",
        description: "Your outreach task has been successfully created.",
      });
      navigate("/rel8t/relationships");
    } finally {
      setIsSubmitting(false);
    }
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
              <BreadcrumbLink href="/rel8t/relationships" className="text-cyan-700 hover:text-cyan-900">Relationships</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbLink className="text-cyan-700">New Outreach</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex items-center mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate("/rel8t/relationships")}
            className="mr-4"
          >
            <ChevronLeft className="h-4 w-4 mr-2" /> Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Create New Outreach</h1>
            <p className="text-sm text-muted-foreground">Plan your outreach and nurture your network</p>
          </div>
        </div>

        <Card className="border-border/20">
          <CardContent className="p-6">
            <Steps currentStep={currentStep} steps={["Select Contacts", "Details", "Review"]} />

            <div className="mt-8">
              {currentStep === 1 && (
                <SelectContactsStep
                  onNext={handleSelectContacts}
                />
              )}
              {currentStep === 2 && (
                <OutreachForm
                  onSubmit={handleCreateOutreach}
                  onCancel={handleBack}
                  isSubmitting={isSubmitting}
                />
              )}
              {currentStep === 3 && (
                <div>
                  <h2>Review</h2>
                  <p>Confirm details and submit</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RelationshipWizard;
