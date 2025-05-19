
import Navbar from "@/components/Navbar";
import { Rel8Navigation } from "@/components/rel8t/Rel8TNavigation";
import { Card, CardContent } from "@/components/ui/card";
import { Step, Steps } from "@/components/ui/steps";
import { useTriggerWizard } from "@/hooks/rel8t/useTriggerWizard";
import { BasicInfoStep } from "@/components/rel8t/triggers/wizard-steps/BasicInfoStep";
import { BehaviorStep } from "@/components/rel8t/triggers/wizard-steps/BehaviorStep";
import { ScheduleStep } from "@/components/rel8t/triggers/wizard-steps/ScheduleStep";
import { ReviewStep } from "@/components/rel8t/triggers/wizard-steps/ReviewStep";

const TriggerWizard = () => {
  const { currentStep } = useTriggerWizard();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <Rel8Navigation />
        
        <div className="mt-6 mb-8">
          <h1 className="text-3xl font-bold">Create Automation Trigger</h1>
          <p className="text-muted-foreground mt-1">
            Set up automated actions based on specific events or schedules
          </p>
        </div>

        <Card className="mb-6">
          <CardContent className="p-6">
            <Steps currentStep={currentStep} className="mb-8">
              <Step title="Basic Info" />
              <Step title="Behavior" />
              <Step title="Schedule" />
              <Step title="Review" />
            </Steps>

            {currentStep === 1 && <BasicInfoStep />}
            {currentStep === 2 && <BehaviorStep />}
            {currentStep === 3 && <ScheduleStep />}
            {currentStep === 4 && <ReviewStep />}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TriggerWizard;
