
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useSession } from '@/hooks/useSession';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, ArrowRight, Save, Send } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { toast } from '@/hooks/use-toast';

// Simple placeholder components for the wizard steps
const RequestBasicsStep = ({ onNext, initialData }: any) => (
  <div className="space-y-4">
    <h3 className="text-lg font-semibold">Request Basics</h3>
    <p className="text-muted-foreground">Define the basic details of your service request.</p>
    <Button onClick={() => onNext({ title: "Sample Request" })}>
      Continue <ArrowRight className="ml-2 h-4 w-4" />
    </Button>
  </div>
);

const ProjectDetailsStep = ({ onNext, onBack, initialData }: any) => (
  <div className="space-y-4">
    <h3 className="text-lg font-semibold">Project Details</h3>
    <p className="text-muted-foreground">Provide detailed information about your project.</p>
    <div className="flex gap-2">
      <Button variant="outline" onClick={onBack}>
        <ArrowLeft className="mr-2 h-4 w-4" /> Back
      </Button>
      <Button onClick={() => onNext({ details: "Sample details" })}>
        Continue <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
    </div>
  </div>
);

const BudgetTimelineStep = ({ onNext, onBack, initialData }: any) => (
  <div className="space-y-4">
    <h3 className="text-lg font-semibold">Budget & Timeline</h3>
    <p className="text-muted-foreground">Set your budget range and timeline expectations.</p>
    <div className="flex gap-2">
      <Button variant="outline" onClick={onBack}>
        <ArrowLeft className="mr-2 h-4 w-4" /> Back
      </Button>
      <Button onClick={() => onNext({ budget: 5000 })}>
        Continue <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
    </div>
  </div>
);

const ReviewSubmitStep = ({ onSubmit, onBack, formData }: any) => (
  <div className="space-y-4">
    <h3 className="text-lg font-semibold">Review & Submit</h3>
    <p className="text-muted-foreground">Review your request details before submitting.</p>
    <div className="flex gap-2">
      <Button variant="outline" onClick={onBack}>
        <ArrowLeft className="mr-2 h-4 w-4" /> Back
      </Button>
      <Button onClick={onSubmit}>
        Submit Request <Send className="ml-2 h-4 w-4" />
      </Button>
    </div>
  </div>
);

const RequestWizard = () => {
  const { session, logout } = useSession();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  const totalSteps = 4;

  const handleNext = (stepData: any) => {
    setFormData(prev => ({ ...prev, ...stepData }));
    setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async () => {
    setIsSaving(true);
    // Simulate saving the data
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
    toast({
      title: "Request Submitted",
      description: "Your request has been submitted successfully.",
    });
    navigate('/modul8');
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <RequestBasicsStep onNext={handleNext} initialData={formData} />;
      case 2:
        return <ProjectDetailsStep onNext={handleNext} onBack={handleBack} initialData={formData} />;
      case 3:
        return <BudgetTimelineStep onNext={handleNext} onBack={handleBack} initialData={formData} />;
      case 4:
        return <ReviewSubmitStep onSubmit={handleSubmit} onBack={handleBack} formData={formData} />;
      default:
        return <div>Unknown step</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">
              Create Service Request
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={(currentStep / totalSteps) * 100} className="mb-4" />
            
            {renderStepContent()}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RequestWizard;
