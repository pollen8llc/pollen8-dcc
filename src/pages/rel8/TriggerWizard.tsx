import { useState } from "react";
import Navbar from "@/components/Navbar";
import { Rel8OnlyNavigation } from "@/components/rel8t/Rel8OnlyNavigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Zap, ArrowRight, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTriggerWizard } from "@/hooks/rel8t/useTriggerWizard";
import { useNavigate, useSearchParams } from "react-router-dom";
import { TriggerTemplateSelection, TriggerTemplateWithDate } from "@/components/rel8t/triggers/TriggerTemplateSelection";
import { 
  DateSelector, 
  TimeSelector, 
  FrequencySelector, 
  PrioritySelector,
  ChannelSelector,
  type ChannelDetails 
} from "@/components/rel8t/triggers/wizard";

const TriggerWizard = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const returnTo = searchParams.get('returnTo');
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | undefined>();
  
  const { 
    formData, 
    updateFormData, 
    handleSubmit,
  } = useTriggerWizard();

  const handleTemplateSelect = (template: TriggerTemplateWithDate) => {
    const templateDate = template.selectedDate || (() => {
      const newDate = new Date();
      newDate.setDate(newDate.getDate() + template.defaultDaysAhead);
      return newDate;
    })();
    
    updateFormData({
      frequency: template.frequency,
      triggerDate: template.id === 'custom' ? formData.triggerDate : templateDate,
      selectedTemplate: template.id
    });
    
    setSelectedTemplateId(template.id);
    setCurrentStep(2);
  };

  const handleNext = () => {
    if (currentStep === 2) {
      setCurrentStep(3);
    }
  };

  const handlePrevious = () => {
    if (currentStep === 3) {
      setCurrentStep(2);
    } else if (currentStep === 2) {
      setCurrentStep(1);
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await handleSubmit(returnTo || undefined);
    
    if (result) {
      if (returnTo === 'relationship') {
        navigate("/rel8/wizard");
      } else {
        navigate("/rel8/triggers");
      }
    }
  };

  const handleCancel = () => {
    if (returnTo === 'relationship') {
      navigate("/rel8/wizard");
    } else {
      navigate("/rel8/triggers");
    }
  };

  // Map channelDetails to the new format
  const handleChannelDetailsChange = (details: ChannelDetails) => {
    updateFormData({ 
      channelDetails: {
        phone: details.phone,
        email: details.email,
        platform: details.platform,
        handle: details.handle,
        meetingPlatform: details.platform,
        link: details.meetingLink,
        address: details.address,
      }
    });
  };

  const mapChannelDetails = (): ChannelDetails => ({
    phone: formData.channelDetails?.phone,
    email: formData.channelDetails?.email,
    platform: formData.channelDetails?.platform || formData.channelDetails?.meetingPlatform,
    handle: formData.channelDetails?.handle,
    meetingLink: formData.channelDetails?.link,
    address: formData.channelDetails?.address,
  });

  // Validate channel details
  const isChannelDetailsValid = () => {
    if (!formData.outreachChannel) return true;
    const details = formData.channelDetails;
    if (!details) return false;
    
    switch (formData.outreachChannel) {
      case 'text':
      case 'call':
        return !!details.phone?.trim();
      case 'email':
        return !!details.email?.trim();
      case 'dm':
        return !!details.platform?.trim() && !!details.handle?.trim();
      case 'virtual':
        return !!details.meetingPlatform?.trim();
      case 'irl':
        return !!details.address?.trim();
      default:
        return true;
    }
  };

  const stepProgress = (currentStep / 3) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
      <Navbar />
      
      <div className="container mx-auto max-w-2xl px-4 py-6 pb-32">
        {/* Header with Progress */}
        <div className="mb-8 mt-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-primary/10">
                <Zap className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                  Create Reminder
                </h1>
                <p className="text-xs text-muted-foreground">
                  Step {currentStep} of 3
                </p>
              </div>
            </div>
            <div className="flex gap-1.5">
              {[1, 2, 3].map((step) => (
                <div
                  key={step}
                  className={cn(
                    "w-8 h-1.5 rounded-full transition-all duration-300",
                    step <= currentStep ? "bg-primary" : "bg-border/50"
                  )}
                />
              ))}
            </div>
          </div>
          
          {/* Gradient Progress Bar */}
          <div className="h-1 rounded-full bg-border/30 overflow-hidden">
            <div 
              className="h-full rounded-full bg-gradient-to-r from-primary via-primary to-primary/60 transition-all duration-500 ease-out"
              style={{ width: `${stepProgress}%` }}
            />
          </div>
        </div>

        {/* Main Content Area */}
        <div className="bg-background/60 backdrop-blur-xl border-2 border-border/30 rounded-2xl p-6 shadow-xl">
          {/* Step 1: Template Selection */}
          {currentStep === 1 && (
            <TriggerTemplateSelection 
              onSelectTemplate={handleTemplateSelect}
              selectedTemplateId={selectedTemplateId}
            />
          )}

          {/* Step 2: Details Configuration */}
          {currentStep === 2 && (
            <div className="space-y-6 animate-fade-in">
              <div className="text-center space-y-1 mb-6">
                <h2 className="text-lg font-semibold">Configure Your Reminder</h2>
                <p className="text-sm text-muted-foreground">Set the details for your reminder</p>
              </div>

              {/* Reminder Name */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-foreground/80">Reminder Name</label>
                <div className="relative">
                  <Sparkles className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="e.g., Weekly Check-in with John"
                    value={formData.name}
                    onChange={(e) => updateFormData({ name: e.target.value })}
                    className="h-14 pl-12 rounded-xl border-2 border-border/50 bg-background/60 backdrop-blur-sm text-base focus:border-primary/50"
                  />
                </div>
              </div>

              {/* Date Selector */}
              <DateSelector
                selectedDate={formData.triggerDate || new Date()}
                onDateChange={(date) => updateFormData({ triggerDate: date })}
              />

              {/* Time Selector */}
              <TimeSelector
                selectedTime={formData.triggerTime || "09:00"}
                onTimeChange={(time) => updateFormData({ triggerTime: time })}
              />

              {/* Frequency & Priority Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FrequencySelector
                  selectedFrequency={formData.frequency}
                  onFrequencyChange={(freq) => updateFormData({ frequency: freq })}
                />
                <PrioritySelector
                  selectedPriority={formData.priority}
                  onPriorityChange={(priority) => updateFormData({ priority: priority })}
                />
              </div>
            </div>
          )}

          {/* Step 3: Channel Selection */}
          {currentStep === 3 && (
            <form onSubmit={onSubmit} className="space-y-6 animate-fade-in">
              <div className="text-center space-y-1 mb-6">
                <h2 className="text-lg font-semibold">Follow-Up Channel</h2>
                <p className="text-sm text-muted-foreground">How will you reach out?</p>
              </div>

              <ChannelSelector
                selectedChannel={formData.outreachChannel || ""}
                channelDetails={mapChannelDetails()}
                onChannelChange={(channel) => updateFormData({ outreachChannel: channel })}
                onDetailsChange={handleChannelDetailsChange}
              />
            </form>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="mt-6 flex justify-between">
          {currentStep > 1 ? (
            <Button
              type="button"
              variant="outline"
              onClick={handlePrevious}
              className="h-12 px-6 rounded-xl border-2 bg-background/60 backdrop-blur-sm"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          ) : (
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              className="h-12 px-6 rounded-xl border-2 bg-background/60 backdrop-blur-sm"
            >
              Cancel
            </Button>
          )}
          
          {currentStep === 2 && (
            <Button
              type="button"
              onClick={handleNext}
              disabled={!formData.name.trim()}
              className="h-12 px-8 rounded-xl shadow-lg shadow-primary/25"
            >
              Next
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          )}
          
          {currentStep === 3 && (
            <Button
              type="submit"
              onClick={onSubmit}
              disabled={!formData.name.trim() || (formData.outreachChannel && !isChannelDetailsValid())}
              className="h-12 px-8 rounded-xl shadow-lg shadow-primary/25"
            >
              {returnTo === 'relationship' ? 'Add Reminder' : 'Create Reminder'}
            </Button>
          )}
        </div>
      </div>

      {/* Sticky Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-4 pt-2 bg-gradient-to-t from-background via-background to-transparent pointer-events-none">
        <div className="container mx-auto max-w-5xl pointer-events-auto">
          <Rel8OnlyNavigation />
        </div>
      </div>
    </div>
  );
};

export default TriggerWizard;